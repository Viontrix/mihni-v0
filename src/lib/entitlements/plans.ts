/**
 * Plans & Entitlements System - Single Source of Truth
 * نظام الخطط والصلاحيات - مصدر الحقيقة الوحيد
 */

import type { UserPlan, ToolAccessLevel } from '../tools/types';

export interface UnifiedPlan {
  id: UserPlan;
  name: string;
  nameAr: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscountPercent: number;
  popular: boolean;
  color: string;
  icon: string;
  maxRunsPerDay: number;
  maxSavedProjects: number;
  storageGB: number;
  enabledAccessLevels: ToolAccessLevel[];
  features: {
    included: string[];
    notIncluded: string[];
  };
}

export const unifiedPlans: UnifiedPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameAr: 'المجانية',
    description: 'للتجربة والاستخدام الشخصي المحدود',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscountPercent: 0,
    popular: false,
    color: 'from-gray-400 to-gray-500',
    icon: 'User',
    maxRunsPerDay: 20,
    maxSavedProjects: 3,
    storageGB: 0.1,
    enabledAccessLevels: ['free'],
    features: {
      included: [
        'استخدام القوالب',
        '3 مشاريع محفوظة',
        '20 تشغيل/يوم',
        'تخزين 100 ميجابايت',
        'تصدير أساسي',
      ],
      notIncluded: [
        'الأدوات الذكية الكاملة',
        'تخصيص الألوان',
        'رفع الشعار',
        'إزالة العلامة المائية',
        'التصدير الاحترافي',
      ],
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    nameAr: 'المحترف',
    description: 'للأفراد والمحترفين وصنّاع المحتوى',
    monthlyPrice: 29,
    yearlyPrice: 24,
    yearlyDiscountPercent: 17,
    popular: true,
    color: 'from-green-primary to-green-teal',
    icon: 'Crown',
    maxRunsPerDay: 200,
    maxSavedProjects: 30,
    storageGB: 5,
    enabledAccessLevels: ['free', 'pro'],
    features: {
      included: [
        'جميع الأدوات الذكية الأساسية',
        '30 مشروع محفوظ',
        '200 تشغيل/يوم',
        'تخصيص كامل للألوان',
        'رفع الشعار الخاص',
        'تصدير PDF',
        'تخزين 5 جيجابايت',
      ],
      notIncluded: [
        'التقارير المتقدمة',
        'مستخدمون متزامنون',
        'لوحة إدارة فريق',
      ],
    },
  },
  {
    id: 'business',
    name: 'Business',
    nameAr: 'الأعمال',
    description: 'للمدارس والفرق والجهات الصغيرة',
    monthlyPrice: 79,
    yearlyPrice: 66,
    yearlyDiscountPercent: 16,
    popular: false,
    color: 'from-blue-500 to-cyan-500',
    icon: 'School',
    maxRunsPerDay: 800,
    maxSavedProjects: 150,
    storageGB: 20,
    enabledAccessLevels: ['free', 'pro', 'business'],
    features: {
      included: [
        'كل مميزات المحترف',
        '150 مشروع محفوظ',
        '800 تشغيل/يوم',
        'إزالة العلامة المائية',
        'تقارير متقدمة',
        'تخزين 20 جيجابايت',
        '5 مستخدمين متزامنين',
        'دعم فني أولوية',
      ],
      notIncluded: [
        'إدارة مؤسسية متقدمة',
        'تكامل API كامل',
      ],
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameAr: 'المؤسسات',
    description: 'للشركات الكبرى والجهات الحكومية والمؤسسات التعليمية',
    monthlyPrice: 199,
    yearlyPrice: 166,
    yearlyDiscountPercent: 17,
    popular: false,
    color: 'from-amber-500 to-orange-500',
    icon: 'Building2',
    maxRunsPerDay: 2000,
    maxSavedProjects: 500,
    storageGB: 100,
    enabledAccessLevels: ['free', 'pro', 'business', 'enterprise'],
    features: {
      included: [
        'جميع مميزات الأعمال',
        '500 مشروع محفوظ',
        '2000 تشغيل/يوم',
        'تخزين 100 جيجابايت',
        'إدارة فريق متكاملة',
        'لوحة تحكم إدارية',
        'تكامل API',
        'دعم فني 24/7',
      ],
      notIncluded: [],
    },
  },
];

export interface StorageAddon {
  id: string;
  sizeGB: number;
  monthlyPrice: number;
  yearlyPrice: number;
  label: string;
}

export const storageAddons: StorageAddon[] = [
  { id: 'storage-1gb', sizeGB: 1, monthlyPrice: 9, yearlyPrice: 90, label: '+1 جيجابايت' },
  { id: 'storage-5gb', sizeGB: 5, monthlyPrice: 29, yearlyPrice: 290, label: '+5 جيجابايت' },
  { id: 'storage-20gb', sizeGB: 20, monthlyPrice: 79, yearlyPrice: 790, label: '+20 جيجابايت' },
];

