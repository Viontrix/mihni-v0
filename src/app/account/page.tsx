"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ROUTES, getHomeSectionUrl } from '@/lib/routes';
import { logout } from '@/lib/auth/store';

import { getCurrentPlan, getSubscription, updatePlan, createCustomerPortalSession, isSubscriptionExpiringSoon, getDaysUntilRenewal } from '@/lib/billing/subscription';
import { getPlanById, getPlanDisplayName } from '@/lib/entitlements/plans';
import { getTodayRunCount } from '@/lib/usage/store';
import { getSavedProjects, getProjectCount, deleteProject, exportData as exportProjectsData } from '@/lib/storage/projects';
import { getToolHistory, clearHistory, deleteHistoryItem } from '@/lib/storage/projects';
import { clearAnalytics, getMostUsedTools, getDailyStats } from '@/lib/analytics/track';
import { getStorageInfo, formatBytes, isStorageNearLimit, isStorageFull } from '@/lib/storage/storage-tracker';
import type { UserPlan, SavedProject, ToolHistoryItem } from '@/lib/tools/types';
import Navbar from '@/sections/Navbar';

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data states
  const [todayRuns, setTodayRuns] = useState(0);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [history, setHistory] = useState<ToolHistoryItem[]>([]);
  const [mostUsedTools, setMostUsedTools] = useState<{ toolId: string; toolName: string; count: number }[]>([]);
  const [dailyStats, setDailyStats] = useState<{ date: string; runs: number; opens: number }[]>([]);
  const [storageInfo, setStorageInfo] = useState({ used: 0, limit: 0, percentage: 0 });

  useEffect(() => {
    const plan = getCurrentPlan();
    setUserPlan(plan);
    loadData();

    // Handle checkout success
    if (searchParams.get('checkout') === 'success') {
      toast.success('تم الاشتراك بنجاح!');
    }
  }, [searchParams]);

  const loadData = () => {
    setTodayRuns(getTodayRunCount());
    setProjects(getSavedProjects());
    setHistory(getToolHistory());
    setMostUsedTools(getMostUsedTools(5));
    setDailyStats(getDailyStats(7));
    setStorageInfo(getStorageInfo());
  };

  const handlePlanChange = (newPlan: UserPlan) => {
    updatePlan(newPlan);
    setUserPlan(newPlan);
    toast.success(`تم تغيير الخطة إلى ${getPlanDisplayName(newPlan)}`);
  };

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const handlePortalAccess = async () => {
    setIsLoading(true);
    try {
      const portal = await createCustomerPortalSession(window.location.href);
      portal.url;
      toast.info('سيتم توجيهك لبوابة العميل...');
    } catch {
      toast.error('حدث خطأ');
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
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0D1B1A]" dir="rtl">
      <Navbar />
      <div className="h-[80px]" />
      
      {/* Header */}
      <div className="bg-white dark:bg-[#1B2D2B] border-b border-green-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-dark dark:text-white">حسابي</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn('bg-gradient-to-r text-white', planDetails?.color)}>
                    <Crown className="w-3 h-3 mr-1" />
                    {planDetails?.nameAr}
                  </Badge>
                  {isExpiringSoon && userPlan !== 'free' && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      ينتهي خلال {daysUntilRenewal} يوم
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(ROUTES.START)}>
                العودة للأدوات
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="subscription">الاشتراك</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="history">السجل</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
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

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">المشاريع المحفوظة</p>
                    <p className="text-2xl font-bold">{getProjectCount()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">الأدوات المستخدمة</p>
                    <p className="text-2xl font-bold">{mostUsedTools.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <History className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              {/* Storage Card */}
              <Card className={`p-6 ${isStorageNearLimit() ? 'border-amber-400' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">سعة التخزين</p>
                    <p className="text-2xl font-bold">
                      {storageInfo.limit === -1 ? 'غير محدود' : `${storageInfo.percentage}%`}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isStorageNearLimit() ? 'bg-amber-100' : 'bg-cyan-100'
                  }`}>
                    <HardDrive className={`w-6 h-6 ${isStorageNearLimit() ? 'text-amber-600' : 'text-cyan-600'}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{formatBytes(storageInfo.used)}</span>
                    <span>{storageInfo.limit === -1 ? '∞' : formatBytes(storageInfo.limit)}</span>
                  </div>
                  <Progress 
                    value={storageInfo.limit === -1 ? 0 : storageInfo.percentage} 
                    className={`h-2 ${isStorageNearLimit() ? 'bg-amber-100' : ''}`}
                  />
                  {isStorageNearLimit() && (
                    <div className="mt-2 flex items-center gap-2 text-amber-600 text-xs">
                      <AlertCircle className="w-4 h-4" />
                      <span>التخزين شبه ممتلئ</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Most Used Tools */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-green-dark dark:text-white">الأدوات الأكثر استخداماً</h3>
              {mostUsedTools.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لم تستخدم أي أدوات بعد</p>
              ) : (
                <div className="space-y-3">
                  {mostUsedTools.map((tool, idx) => (
                    <div key={tool.toolId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
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

            {/* Weekly Usage Chart */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-green-dark dark:text-white">الاستخدام الأسبوعي</h3>
              <div className="flex items-end gap-2 h-32">
                {dailyStats.map((stat) => (
                  <div key={stat.date} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-green-primary rounded-t"
                      style={{ 
                        height: `${Math.max(10, (stat.runs / Math.max(...dailyStats.map(s => s.runs), 1)) * 100)}%`,
                        minHeight: stat.runs > 0 ? '20px' : '4px'
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      {new Date(stat.date).toLocaleDateString('ar-SA', { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-green-dark dark:text-white">خطتك الحالية</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={cn('bg-gradient-to-r text-white', planDetails?.color)}>
                      {planDetails?.nameAr}
                    </Badge>
                    {subscription?.status === 'active' && (
                      <Badge variant="outline" className="text-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        نشط
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="text-gray-500">التشغيل اليومي:</span> {planDetails?.maxRunsPerDay === -1 ? 'غير محدود' : planDetails?.maxRunsPerDay}</p>
                    <p><span className="text-gray-500">المشاريع:</span> {planDetails?.maxSavedProjects === -1 ? 'غير محدود' : planDetails?.maxSavedProjects}</p>
                    {subscription && userPlan !== 'free' && (
                      <>
                        <p><span className="text-gray-500">تاريخ التجديد:</span> {new Date(subscription.currentPeriodEnd).toLocaleDateString('ar-SA')}</p>
                        <p><span className="text-gray-500">السعر:</span> {planDetails?.monthlyPrice} ر.س/شهر</p>
                      </>
                    )}
                  </div>
                </div>
                <Button onClick={handlePortalAccess} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4 mr-2" />}
                  إدارة الاشتراك
                </Button>
              </div>
            </Card>

            {/* Change Plan (for testing) */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-green-dark dark:text-white">تغيير الخطة (للاختبار)</h3>
              <div className="flex flex-wrap gap-2">
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

            {/* Upgrade CTA */}
            {userPlan !== 'enterprise' && (
              <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">احصل على المزيد!</h3>
                <p className="text-green-700 dark:text-green-300 mb-4">ترقية لخطة أعلى تفتح لك مميزات إضافية</p>
                <Button onClick={() => router.push(getHomeSectionUrl('pricing'))} className="bg-green-500 hover:bg-green-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  عرض الخطط
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-green-dark dark:text-white">مشاريعي المحفوظة</h3>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">لا توجد مشاريع محفوظة</p>
                <Button onClick={() => router.push(ROUTES.START)} className="bg-green-primary">استكشف الأدوات</Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-green-dark dark:text-white">{project.name}</h4>
                        <p className="text-sm text-gray-500">
                          {project.toolName} - {new Date(project.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => router.push(`/tools/${project.toolId}?project=${project.id}`)}
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

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-green-dark dark:text-white">سجل النشاط</h3>
              {history.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearHistory}>
                  <Trash2 className="w-4 h-4 mr-2" />
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
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-green-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-green-dark dark:text-white">{item.toolName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleDateString('ar-SA')} - {new Date(item.timestamp).toLocaleTimeString('ar-SA')}
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

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-green-dark dark:text-white">إعدادات الحساب</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-green-dark dark:text-white">تصدير البيانات</p>
                    <p className="text-sm text-gray-500">تحميل جميع بياناتك ومشاريعك</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    تصدير
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">مسح جميع البيانات</p>
                    <p className="text-sm text-red-600 dark:text-red-400">حذف جميع المشاريع والسجلات</p>
                  </div>
                  <Button variant="destructive" onClick={() => {
                    if (confirm('هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.')) {
                      clearHistory();
                      clearAnalytics();
                      toast.success('تم مسح جميع البيانات');
                      loadData();
                    }
                  }}>
                    <Trash2 className="w-4 h-4 mr-2" />
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
