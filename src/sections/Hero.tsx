"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES, getHomeSectionUrl } from '@/lib/routes';
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  FileText, 
  Star, 
  Zap,
  TrendingUp,
  Play,
  Download,
  Palette,
  Calculator,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

// صور العرض المتغيرة (محاكاة للوحة التحكم والأدوات)
const showcaseImages = [
  {
    id: 1,
    title: 'لوحة التحكم الذكية',
    description: 'تابع إنجازاتك وإحصائياتك في مكان واحد',
    audience: 'للشركات',
    color: 'from-green-500 to-emerald-600',
    icon: TrendingUp,
    stats: [
      { label: 'قالب مستخدم', value: '24', color: 'bg-blue-100 text-blue-600' },
      { label: 'شهادة منشأة', value: '156', color: 'bg-amber-100 text-amber-600' },
      { label: 'معدل الاستخدام', value: '89%', color: 'bg-green-100 text-green-600' },
    ],
    activities: [
      { name: 'شهادة تقدير', time: 'منذ ساعة', icon: Award },
      { name: 'تقرير تقييم', time: 'منذ 3 ساعات', icon: FileText },
    ]
  },
  {
    id: 2,
    title: 'منشئ الشهادات الاحترافي',
    description: 'صمم شهاداتك بخطوات بسيطة وسهلة',
    audience: 'للمدارس',
    color: 'from-amber-500 to-orange-600',
    icon: Award,
    preview: {
      title: 'شهادة تقدير',
      subtitle: 'تقديراً للجهود المتميزة',
      recipient: 'اسم المكرم',
      date: '2026-02-20'
    }
  },
  {
    id: 3,
    title: 'حاسبة الدرجات الذكية',
    description: 'احسب درجات طلابك بسرعة ودقة',
    audience: 'للمدارس',
    color: 'from-blue-500 to-cyan-600',
    icon: Calculator,
    preview: {
      subjects: [
        { name: 'الرياضيات', score: 95, total: 100 },
        { name: 'العلوم', score: 88, total: 100 },
        { name: 'اللغة العربية', score: 92, total: 100 },
      ],
      average: '91.7%'
    }
  },
  {
    id: 4,
    title: 'مولد الاختبارات',
    description: 'أنشئ اختبارات متنوعة في ثوانٍ',
    audience: 'للمدارس',
    color: 'from-purple-500 to-pink-600',
    icon: FileText,
    preview: {
      questions: [
        { type: 'اختيار من متعدد', count: 10 },
        { type: 'صح أو خطأ', count: 5 },
        { type: 'مقالي', count: 3 },
      ],
      total: '18 سؤال'
    }
  },
  {
    id: 5,
    title: 'بناء الجداول الدراسية',
    description: 'نظم جداولك الأسبوعية بسهولة',
    audience: 'للجهات',
    color: 'from-teal-500 to-emerald-600',
    icon: Calendar,
    preview: {
      days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      classes: ['رياضيات', 'علوم', 'عربي', 'إنجليزي', 'فنية']
    }
  },
  {
    id: 6,
    title: 'نماذج التقييم',
    description: 'أنشئ نماذج تقييم احترافية',
    audience: 'للجهات',
    color: 'from-rose-500 to-red-600',
    icon: FileText,
    preview: {
      questions: [
        { type: 'تقييم أداء', count: 5 },
        { type: 'استبيان رضا', count: 4 },
        { type: 'تقييم مشروع', count: 3 },
      ],
      total: '12 نموذج'
    }
  },
  {
    id: 7,
    title: 'محرر التقارير',
    description: 'احترف كتابة التقارير المهنية',
    audience: 'للجهات',
    color: 'from-indigo-500 to-purple-600',
    icon: FileText,
    preview: {
      sections: [
        { name: 'المقدمة', words: 250 },
        { name: 'الإحصائيات', words: 500 },
        { name: 'التوصيات', words: 300 },
      ],
      total: '1050 كلمة'
    }
  },
  {
    id: 8,
    title: 'مكتبة القوالب الجاهزة',
    description: 'استخدم قوالب جاهزة واحترافية',
    audience: 'للأفراد',
    color: 'from-cyan-500 to-blue-600',
    icon: Sparkles,
    preview: {
      templates: [
        { name: 'CV احترافي', category: 'سيرة ذاتية' },
        { name: 'كتاب تقرير', category: 'مستندات' },
        { name: 'شهادة تقدير', category: 'شهادات' },
      ],
      total: '50+ قالب'
    }
  }
];

