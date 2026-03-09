"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  Download,
  Clock,
  Briefcase,
  Plus,
  Calendar,
  Award,
  Zap,
  ArrowUpRight,
  Sparkles,
  Filter,
  AlertTriangle,
  LogOut,
  Globe,
  Moon,
  Sun,
  Crown,
  FolderOpen,
  Trash2,
  Edit3,
  Cloud,
  Loader2,
  UserCircle2,
  Gauge,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPlanById, formatStorage } from '@/lib/entitlements/plans';
import { ROUTES, getPaymentUrl } from '@/lib/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import {
  getUserProjects,
  createProject,
  deleteProject as deleteSupabaseProject,
} from '@/lib/supabase/projects';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type UserPlan = 'free' | 'pro' | 'business' | 'enterprise';

interface ProfileRow {
  id: string;
  email: string | null;
  name: string | null;
  plan: string | null;
  created_at: string | null;
}

interface DbProject {
  id: string;
  user_id: string;
  name: string;
  tool_id: string;
  tool_name: string | null;
  data: Record<string, unknown> | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  filesCount: number;
  totalDownloads: number;
  timeSaved: number;
  toolsUsed: number;
}

type SubscriptionPlanRow = {
  code: UserPlan;
  name_ar: string;
  projects_limit: number;
  daily_limit: number;
};

type SubscriptionRow = {
  status: string;
  billing_cycle: string;
  plans: SubscriptionPlanRow | SubscriptionPlanRow[] | null;
};

type UsageTrackingRow = {
  daily_usage: number | null;
  projects_count: number | null;
  storage_used: number | null;
  last_reset: string | null;
};

const quickTools = [
  {
    name: 'منشئ الشهادات',
    icon: Award,
    color: 'from-amber-400 to-orange-500',
    desc: 'صمم شهادات احترافية',
    link: '/tools/certificate-maker',
  },
  {
    name: 'منشئ الاختبارات',
    icon: FileText,
    color: 'from-green-400 to-emerald-500',
    desc: 'أنشئ اختبارات ذكية',
    link: '/tools/quiz-generator',
  },
  {
    name: 'محلل الأداء',
    icon: BarChart3,
    color: 'from-rose-400 to-pink-500',
    desc: 'حلل النتائج والأداء',
    link: '/tools/performance-analyzer',
  },
  {
    name: 'منشئ الجداول',
    icon: Calendar,
    color: 'from-purple-400 to-violet-500',
    desc: 'نظم جداولك',
    link: '/tools/schedule-builder',
  },
];

const sidebarItems = [
  { id: 'dashboard', name: 'لوحة التحكم', icon: LayoutDashboard, active: true, link: ROUTES.DASHBOARD },
  { id: 'templates', name: 'قوالبي', icon: FolderOpen, active: false, link: ROUTES.TEMPLATES },
  { id: 'tools', name: 'الأدوات الذكية', icon: Zap, active: false, link: ROUTES.START },
  { id: 'settings', name: 'الإعدادات', icon: Settings, active: false, link: ROUTES.ACCOUNT },
];

const toolNameMap: Record<string, string> = {
  'certificate-maker': 'شهادة',
  'quiz-generator': 'اختبار',
  'schedule-builder': 'جدول',
  'performance-analyzer': 'تحليل',
  'report-builder': 'تقرير',
  'survey-builder': 'استبيان',
};

function formatRelativeDate(timestamp: string): string {
  const now = Date.now();
  const value = new Date(timestamp).getTime();
  const diff = now - value;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;
  return new Date(timestamp).toLocaleDateString('ar-SA');
}

function estimateProjectBytes(project: DbProject): number {
  return JSON.stringify(project.data ?? {}).length * 2;
}

function estimateProjectSize(project: DbProject): string {
  const bytes = estimateProjectBytes(project);
  const sizeKB = bytes / 1024;

  if (sizeKB < 100) return `${Math.max(1, Math.round(sizeKB))} KB`;
  if (sizeKB < 1024) return `${Math.round(sizeKB)} KB`;
  return `${(sizeKB / 1024).toFixed(1)} MB`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'صباح الخير';
  if (hour < 18) return 'مساء الخير';
  return 'مساء الخير';
}

