"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  User,
  History,
  FolderOpen,
  LogOut,
  Crown,
  Calendar,
  AlertCircle,
  Check,
  Loader2,
  ExternalLink,
  Trash2,
  Download,
  HardDrive,
  TrendingUp,
  Zap,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ROUTES, getHomeSectionUrl } from '@/lib/routes';
import { supabase } from '@/lib/supabase';

import {
  getCurrentPlan,
  getSubscription,
  updatePlan,
  createCustomerPortalSession,
  isSubscriptionExpiringSoon,
  getDaysUntilRenewal,
} from '@/lib/billing/subscription';
import { getPlanById, getPlanDisplayName } from '@/lib/entitlements/plans';
import { getTodayRunCount } from '@/lib/usage/store';
import {
  getSavedProjects,
  getProjectCount,
  deleteProject,
  exportData as exportProjectsData,
  getToolHistory,
  clearHistory,
  deleteHistoryItem,
} from '@/lib/storage/projects';
import { clearAnalytics, getMostUsedTools, getDailyStats } from '@/lib/analytics/track';
import {
  getStorageInfo,
  formatBytes,
  isStorageNearLimit,
} from '@/lib/storage/storage-tracker';
import type { UserPlan, SavedProject, ToolHistoryItem } from '@/lib/tools/types';
import Navbar from '@/sections/Navbar';

function AccountPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0D1B1A] text-right" dir="rtl">
      <Navbar />
      <div className="h-[80px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-primary" />
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل صفحة الحساب...</p>
        </Card>
      </div>
    </div>
  );
}

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const [todayRuns, setTodayRuns] = useState(0);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [history, setHistory] = useState<ToolHistoryItem[]>([]);
  const [mostUsedTools, setMostUsedTools] = useState<
    { toolId: string; toolName: string; count: number }[]
  >([]);
  const [dailyStats, setDailyStats] = useState<{ date: string; runs: number; opens: number }[]>([]);
  const [storageInfo, setStorageInfo] = useState({ used: 0, limit: 0, percentage: 0 });

  const loadData = () => {
    setTodayRuns(getTodayRunCount());
    setProjects(getSavedProjects());
    setHistory(getToolHistory());
    setMostUsedTools(getMostUsedTools(5));
    setDailyStats(getDailyStats(7));
    setStorageInfo(getStorageInfo());
  };

  useEffect(() => {
    const initialize = async () => {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && typeof window !== 'undefined') {
        const raw = localStorage.getItem('mihni-manual-session');
        if (raw) {
          const parsed = JSON.parse(raw);
          const { data: restored } = await supabase.auth.setSession({
            access_token: parsed.access_token,
            refresh_token: parsed.refresh_token,
          });
          session = restored.session;
        }
      }

      const user = session?.user;

      if (!user) {
        router.push(ROUTES.LOGIN);
        return;
      }

      setUserEmail(user.email ?? '');
      setUserName((user.user_metadata?.full_name as string) || 'مستخدم مهني');

      const plan = getCurrentPlan();
      setUserPlan(plan);
      setActiveTab(searchParams.get('tab') || 'overview');
      loadData();

      if (searchParams.get('checkout') === 'success') {
        toast.success('تم الاشتراك بنجاح!');
      }

      setAuthLoading(false);
    };

    void initialize();
  }, [router, searchParams]);

  const handlePlanChange = (newPlan: UserPlan) => {
    updatePlan(newPlan);
    setUserPlan(newPlan);
    toast.success(`تم تغيير الخطة إلى ${getPlanDisplayName(newPlan)}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mihni-manual-session');
    }
    router.push(ROUTES.HOME);
    router.refresh();
  };

  const handlePortalAccess = async () => {
    setIsLoading(true);
    try {
      const portal = await createCustomerPortalSession(window.location.href);
      if (portal?.url) {
        window.location.href = portal.url;
      } else {
        router.push(getHomeSectionUrl('pricing'));
      }
    } catch {
      router.push(getHomeSectionUrl('pricing'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      deleteProject(projectId);
      setProjects(getSavedProjects());
      toast.success('تم حذف المشروع');
    }
  };

  const handleDeleteHistoryItem = (itemId: string) => {
    deleteHistoryItem(itemId);
    setHistory(getToolHistory());
  };

  const handleClearHistory = () => {
    if (confirm('هل أنت متأكد من مسح السجل؟')) {
      clearHistory();
      setHistory([]);
      toast.success('تم مسح السجل');
    }
  };

  const handleExportData = () => {
    const data = exportProjectsData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahni-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير البيانات');
  };

  const planDetails = getPlanById(userPlan);
  const subscription = getSubscription();
  const isExpiringSoon = isSubscriptionExpiringSoon();
  const daysUntilRenewal = getDaysUntilRenewal();

  if (authLoading) {
    return <AccountPageFallback />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0D1B1A] text-right" dir="rtl">
      <Navbar />
      <div className="h-[80px]" />

      <div className="bg-white dark:bg-[#1B2D2B] border-b border-green-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4 text-right">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-green-dark dark:text-white">{userName}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap justify-end">
                  <Badge className={cn('bg-gradient-to-r text-white', planDetails?.color)}>
                    <Crown className="w-3 h-3 ml-1" />
                    {planDetails?.nameAr}
                  </Badge>
                  <Badge variant="outline" className="text-slate-600">
                    <Mail className="w-3 h-3 ml-1" />
                    {userEmail}
                  </Badge>
                  {isExpiringSoon && userPlan !== 'free' && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      <AlertCircle className="w-3 h-3 ml-1" />
                      ينتهي خلال {daysUntilRenewal} يوم
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Button variant="outline" onClick={() => router.push(ROUTES.START)}>
                العودة للأدوات
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="subscription">الاشتراك</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="history">السجل</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 text-right">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 text-right">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div>
                    <p className="text-sm text-gray-500">استخدام اليوم</p>
                    <p className="text-2xl font-bold">{todayRuns}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-primary" />
                  </div>
                </div>
                <Progress
                  value={(todayRuns / (planDetails?.maxRunsPerDay || 10)) * 100}
                  className="mt-4"
                />
              </Card>

              <Card className="p-6 text-right">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div>
                    <p className="text-sm text-gray-500">المشاريع المحفوظة</p>
                    <p className="text-2xl font-bold">{getProjectCount()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 text-right">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div>
                    <p className="text-sm text-gray-500">الأدوات المستخدمة</p>
                    <p className="text-2xl font-bold">{mostUsedTools.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <History className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className={`p-6 text-right ${isStorageNearLimit() ? 'border-amber-400' : ''}`}>
                <div className="flex items-center justify-between flex-row-reverse">
                  <div>
                    <p className="text-sm text-gray-500">سعة التخزين</p>
                    <p className="text-2xl font-bold">
                      {storageInfo.limit === -1 ? 'غير محدود' : `${storageInfo.percentage}%`}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isStorageNearLimit() ? 'bg-amber-100' : 'bg-cyan-100'
                    }`}
                  >
                    <HardDrive
                      className={`w-6 h-6 ${
                        isStorageNearLimit() ? 'text-amber-600' : 'text-cyan-600'
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{storageInfo.limit === -1 ? '∞' : formatBytes(storageInfo.limit)}</span>
                    <span>{formatBytes(storageInfo.used)}</span>
                  </div>
                  <Progress
                    value={storageInfo.limit === -1 ? 0 : storageInfo.percentage}
                    className={`h-2 ${isStorageNearLimit() ? 'bg-amber-100' : ''}`}
                  />
                  {isStorageNearLimit() && (
                    <div className="mt-2 flex items-center gap-2 text-amber-600 text-xs justify-end">
                      <span>التخزين شبه ممتلئ</span>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <Card className="p-6 text-right">
              <h3 className="font-semibold mb-4 text-green-dark dark:text-white">
                الأدوات الأكثر استخداماً
              </h3>
              {mostUsedTools.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لم تستخدم أي أدوات بعد</p>
              ) : (
                <div className="space-y-3">
                  {mostUsedTools.map((tool, idx) => (
                    <div key={tool.toolId} className="flex items-center justify-between flex-row-reverse">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm">
                          {idx + 1}
                        </span>
                        <span className="text-green-dark dark:text-white">{tool.toolName}</span>
                      </div>
                      <Badge variant="outline">{tool.count} مرة</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6 text-right">
            <Card className="p-6 text-right">
              <div className="flex items-start justify-between flex-row-reverse">
                <div>
                  <h3 className="font-semibold text-lg text-green-dark dark:text-white">
                    خطتك الحالية
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap justify-end">
                    <Badge className={cn('bg-gradient-to-r text-white', planDetails?.color)}>
                      {planDetails?.nameAr}
                    </Badge>
                    {subscription?.status === 'active' && (
                      <Badge variant="outline" className="text-green-600">
                        <Check className="w-3 h-3 ml-1" />
                        نشط
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      {planDetails?.maxRunsPerDay === -1 ? 'غير محدود' : planDetails?.maxRunsPerDay}{' '}
                      <span className="text-gray-500">:التشغيل اليومي</span>
                    </p>
                    <p>
                      {planDetails?.maxSavedProjects === -1
                        ? 'غير محدود'
                        : planDetails?.maxSavedProjects}{' '}
                      <span className="text-gray-500">:المشاريع</span>
                    </p>
                    {subscription && userPlan !== 'free' && (
                      <>
                        <p>
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString('ar-SA')}{' '}
                          <span className="text-gray-500">:تاريخ التجديد</span>
                        </p>
                        <p>
                          {planDetails?.monthlyPrice} ر.س/شهر <span className="text-gray-500">:السعر</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <Button onClick={handlePortalAccess} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 ml-2" />
                  )}
                  إدارة الاشتراك
                </Button>
              </div>
            </Card>

            <Card className="p-6 text-right">
              <h3 className="font-semibold mb-4 text-green-dark dark:text-white">
                تغيير الخطة (للاختبار)
              </h3>
              <div className="flex flex-wrap gap-2 justify-end">
                {(['free', 'pro', 'business', 'enterprise'] as UserPlan[]).map((plan) => (
                  <Button
                    key={plan}
                    variant={userPlan === plan ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePlanChange(plan)}
                    className={userPlan === plan ? 'bg-green-primary' : ''}
                  >
                    {getPlanDisplayName(plan)}
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6 text-right">
            <div className="flex items-center justify-between flex-row-reverse">
              <h3 className="font-semibold text-green-dark dark:text-white">مشاريعي المحفوظة</h3>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">لا توجد مشاريع محفوظة</p>
                <Button onClick={() => router.push(ROUTES.START)} className="bg-green-primary">
                  استكشف الأدوات
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-4 text-right">
                    <div className="flex items-center justify-between flex-row-reverse">
                      <div>
                        <h4 className="font-semibold text-green-dark dark:text-white">
                          {project.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(project.createdAt).toLocaleDateString('ar-SA')} - {project.toolName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/tools/${project.toolId}?project=${project.id}`)
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6 text-right">
            <div className="flex items-center justify-between flex-row-reverse">
              <h3 className="font-semibold text-green-dark dark:text-white">سجل النشاط</h3>
              {history.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearHistory}>
                  <Trash2 className="w-4 h-4 ml-2" />
                  مسح السجل
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <Card className="p-12 text-center">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا يوجد سجل نشاط</p>
              </Card>
            ) : (
              <div className="grid gap-3">
                {history.slice(0, 10).map((item) => (
                  <Card key={item.id} className="p-4 text-right">
                    <div className="flex items-center justify-between flex-row-reverse">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-green-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-green-dark dark:text-white">
                            {item.toolName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleTimeString('ar-SA')} - {new Date(item.timestamp).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteHistoryItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 text-right">
            <Card className="p-6 text-right">
              <h3 className="font-semibold mb-4 text-green-dark dark:text-white">إعدادات الحساب</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex-row-reverse text-right">
                  <div>
                    <p className="font-medium text-green-dark dark:text-white">تصدير البيانات</p>
                    <p className="text-sm text-gray-500">تحميل جميع بياناتك ومشاريعك</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 ml-2" />
                    تصدير
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex-row-reverse text-right">
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">مسح جميع البيانات</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      حذف جميع المشاريع والسجلات
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.')) {
                        clearHistory();
                        clearAnalytics();
                        toast.success('تم مسح جميع البيانات');
                        loadData();
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    مسح
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageFallback />}>
      <AccountPageContent />
    </Suspense>
  );
}