// Floating particles
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-green-primary/30"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '110%',
            opacity: 0 
          }}
          animate={{ 
            y: '-10%',
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Animated gradient orbs
const GradientOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-primary/15 via-green-teal/10 to-transparent blur-[100px]"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-green-light/15 via-green-teal/10 to-transparent blur-[80px]"
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

// Stats data
const stats = [
  { value: 100, suffix: '+', label: 'قالب احترافي', icon: FileText },
  { value: 50, suffix: '+', label: 'أداة ذكية', icon: Zap },
  { value: 10000, suffix: '+', label: 'مستخدم نشط', icon: Users },
  { value: 4.9, suffix: '', label: 'تقييم المستخدمين', icon: Star },
];

// Animated counter - shows numbers immediately
const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayCount(value);
        clearInterval(timer);
      } else {
        setDisplayCount(value % 1 !== 0 ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {value % 1 !== 0 ? displayCount.toFixed(1) : displayCount.toLocaleString()}{suffix}
    </span>
  );
};

// App Frame Wrapper - Makes slides look like real platform interface
const AppFrame = ({ children, title, icon: Icon, iconColor = "text-green-primary" }: { 
  children: React.ReactNode; 
  title: string; 
  icon: React.ElementType;
  iconColor?: string;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative"
    >
      {/* Outer shadow layer for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 dark:from-black/20 dark:to-black/40 rounded-2xl translate-y-2 blur-xl" />
      
      {/* Main app container */}
      <div className="relative bg-white dark:bg-[#1B2D2B] rounded-2xl overflow-hidden border border-gray-200/80 dark:border-green-primary/20 shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
        {/* Top bar - macOS style window chrome */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-[#1a2f2a] dark:to-[#152B26] border-b border-gray-200/80 dark:border-green-primary/10">
          {/* Window controls */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner ring-1 ring-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner ring-1 ring-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-inner ring-1 ring-black/10" />
          </div>
          
          {/* URL bar / App title */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#0D1B1A] rounded-lg text-sm border border-gray-200 dark:border-green-primary/20 shadow-sm">
              <Icon className={`w-4 h-4 ${iconColor}`} />
              <span className="text-gray-600 dark:text-gray-400 font-medium">{title}</span>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-gray-200/60 dark:bg-white/5 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Sidebar + Content layout */}
        <div className="flex">
          {/* Mini Sidebar */}
          <div className="hidden sm:flex flex-col w-12 bg-gray-50/80 dark:bg-[#0D1B1A]/50 border-l border-gray-100 dark:border-green-primary/10 py-3 gap-2 items-center">
            <div className="w-8 h-8 rounded-lg bg-green-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-primary" />
            </div>
            <div className="w-8 h-8 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/5 flex items-center justify-center transition-colors">
              <Award className="w-4 h-4 text-gray-400" />
            </div>
            <div className="w-8 h-8 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/5 flex items-center justify-center transition-colors">
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <div className="w-8 h-8 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/5 flex items-center justify-center transition-colors">
              <Calculator className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">م</span>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 min-h-[280px] sm:min-h-[320px]">
            {children}
          </div>
        </div>
        
        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80 dark:bg-[#0D1B1A]/50 border-t border-gray-100 dark:border-green-primary/10 text-[10px] text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>متصل</span>
          </div>
          <span>mihni.edu.sa</span>
        </div>
      </div>
    </motion.div>
  );
};

// Dashboard Preview Component
const DashboardPreview = ({ data }: { data: typeof showcaseImages[0] }) => {
  return (
    <AppFrame title="لوحة التحكم" icon={TrendingUp} iconColor="text-green-primary">
      <div className="p-4 sm:p-5">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-green-dark dark:text-white flex items-center gap-2">
              مرحباً بك!
            </h3>
            <p className="text-xs text-gray-500">لديك 5 قوالب جديدة</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">PRO</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {data.stats?.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="p-2.5 sm:p-3 bg-gradient-to-b from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-xl text-center border border-gray-100 dark:border-green-primary/10 shadow-sm"
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-1.5 shadow-sm`}>
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-green-dark dark:text-white">{stat.value}</div>
              <div className="text-[10px] text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500 mb-2">النشاط الأخير</div>
          {data.activities?.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-2.5 p-2.5 bg-gradient-to-l from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-xl border border-gray-100 dark:border-green-primary/10"
            >
              <div className="w-7 h-7 rounded-lg bg-green-primary/10 flex items-center justify-center">
                <item.icon className="w-3.5 h-3.5 text-green-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-dark dark:text-white truncate">{item.name}</p>
              </div>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </AppFrame>
  );
};

// Certificate Preview Component
const CertificatePreview = ({ data }: { data: typeof showcaseImages[1] }) => {
  return (
    <AppFrame title="منشئ الشهادات" icon={Award} iconColor="text-amber-500">
      <div className="p-4 sm:p-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-md text-[10px] font-medium text-amber-700 dark:text-amber-400">
              شهادة تقدير
            </div>
            <div className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-md text-[10px] text-gray-500">
              A4
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <Palette className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="px-2.5 py-1 bg-green-primary text-white rounded-md text-[10px] font-medium flex items-center gap-1">
              <Download className="w-3 h-3" />
              تصدير
            </div>
          </div>
        </div>

        {/* Certificate Preview Canvas */}
        <div className="relative aspect-[1.4/1] bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-lg border border-amber-200 shadow-inner overflow-hidden">
          {/* Decorative Frame */}
          <div className="absolute inset-2 border-2 border-amber-300/60 rounded pointer-events-none" />
          <div className="absolute inset-4 border border-amber-200/40 rounded pointer-events-none" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h3 className="text-lg sm:text-xl font-bold text-amber-700">{data.preview?.title}</h3>
              <p className="text-amber-600 text-[10px] sm:text-xs">{data.preview?.subtitle}</p>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto shadow-sm">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              </div>
              <p className="text-sm sm:text-base font-bold text-gray-800">{data.preview?.recipient}</p>
              <p className="text-gray-500 text-[10px]">{data.preview?.date}</p>
            </motion.div>
          </div>
          
          {/* Selection handles (design tool feel) */}
          <div className="absolute inset-6 border-2 border-dashed border-green-primary/40 rounded pointer-events-none" />
          <div className="absolute top-6 left-6 w-2 h-2 bg-green-primary rounded-sm -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-6 right-6 w-2 h-2 bg-green-primary rounded-sm translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-green-primary rounded-sm -translate-x-1/2 translate-y-1/2" />
          <div className="absolute bottom-6 right-6 w-2 h-2 bg-green-primary rounded-sm translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Progress bar */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500">جاري التحميل...</span>
            <span className="text-green-primary font-medium">70%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-primary to-green-teal"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </AppFrame>
  );
};

// Calculator Preview Component
const CalculatorPreview = ({ data }: { data: typeof showcaseImages[2] }) => {
  return (
    <AppFrame title="حاسبة الدرجات" icon={Calculator} iconColor="text-blue-500">
      <div className="p-4 sm:p-5">
        {/* Header with student selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-dark dark:text-white">أحمد محمد</p>
              <p className="text-[10px] text-gray-500">الصف السادس - أ</p>
            </div>
          </div>
          <div className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md text-[10px] font-medium text-blue-700 dark:text-blue-400">
            الفصل الأول
          </div>
        </div>

        {/* Subjects list */}
        <div className="space-y-2 mb-4">
          {data.preview?.subjects?.map((subject: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-center justify-between p-2.5 bg-gradient-to-l from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10"
            >
              <span className="text-xs font-medium text-green-dark dark:text-white">{subject.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 sm:w-20 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${subject.score >= 90 ? 'bg-green-500' : subject.score >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.score}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  />
                </div>
                <span className={`text-xs font-bold ${subject.score >= 90 ? 'text-green-600' : subject.score >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>
                  {subject.score}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Average result card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200/50 dark:border-blue-700/30 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <div>
              <p className="text-[10px] text-gray-500 mb-0.5">المعدل العام</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{data.preview?.average || '0%'}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <div className="mt-2 text-[10px] text-green-600 font-medium">ممتاز مرتفع</div>
        </motion.div>
      </div>
    </AppFrame>
  );
};

// Quiz Preview Component
const QuizPreview = ({ data }: { data: typeof showcaseImages[3] }) => {
  return (
    <AppFrame title="مولد الاختبارات" icon={FileText} iconColor="text-green-primary">
      <div className="p-4 sm:p-5">
        {/* Quiz settings header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-green-dark dark:text-white">اختبار الرياضيات</p>
            <p className="text-[10px] text-gray-500">الصف السادس - الفصل الأول</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-md text-[10px] text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              45 دقيقة
            </div>
          </div>
        </div>

        {/* Question types grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {data.preview?.questions?.map((q: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="p-2.5 bg-gradient-to-b from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10 text-center"
            >
              <div className={`w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center ${
                i === 0 ? 'bg-green-100 dark:bg-green-900/30' : 
                i === 1 ? 'bg-blue-100 dark:bg-blue-900/30' : 
                'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                <span className={`text-base font-bold ${
                  i === 0 ? 'text-green-600' : 
                  i === 1 ? 'text-blue-600' : 
                  'text-amber-600'
                }`}>{q.count}</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">{q.type}</p>
            </motion.div>
          ))}
        </div>

        {/* Preview of a question */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 bg-gradient-to-l from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10 mb-3"
        >
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-green-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-green-primary">1</span>
            </div>
            <div>
              <p className="text-xs text-green-dark dark:text-white mb-2">ما ناتج: 15 × 8 = ؟</p>
              <div className="grid grid-cols-2 gap-1.5">
                {['120', '130', '110', '125'].map((opt, i) => (
                  <div 
                    key={i}
                    className={`px-2 py-1 rounded text-[10px] text-center ${
                      i === 0 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-1 ring-green-500/50' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total and generate button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between p-2.5 bg-gradient-to-r from-green-primary to-green-teal rounded-lg"
        >
          <div className="text-white">
            <p className="text-[10px] opacity-80">إجمالي الأسئلة</p>
            <p className="text-lg font-bold">{data.preview?.total || '0'}</p>
          </div>
          <div className="px-3 py-1.5 bg-white/20 rounded-md text-xs font-medium text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            توليد
          </div>
        </motion.div>
      </div>
    </AppFrame>
  );
};

// Schedule Preview Component
const SchedulePreview = ({ data }: { data: typeof showcaseImages[4] }) => {
  return (
    <AppFrame title="الجدول الدراسي" icon={Calendar} iconColor="text-teal-500">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-green-dark dark:text-white">جدول الأسبوع</p>
            <div className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 rounded text-[10px] font-medium text-teal-700 dark:text-teal-400">
              الصف السادس
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <ArrowLeft className="w-3 h-3 text-gray-400 rotate-180" />
            </div>
            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <ArrowLeft className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Schedule grid */}
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10 overflow-hidden">
          {/* Days header */}
          <div className="grid grid-cols-5 border-b border-gray-100 dark:border-green-primary/10">
            {data.preview?.days?.map((day: string, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                className={`py-2 text-center text-[10px] font-medium ${
                  i === 0 ? 'bg-green-primary/10 text-green-primary' : 'text-gray-500'
                }`}
              >
                {day}
              </motion.div>
            ))}
          </div>

          {/* Time slots */}
          {[0, 1, 2].map((row) => (
            <div key={row} className="grid grid-cols-5 border-b border-gray-50 dark:border-green-primary/5 last:border-b-0">
              {data.preview?.days?.map((_: string, col: number) => {
                const classIndex = (row + col) % (data.preview?.classes?.length || 1);
                const cls = data.preview?.classes?.[classIndex];
                const colors = [
                  { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
                  { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
                  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
                  { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
                  { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-400' },
                ];
                const colorSet = colors[classIndex % colors.length];
                
                return (
                  <motion.div 
                    key={col}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + row * 0.05 + col * 0.03 }}
                    className="p-1.5"
                  >
                    <div className={`${colorSet.bg} ${colorSet.text} text-[9px] sm:text-[10px] p-1.5 rounded text-center font-medium truncate`}>
                      {cls}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-gray-500">رياضيات</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-gray-500">علوم</span>
            </div>
          </div>
          <div className="px-2 py-1 bg-green-primary/10 rounded text-[10px] font-medium text-green-primary">
            6 حصص / يوم
          </div>
        </div>
      </div>
    </AppFrame>
  );
};

// Forms & Assessment Preview Component
const FormsPreview = ({ data }: { data: typeof showcaseImages[5] }) => {
  return (
    <AppFrame title="نماذج التقييم" icon={FileText} iconColor="text-rose-500">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-green-dark dark:text-white">نموذج تقييم الأداء</p>
          <div className="px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 rounded-md text-[10px] font-medium text-rose-700 dark:text-rose-400">
            نشط
          </div>
        </div>

        <div className="space-y-2.5">
          {data.preview?.questions?.map((q: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="p-3 bg-gradient-to-l from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10"
            >
              <div className="flex items-start justify-between mb-1.5">
                <p className="text-xs font-medium text-green-dark dark:text-white">{q.type}</p>
                <span className="text-[10px] text-gray-400">{q.count} أسئلة</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(i + 1) * 30}%` }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-2.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-700/30"
        >
          <p className="text-[10px] text-rose-700 dark:text-rose-400">إجمالي الأسئلة: <span className="font-bold">{data.preview?.total}</span></p>
        </motion.div>
      </div>
    </AppFrame>
  );
};

// Reports Editor Preview Component
const ReportsPreview = ({ data }: { data: typeof showcaseImages[6] }) => {
  return (
    <AppFrame title="محرر التقارير" icon={FileText} iconColor="text-indigo-500">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-green-dark dark:text-white">تقرير ربع سنوي</p>
            <p className="text-[10px] text-gray-500">تم التحديث: اليوم</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {data.preview?.sections?.map((section: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="p-3 bg-gradient-to-b from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <p className="text-xs font-medium text-green-dark dark:text-white">{section.name}</p>
                </div>
                <span className="text-[10px] text-gray-400">{section.words} كلمة</span>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(section.words / 600) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700/30"
        >
          <p className="text-[10px] text-indigo-700 dark:text-indigo-400">إجمالي الكلمات: <span className="font-bold">{data.preview?.total}</span></p>
        </motion.div>
      </div>
    </AppFrame>
  );
};

// Templates Library Preview Component
const TemplatesPreview = ({ data }: { data: typeof showcaseImages[7] }) => {
  return (
    <AppFrame title="مكتبة القوالب" icon={Sparkles} iconColor="text-cyan-500">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-green-dark dark:text-white">جميع القوالب</p>
          <div className="px-2.5 py-1 bg-cyan-100 dark:bg-cyan-900/30 rounded-md text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
            {data.preview?.total}
          </div>
        </div>

        <div className="space-y-2">
          {data.preview?.templates?.map((template: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="p-2.5 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-[#0a4d5e]/20 dark:to-[#0d3a4a]/20 rounded-lg border border-cyan-200 dark:border-cyan-700/30 cursor-pointer hover:border-cyan-400 dark:hover:border-cyan-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-dark dark:text-white truncate">{template.name}</p>
                  <p className="text-[10px] text-gray-500">{template.category}</p>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 text-gray-400 rotate-180" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg border border-cyan-300 dark:border-cyan-700/50 text-center"
        >
          <p className="text-xs font-medium text-cyan-700 dark:text-cyan-400">واصل الاستكشاف لاكتشاف المزيد</p>
        </motion.div>
      </div>
    </AppFrame>
  );
};
const ImageShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 4000); // Slightly longer to let users read content
    return () => clearInterval(interval);
  }, []);

  const currentData = showcaseImages[currentIndex];

  const renderPreview = () => {
    switch (currentData.id) {
      case 1:
        return <DashboardPreview data={currentData} />;
      case 2:
        return <CertificatePreview data={currentData} />;
      case 3:
        return <CalculatorPreview data={currentData} />;
      case 4:
        return <QuizPreview data={currentData} />;
      case 5:
        return <SchedulePreview data={currentData} />;
      case 6:
        return <FormsPreview data={currentData} />;
      case 7:
        return <ReportsPreview data={currentData} />;
      case 8:
        return <TemplatesPreview data={currentData} />;
      default:
        return <DashboardPreview data={currentData} />;
    }
  };

  return (
    <div className="relative">
      {/* Main Preview */}
      <AnimatePresence mode="wait">
        {renderPreview()}
      </AnimatePresence>

      {/* Audience Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-2"
        >
          <p className="text-xs sm:text-sm font-semibold text-green-primary">
            {currentData.audience}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {showcaseImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`الشريحة ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === currentIndex
                ? 'w-6 h-2 bg-green-primary'
                : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-green-primary/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#F0F9F4] via-[#E8F5E9] to-[#C8E6C9] dark:from-[#0A1F1A] dark:via-[#0D1B1A] dark:to-[#0A1512]"
    >
      {/* Background Effects */}
      <GradientOrbs />
      <FloatingParticles />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45, 106, 79, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45, 106, 79, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-28 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left Side - Content */}
          <div className="text-center lg:text-right order-2 lg:order-1 pt-4 lg:pt-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <motion.span 
                className="inline-flex items-center gap-2 text-green-primary dark:text-green-light text-sm font-bold"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4" />
                منصة مِهني - احترافية في كل تفصيلة
              </motion.span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-4"
            >
              <h1 className="text-5xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold leading-tight">
                <span className="text-green-dark dark:text-white lg:inline block">
                  منصة{' '}
                </span>
                <span className="bg-gradient-to-r from-green-primary via-green-teal to-green-light bg-clip-text text-transparent">
                  مِهني
                </span>
              </h1>
            </motion.div>

            {/* Target Audience Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mb-6"
            >
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 tracking-widest">
                <span className="text-green-primary font-semibold">للمدارس</span> • 
                <span className="text-green-primary font-semibold"> الجهات</span> • 
                <span className="text-green-primary font-semibold"> الشركات</span> • 
                <span className="text-green-primary font-semibold"> الأفراد</span> • 
                <span className="text-green-primary font-semibold"> الاستخدام المخصص</span>
              </p>
            </motion.div>

            {/* Marketing Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="text-green-primary font-bold">وفّر وقتك</span> وأنجز عملك باحترافية
                <br className="hidden sm:block" />
                مع <span className="font-semibold">قوالب جاهزة</span> وأدوات تنفيذية متكاملة
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                شهادات • تقييمات • خطط • تقارير • اختبارات • جداول
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-7"
            >
              {[
                { icon: Palette, text: 'تخصيص سهل' },
                { icon: Download, text: 'تصدير فوري' },
                { icon: Clock, text: 'توفر الوقت' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-white/60 dark:bg-[#1B2D2B]/60 rounded-full border border-green-primary/10"
                >
                  <feature.icon className="w-3.5 h-3.5 text-green-primary" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href={ROUTES.START}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-primary to-green-teal text-white px-10 py-7 text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all group font-bold"
                  >
                    ابدأ مجاناً
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href={getHomeSectionUrl('templates')}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-primary/30 text-green-primary hover:bg-green-primary/10 hover:border-green-primary px-8 py-6 text-lg rounded-2xl transition-all font-bold bg-white/50 backdrop-blur-sm"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    استكشف القوالب
                  </Button>
                </Link>
              </motion.div>
            </motion.div>


          </div>

          {/* Right Side - Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative pt-0 lg:pt-12"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-r from-green-primary/20 via-green-teal/20 to-green-light/20 rounded-[2rem] lg:rounded-[3rem] blur-2xl lg:blur-3xl opacity-60" />
            
            {/* Image Showcase Container */}
            <div className="relative mx-auto lg:mx-0 max-w-[320px] sm:max-w-[400px] lg:max-w-[480px]">
              <ImageShowcase />
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 lg:mt-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = [
                'from-blue-500 to-cyan-500',
                'from-green-500 to-emerald-500', 
                'from-purple-500 to-violet-500',
                'from-amber-500 to-orange-500'
              ];
              const bgColors = [
                'bg-blue-50',
                'bg-green-50',
                'bg-purple-50',
                'bg-amber-50'
              ];
              
              return (
                <motion.div 
                  key={index}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={`relative ${bgColors[index]} dark:bg-opacity-10 rounded-xl p-3 sm:p-4 border border-transparent hover:border-green-primary/20 transition-all overflow-hidden group`}
                >
                  {/* Top icon with gradient */}
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${colors[index]} flex items-center justify-center mb-2 shadow-md group-hover:shadow-lg transition-shadow`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  
                  {/* Number */}
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-dark dark:text-white mb-0.5">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  
                  {/* Label */}
                  <div className="text-[10px] sm:text-xs text-gray-500">{stat.label}</div>
                  
                  {/* Subtle decoration */}
                  <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br ${colors[index]} opacity-10 group-hover:opacity-20 transition-opacity`} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