function getInitial(name: string, email: string): string {
  if (name?.trim()) return name.trim().charAt(0);
  if (email?.trim()) return email.trim().charAt(0).toUpperCase();
  return 'م';
}

function getStorageWarningLevel(percentage: number): 'normal' | 'warning' | 'critical' {
  if (percentage >= 90) return 'critical';
  if (percentage >= 75) return 'warning';
  return 'normal';
}

function normalizePlan(planData: SubscriptionRow['plans']): SubscriptionPlanRow | null {
  if (!planData) return null;
  return Array.isArray(planData) ? planData[0] ?? null : planData;
}

export default function DashboardPage() {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [authLoading, setAuthLoading] = useState(true);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [sessionError, setSessionError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolFilter, setSelectedToolFilter] = useState<string>('all');
  const [greeting, setGreeting] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [notifications] = useState(3);
  const [projectLimit, setProjectLimit] = useState<number>(3);
  const [dailyLimit, setDailyLimit] = useState<number>(20);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('active');
  const [billingCycle, setBillingCycle] = useState<string>('monthly');

  const [userData, setUserData] = useState({
    id: '',
    name: 'مستخدم مهني',
    email: '',
    plan: 'free' as UserPlan,
    planNameAr: 'مجاني',
    avatar: 'م',
  });

  const userPlan = getPlanById(userData.plan);

  const storageInfo = useMemo(() => {
    const used = projects.reduce((sum, project) => sum + estimateProjectBytes(project), 0);

    const limitBytes =
      userPlan?.storageGB === -1 || !userPlan
        ? -1
        : userPlan.storageGB * 1024 * 1024 * 1024;

    const percentage =
      limitBytes === -1 || limitBytes === 0 ? 0 : Math.round((used / limitBytes) * 100);

    return {
      used,
      limit: limitBytes,
      percentage,
    };
  }, [projects, userPlan]);

  const stats: DashboardStats = useMemo(() => {
    const uniqueTools = new Set(projects.map((p) => p.tool_id));
    const timeSaved = projects.length * 5;
    const downloads = Math.floor(projects.length * 0.7);

    return {
      filesCount: projects.length,
      totalDownloads: downloads,
      timeSaved,
      toolsUsed: uniqueTools.size,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.tool_name || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTool = selectedToolFilter === 'all' || project.tool_id === selectedToolFilter;
      return matchesSearch && matchesTool;
    });
  }, [projects, searchQuery, selectedToolFilter]);

  const uniqueTools = useMemo(() => {
    const tools = new Map<string, string>();
    projects.forEach((p) => {
      if (!tools.has(p.tool_id)) {
        tools.set(p.tool_id, p.tool_name || toolNameMap[p.tool_id] || p.tool_id);
      }
    });
    return Array.from(tools.entries());
  }, [projects]);

  const projectUsagePercentage = projectLimit > 0 ? Math.min(Math.round((projects.length / projectLimit) * 100), 100) : 0;
  const projectsRemaining = Math.max(projectLimit - projects.length, 0);
  const projectUsageWarning = projectUsagePercentage >= 100 ? 'critical' : projectUsagePercentage >= 75 ? 'warning' : 'normal';

  const dailyUsagePercentage = dailyLimit > 0 ? Math.min(Math.round((dailyUsage / dailyLimit) * 100), 100) : 0;
  const dailyRemaining = Math.max(dailyLimit - dailyUsage, 0);
  const dailyUsageWarning = dailyUsagePercentage >= 100 ? 'critical' : dailyUsagePercentage >= 75 ? 'warning' : 'normal';

  useEffect(() => {
    const init = async () => {
      try {
        let {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          const raw = typeof window !== 'undefined' ? localStorage.getItem('mihni-manual-session') : null;

          if (raw) {
            const parsed = JSON.parse(raw);
            const { data: restored, error: restoreError } = await supabase.auth.setSession({
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token,
            });

            if (restoreError) {
              setSessionError(restoreError.message);
            } else {
              session = restored.session;
            }
          }
        }

        if (!session) {
          router.push(ROUTES.LOGIN);
          return;
        }

        const user = session.user;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, name, plan, created_at')
          .eq('id', user.id)
          .single<ProfileRow>();

        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select(`
            status,
            billing_cycle,
            plans (
              code,
              name_ar,
              projects_limit,
              daily_limit
            )
          `)
          .eq('user_id', user.id)
          .single<SubscriptionRow>();

        const { data: usageData } = await supabase
          .from('usage_tracking')
          .select('daily_usage, projects_count, storage_used, last_reset')
          .eq('user_id', user.id)
          .single<UsageTrackingRow>();

        const subscriptionPlan = normalizePlan(subscriptionData?.plans);

        const profileName =
          profile?.name ||
          (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '') ||
          'مستخدم مهني';

        const profileEmail = profile?.email || user.email || '';
        const resolvedPlan = subscriptionPlan?.code || (profile?.plan as UserPlan) || 'free';
        const resolvedPlanName = subscriptionPlan?.name_ar || 'مجاني';

        setUserData({
          id: user.id,
          name: profileName,
          email: profileEmail,
          plan: resolvedPlan,
          planNameAr: resolvedPlanName,
          avatar: getInitial(profileName, profileEmail),
        });

        setProjectLimit(subscriptionPlan?.projects_limit ?? 3);
        setDailyLimit(subscriptionPlan?.daily_limit ?? 20);
        setDailyUsage(usageData?.daily_usage ?? 0);
        setSubscriptionStatus(subscriptionData?.status ?? 'active');
        setBillingCycle(subscriptionData?.billing_cycle ?? 'monthly');

        const dbProjects = (await getUserProjects()) as DbProject[];
        setProjects(dbProjects || []);
        setGreeting(getGreeting());
      } finally {
        setAuthLoading(false);
      }
    };

    void init();
  }, [router]);

  const refreshDashboardData = async () => {
    const dbProjects = (await getUserProjects()) as DbProject[];
    setProjects(dbProjects || []);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('daily_usage, projects_count, storage_used, last_reset')
      .eq('user_id', user.id)
      .single<UsageTrackingRow>();

    setDailyUsage(usageData?.daily_usage ?? 0);
  };

  const handleCreateDemoProject = async () => {
    try {
      setCreatingProject(true);

      const now = new Date();
      const projectName = `مشروع تجريبي - ${now.toLocaleDateString('ar-SA')} ${now.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

      const newProject = await createProject({
        name: projectName,
        toolId: 'certificate-maker',
        toolName: 'منشئ الشهادات',
        data: {
          title: 'شهادة تقدير',
          recipient: userData.name,
          createdFrom: 'dashboard-demo',
          createdAt: now.toISOString(),
        },
      });

      if (!newProject) return;

      await refreshDashboardData();
    } finally {
      setCreatingProject(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteSupabaseProject(projectId);
    await refreshDashboardData();
    setShowDeleteConfirm(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mihni-manual-session');
    }
    router.push(ROUTES.HOME);
    router.refresh();
  };

  const storageWarning = getStorageWarningLevel(storageInfo.percentage);

  const statsCards = [
    {
      title: 'الملفات',
      value: stats.filesCount.toString(),
      change: '+1',
      icon: FolderOpen,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'إجمالي التحميلات',
      value: stats.totalDownloads.toString(),
      change: '+2',
      icon: Download,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'الوقت الموفّر',
      value: `${stats.timeSaved} دقيقة`,
      change: '+5',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'الأدوات المستخدمة',
      value: stats.toolsUsed.toString(),
      change: '+1',
      icon: Zap,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0D1B1A] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-green-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0D1B1A]" dir="rtl">
      <header className="bg-white dark:bg-[#1B2D2B] border-b border-green-primary/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-green-dark dark:text-white">مِهني</span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في ملفاتي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-xl border border-green-primary/20 focus:border-green-primary bg-gray-50 dark:bg-[#0D1B1A] text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#152B26] transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {notifications > 0 && (
                  <span className="absolute top-1 left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#152B26] transition-colors">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">المظهر</div>
                  <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
                    <Sun className="w-4 h-4" />
                    <span>فاتح</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
                    <Moon className="w-4 h-4" />
                    <span>داكن</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">اللغة</div>
                  <DropdownMenuItem className="gap-2" disabled>
                    <Globe className="w-4 h-4" />
                    <span>العربية (الافتراضي)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-gray-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-green-dark dark:text-white">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity">
                      {userData.avatar || <UserCircle2 className="w-5 h-5" />}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[220px]">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-sm">{userData.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{userData.email}</p>
                      <Badge className="bg-gradient-to-r from-green-primary to-green-teal text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        {userData.planNameAr}
                      </Badge>
                    </div>
                    <Link href={ROUTES.ACCOUNT}>
                      <DropdownMenuItem className="gap-2">
                        <Settings className="w-4 h-4" />
                        <span>إعدادات الحساب</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.id} whileHover={{ x: 5 }}>
                    <Link
                      href={item.link}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        item.active
                          ? 'bg-gradient-to-r from-green-primary to-green-teal text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-green-primary/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-6 p-5 bg-white dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-green-primary" />
                  <span className="font-bold text-green-dark dark:text-white text-sm">استخدام المشاريع</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {projects.length} / {projectLimit}
                </Badge>
              </div>

              <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <motion.div
                  className={`absolute inset-y-0 right-0 rounded-full ${
                    projectUsageWarning === 'critical'
                      ? 'bg-red-500'
                      : projectUsageWarning === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-green-primary'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${projectUsagePercentage}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>المتبقي: {projectsRemaining}</span>
                <span>{projectUsagePercentage}% مستخدم</span>
              </div>

              {projectUsageWarning !== 'normal' && (
                <div
                  className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${
                    projectUsageWarning === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">
                    {projectUsageWarning === 'critical'
                      ? 'وصلت إلى الحد المسموح للمشاريع في باقتك.'
                      : 'أنت قريب من الحد المسموح للمشاريع.'}
                  </span>
                </div>
              )}

              <Link href={getPaymentUrl({ from: 'dashboard-limit' })}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  ترقية الباقة
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-6 p-5 bg-white dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-primary" />
                  <span className="font-bold text-green-dark dark:text-white text-sm">الاستخدام اليومي</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {dailyUsage} / {dailyLimit}
                </Badge>
              </div>

              <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <motion.div
                  className={`absolute inset-y-0 right-0 rounded-full ${
                    dailyUsageWarning === 'critical'
                      ? 'bg-red-500'
                      : dailyUsageWarning === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-green-primary'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${dailyUsagePercentage}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>المتبقي اليوم: {dailyRemaining}</span>
                <span>{dailyUsagePercentage}% مستخدم</span>
              </div>

              {dailyUsageWarning !== 'normal' && (
                <div
                  className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${
                    dailyUsageWarning === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">
                    {dailyUsageWarning === 'critical'
                      ? 'وصلت إلى الحد اليومي للاستخدام في باقتك.'
                      : 'أنت قريب من الحد اليومي للاستخدام.'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>الحالة: {subscriptionStatus === 'active' ? 'نشط' : subscriptionStatus}</span>
                <span>{billingCycle === 'yearly' ? 'سنوي' : 'شهري'}</span>
              </div>

              <Link href={getPaymentUrl({ from: 'dashboard-daily-limit' })}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  زيادة الحد اليومي
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-5 bg-white dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-green-primary" />
                  <span className="font-bold text-green-dark dark:text-white text-sm">سعة التخزين</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatBytes(storageInfo.used)} / {userPlan?.storageGB === -1 ? '∞' : formatStorage(userPlan?.storageGB || 0)}
                </span>
              </div>

              <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <motion.div
                  className={`absolute inset-y-0 right-0 rounded-full transition-colors ${
                    storageWarning === 'critical'
                      ? 'bg-red-500'
                      : storageWarning === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-green-primary'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>

              {storageWarning !== 'normal' && (
                <div
                  className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${
                    storageWarning === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">
                    {storageWarning === 'critical'
                      ? 'مساحة التخزين شبه ممتلئة!'
                      : 'مساحة التخزين تقترب من الامتلاء'}
                  </span>
                </div>
              )}

              <Link href={getPaymentUrl({ addon: 'storage' })}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  زيادة السعة
                </Button>
              </Link>
            </motion.div>

            {sessionError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl border border-amber-300 bg-amber-50 text-amber-700 text-sm"
              >
                تنبيه الجلسة: {sessionError}
              </motion.div>
            )}

            {userData.plan !== 'enterprise' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold">الترقية للبرو</span>
                </div>
                <p className="text-sm text-white/80 mb-4">احصل على مميزات إضافية وحدود أعلى</p>
                <Link href={getPaymentUrl({ from: 'dashboard' })}>
                  <Button className="w-full bg-white text-orange-500 hover:bg-white/90 font-bold">
                    ترقية الآن
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-primary to-green-teal rounded-3xl p-6 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

              <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">{greeting}</p>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    مرحباً بك، {userData.name}!
                  </h1>
                  <p className="text-white/80 text-sm">
                    لديك <span className="font-bold text-white">{projects.length}</span> من أصل <span className="font-bold text-white">{projectLimit}</span> مشروع، واستخدمت اليوم <span className="font-bold text-white">{dailyUsage}</span> من أصل <span className="font-bold text-white">{dailyLimit}</span> عملية
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => void handleCreateDemoProject()}
                    disabled={creatingProject}
                    className="bg-white text-green-primary hover:bg-white/90 rounded-xl font-bold"
                  >
                    {creatingProject ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        مشروع جديد
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-5 border border-green-primary/10 hover:border-green-primary/30 transition-all shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs text-green-600 bg-green-50"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-green-dark dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </motion.div>
                );
              })}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-green-dark dark:text-white">أدوات سريعة</h2>
                <Link href={ROUTES.START} className="text-sm text-green-primary hover:underline">
                  عرض الكل
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Link href={tool.link}>
                        <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-5 border border-green-primary/10 hover:border-green-primary/30 transition-all cursor-pointer hover:shadow-lg group">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-bold text-green-dark dark:text-white mb-1">{tool.name}</h3>
                          <p className="text-xs text-gray-500">{tool.desc}</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-green-dark dark:text-white">الملفات الأخيرة</h2>
                {uniqueTools.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={selectedToolFilter}
                      onChange={(e) => setSelectedToolFilter(e.target.value)}
                      className="text-sm bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300"
                    >
                      <option value="all">جميع الأدوات</option>
                      {uniqueTools.map(([toolId, toolName]) => (
                        <option key={toolId} value={toolId}>
                          {toolName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {filteredProjects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-12 text-center border border-dashed border-green-primary/20"
                >
                  <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">لا توجد ملفات بعد</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإنشاء مشروعك الأول</p>
                  <Button
                    onClick={() => void handleCreateDemoProject()}
                    disabled={creatingProject}
                    className="bg-green-primary hover:bg-green-teal text-white"
                  >
                    {creatingProject ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        إنشاء مشروع
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {filteredProjects.slice(0, 5).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-[#1B2D2B] rounded-xl p-4 border border-green-primary/10 hover:border-green-primary/30 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-green-dark dark:text-white">{project.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Badge variant="outline" className="text-[10px]">
                                {toolNameMap[project.tool_id] || project.tool_name || project.tool_id}
                              </Badge>
                              <span>{formatRelativeDate(project.updated_at)}</span>
                              <span>{estimateProjectSize(project)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/tools/${project.tool_id}?project=${project.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit3 className="w-4 h-4 text-gray-500 hover:text-green-primary" />
                            </Button>
                          </Link>
                          {showDeleteConfirm === project.id ? (
                            <div className="flex gap-1">
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => void handleDeleteProject(project.id)}
                              >
                                حذف
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => setShowDeleteConfirm(null)}
                              >
                                إلغاء
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setShowDeleteConfirm(project.id)}
                            >
                              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