export const featureComparison = [
  { feature: 'استخدام القوالب', free: true, pro: true, business: true, enterprise: true },
  { feature: 'الأدوات الذكية', free: false, pro: true, business: true, enterprise: true },
  { feature: 'عدد المشاريع', free: '3', pro: '30', business: '150', enterprise: '500' },
  { feature: 'التشغيل اليومي', free: '20', pro: '200', business: '800', enterprise: '2000' },
  { feature: 'سعة التخزين', free: '100 ميجا', pro: '5 جيجا', business: '20 جيجا', enterprise: '100 جيجا' },
  { feature: 'تخصيص الألوان', free: false, pro: true, business: true, enterprise: true },
  { feature: 'رفع الشعار', free: false, pro: true, business: true, enterprise: true },
  { feature: 'تصدير PDF', free: false, pro: true, business: true, enterprise: true },
  { feature: 'تصدير Word/Excel', free: false, pro: false, business: true, enterprise: true },
  { feature: 'إزالة العلامة المائية', free: false, pro: false, business: true, enterprise: true },
  { feature: 'التقارير المتقدمة', free: false, pro: false, business: true, enterprise: true },
  { feature: 'المستخدمين المتزامنين', free: '1', pro: '1', business: '5', enterprise: '20' },
  { feature: 'إدارة الفريق', free: false, pro: false, business: false, enterprise: true },
  { feature: 'لوحة تحكم إدارية', free: false, pro: false, business: false, enterprise: true },
  { feature: 'تكامل API', free: false, pro: false, business: 'محدود', enterprise: true },
  { feature: 'دعم فني 24/7', free: false, pro: false, business: false, enterprise: true },
];

export function getPlanById(id: UserPlan): UnifiedPlan | undefined {
  return unifiedPlans.find(plan => plan.id === id);
}

export function getPlanDisplayName(id: UserPlan): string {
  const plan = getPlanById(id);
  return plan?.nameAr || id;
}

export function getPlanPrice(id: UserPlan, billing: 'monthly' | 'yearly' = 'monthly'): number {
  const plan = getPlanById(id);
  if (!plan) return 0;
  return billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
}

export function getYearlySavings(id: UserPlan): { amount: number; percentage: number } {
  const plan = getPlanById(id);
  if (!plan || plan.monthlyPrice === 0) return { amount: 0, percentage: 0 };

  const yearlyFromMonthly = plan.monthlyPrice * 12;
  const yearlyAsMonthly = plan.yearlyPrice * 12;
  const savings = yearlyFromMonthly - yearlyAsMonthly;
  const percentage = yearlyFromMonthly > 0 ? (savings / yearlyFromMonthly) * 100 : 0;

  return {
    amount: Math.round(savings),
    percentage: Math.round(percentage),
  };
}

const accessLevelHierarchy: ToolAccessLevel[] = ['free', 'pro', 'business', 'enterprise'];

export function getAccessLevelIndex(level: ToolAccessLevel): number {
  return accessLevelHierarchy.indexOf(level);
}

export function isAccessLevelHigherOrEqual(
  userLevel: ToolAccessLevel,
  requiredLevel: ToolAccessLevel
): boolean {
  return getAccessLevelIndex(userLevel) >= getAccessLevelIndex(requiredLevel);
}

export function getUpgradeTarget(currentPlan: UserPlan): UserPlan | null {
  const upgradePath: Record<UserPlan, UserPlan | null> = {
    free: 'pro',
    pro: 'business',
    business: 'enterprise',
    enterprise: null,
  };
  return upgradePath[currentPlan];
}

export function getUpgradeButtonText(currentPlan: UserPlan): string {
  const target = getUpgradeTarget(currentPlan);
  if (!target) return 'أنت في أعلى خطة';
  const targetPlan = getPlanById(target);
  return `الترقية إلى ${targetPlan?.nameAr}`;
}

export function formatStorage(sizeGB: number): string {
  if (sizeGB < 1) return `${Math.round(sizeGB * 1024)} ميجابايت`;
  return `${sizeGB} جيجابايت`;
}

export function getStorageWarningLevel(percentage: number): 'normal' | 'warning' | 'critical' {
  if (percentage >= 95) return 'critical';
  if (percentage >= 80) return 'warning';
  return 'normal';
}

export const plans = unifiedPlans;

export function calculateYearlySavings(monthlyPrice: number, yearlyPrice: number): {
  amount: number;
  percentage: number;
} {
  const yearlyFromMonthly = monthlyPrice * 12;
  const yearlyAsMonthly = yearlyPrice * 12;
  const savings = yearlyFromMonthly - yearlyAsMonthly;
  const percentage = yearlyFromMonthly > 0 ? (savings / yearlyFromMonthly) * 100 : 0;

  return {
    amount: Math.round(savings),
    percentage: Math.round(percentage),
  };
}
