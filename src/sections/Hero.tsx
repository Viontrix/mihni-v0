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
  Users,
  ChevronRight
} from 'lucide-react';

// صور العرض المتغيرة (محاكاة للوحة التحكم والأدوات) - 10 شرائح
const showcaseImages = [
  {
    id: 1,
    title: 'منشئ الشهادات',
    type: 'certificate',
    icon: Award,
    preview: {
      title: 'شهادة تقدير',
      subtitle: 'تقديراً للجهود المتميزة',
      recipient: 'أحمد محمد العلي',
      date: '2026-03-10'
    }
  },
  {
    id: 2,
    title: 'مولد الاختبارات',
    type: 'quiz',
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
    id: 3,
    title: 'محرر التقارير',
    type: 'report',
    icon: FileText,
    preview: {
      sections: [
        { name: 'ملخص الأداء', pages: 1 },
        { name: 'التحليل التفصيلي', pages: 2 },
        { name: 'الإحصائيات', pages: 1 },
      ],
      totalPages: 4
    }
  },
  {
    id: 4,
    title: 'منشئ الاستبانات',
    type: 'survey',
    icon: FileText,
    preview: {
      questions: [
        { type: 'اختيار متعدد', count: 8 },
        { type: 'مقياس تقييم', count: 5 },
        { type: 'نص مفتوح', count: 2 },
      ],
      total: '15 سؤال'
    }
  },
  {
    id: 5,
    title: 'لوحة التحكم',
    type: 'dashboard',
    icon: TrendingUp,
    stats: [
      { label: 'قالب مستخدم', value: '24', color: 'bg-blue-100 text-blue-600' },
      { label: 'شهادة منشأة', value: '156', color: 'bg-amber-100 text-amber-600' },
      { label: 'معدل الاستخدام', value: '89%', color: 'bg-green-100 text-green-600' },
    ],
    activities: [
      { name: 'شهادة تقدير جديدة', time: 'منذ ساعة', icon: Award },
      { name: 'تقرير تقييم', time: 'منذ 3 ساعات', icon: FileText },
    ]
  },
  {
    id: 6,
    title: 'منشئ الجداول',
    type: 'schedule',
    icon: Calendar,
    preview: {
      days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      classes: ['رياضيات', 'علوم', 'عربي', 'إنجليزي', 'فنية']
    }
  },
  {
    id: 7,
    title: 'منشئ الخطط',
    type: 'planning',
    icon: Calendar,
    preview: {
      phases: [
        { title: 'التخطيط', progress: 100, color: 'bg-blue-500' },
        { title: 'التنفيذ', progress: 60, color: 'bg-green-500' },
        { title: 'المراجعة', progress: 20, color: 'bg-amber-500' },
      ],
      timeline: '12 أسبوع'
    }
  },
  {
    id: 8,
    title: 'القوالب الجاهزة',
    type: 'templates',
    icon: TrendingUp,
    preview: {
      categories: [
        { name: 'تعليم', count: 24 },
        { name: 'إدارة', count: 18 },
        { name: 'تقييم', count: 15 },
      ],
      featured: ['شهادة احترافية', 'اختبار ديناميكي', 'تقرير شامل']
    }
  },
  {
    id: 9,
    title: 'منشئ العروض',
    type: 'presentation',
    icon: Play,
    preview: {
      slides: [
        { title: 'الشريحة الأولى', type: 'عنوان' },
        { title: 'المحتوى', type: 'محتوى' },
        { title: 'الخلاصة', type: 'إغلاق' },
      ],
      totalSlides: 8
    }
  },
  {
    id: 10,
    title: 'مكتبة الأدوات',
    type: 'library',
    icon: TrendingUp,
    preview: {
      tools: [
        { name: 'الشهادات', count: 25, color: 'bg-amber-100' },
        { name: 'الاختبارات', count: 18, color: 'bg-green-100' },
        { name: 'التقارير', count: 12, color: 'bg-blue-100' },
      ],
      recentlyUsed: 5
    }
  },
];

// Floating particles - using fixed positions to avoid hydration mismatch
const particlePositions = [
  { x: 5, duration: 12, delay: 0.5 },
  { x: 15, duration: 14, delay: 1.2 },
  { x: 25, duration: 10, delay: 2.1 },
  { x: 35, duration: 16, delay: 0.8 },
  { x: 45, duration: 11, delay: 3.2 },
  { x: 55, duration: 13, delay: 1.5 },
  { x: 65, duration: 15, delay: 2.8 },
  { x: 75, duration: 9, delay: 0.3 },
  { x: 85, duration: 12, delay: 4.1 },
  { x: 95, duration: 14, delay: 1.9 },
  { x: 10, duration: 11, delay: 3.5 },
  { x: 30, duration: 13, delay: 2.4 },
  { x: 50, duration: 15, delay: 0.7 },
  { x: 70, duration: 10, delay: 4.8 },
  { x: 90, duration: 12, delay: 1.1 },
];

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particlePositions.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-green-primary/30"
          initial={{ 
            x: `${particle.x}%`, 
            y: '110%',
            opacity: 0 
          }}
          animate={{ 
            y: '-10%',
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
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
      {/* Outer shadow layer for depth — softened */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/3 to-black/10 dark:from-black/15 dark:to-black/30 rounded-xl translate-y-1.5 blur-lg" />
      
      {/* Main app container */}
      <div className="relative bg-white dark:bg-[#1B2D2B] rounded-xl overflow-hidden border border-gray-200/70 dark:border-green-primary/20 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
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
          <div className="flex h-[320px] sm:h-[360px]">
            {/* Mini Sidebar */}
            <div className="hidden sm:flex flex-col w-12 bg-gray-50/80 dark:bg-[#0D1B1A]/50 border-l border-gray-100 dark:border-green-primary/10 py-3 gap-2 items-center flex-shrink-0">
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
            
            {/* Main content area — scrollable internally so slides never push height */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
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
    <AppFrame title="منشئ ال����������������هادات" icon={Award} iconColor="text-amber-500">
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

// Report Preview Component
const ReportPreview = ({ data }: { data: typeof showcaseImages[2] }) => {
  return (
    <AppFrame title="محرر التقارير" icon={FileText} iconColor="text-green-primary">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-green-dark dark:text-white">تقرير الأداء الفصلي</p>
            <p className="text-[10px] text-gray-500">الصف السادس - الفصل الأول</p>
          </div>
          <div className="px-2.5 py-1 bg-green-primary text-white rounded-md text-[10px] font-medium flex items-center gap-1">
            <Download className="w-3 h-3" />
            PDF
          </div>
        </div>

        {/* Sections list */}
        <div className="space-y-2 mb-3">
          {data.preview?.sections?.map((section: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-center justify-between p-2.5 bg-gradient-to-l from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10"
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-amber-500'}`}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-medium text-green-dark dark:text-white">{section.name}</p>
                  <p className="text-[10px] text-gray-500">{section.pages} صفحة</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </motion.div>
          ))}
        </div>

        {/* Total pages indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 bg-gradient-to-r from-green-primary/10 to-green-teal/10 rounded-lg border border-green-primary/20 text-center"
        >
          <p className="text-[10px] text-gray-500 mb-1">إجمالي الصفحات</p>
          <p className="text-xl font-bold text-green-primary">{data.preview?.totalPages}</p>
        </motion.div>
      </div>
    </AppFrame>
  );
};

// Planning Preview Component
const PlanningPreview = ({ data }: { data: typeof showcaseImages[6] }) => {
  return (
    <AppFrame title="منشئ الخطط" icon={Calendar} iconColor="text-blue-500">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-green-dark dark:text-white">خطة المشروع</p>
            <p className="text-[10px] text-gray-500">{data.preview?.timeline}</p>
          </div>
          <div className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md text-[10px] font-medium text-blue-700 dark:text-blue-400">
            نشط
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-3">
          {data.preview?.phases?.map((phase: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-green-dark dark:text-white">{phase.title}</span>
                <span className="text-[10px] text-gray-500">{phase.progress}%</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${phase.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-center justify-between text-[10px] text-gray-500"
        >
          <span>الأسبوع 1</span>
          <span>الأسبوع 6</span>
          <span>الأسبوع 12</span>
        </motion.div>
      </div>
    </AppFrame>
  );
};

// Templates Preview Component
const TemplatesPreview = ({ data }: { data: typeof showcaseImages[7] }) => {
  return (
    <AppFrame title="القوالب الجاهزة" icon={TrendingUp} iconColor="text-purple-500">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-green-dark dark:text-white">مكتبة القوالب</p>
            <p className="text-[10px] text-gray-500">اختر من {data.preview?.categories?.reduce((sum: number, c: any) => sum + c.count, 0)} قالب</p>
          </div>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {data.preview?.categories?.map((cat: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className={`p-2.5 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform ${
                i === 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 
                i === 1 ? 'bg-green-100 dark:bg-green-900/30' : 
                'bg-amber-100 dark:bg-amber-900/30'
              }`}
            >
              <p className={`text-lg font-bold ${
                i === 0 ? 'text-blue-600' : 
                i === 1 ? 'text-green-600' : 
                'text-amber-600'
              }`}>{cat.count}</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400">{cat.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Featured templates */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 mb-2">القوالس المميزة</p>
          {data.preview?.featured?.map((template: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-2 p-2 bg-gradient-to-l from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10 cursor-pointer hover:border-green-primary/30 transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-green-dark dark:text-white flex-1">{template}</span>
              <ArrowLeft className="w-3.5 h-3.5 text-gray-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </AppFrame>
  );
};

// Presentation Preview Component
const PresentationPreview = ({ data }: { data: typeof showcaseImages[8] }) => {
  return (
    <AppFrame title="منشئ العروض" icon={Play} iconColor="text-rose-500">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-green-dark dark:text-white">عرض توضيحي</p>
            <p className="text-[10px] text-gray-500">{data.preview?.totalSlides} شرائح</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 rounded-md text-[10px] font-medium text-rose-700 dark:text-rose-400">
              تحرير
            </div>
          </div>
        </div>

        {/* Slides preview */}
        <div className="space-y-2 mb-3">
          {data.preview?.slides?.map((slide: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-center gap-2 p-2 bg-gradient-to-l from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-lg border border-gray-100 dark:border-green-primary/10"
            >
              <div className={`w-10 h-6 rounded-sm flex items-center justify-center text-[10px] font-bold text-white ${
                i === 0 ? 'bg-rose-500' : i === 1 ? 'bg-blue-500' : 'bg-green-500'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-green-dark dark:text-white">{slide.title}</p>
                <p className="text-[10px] text-gray-500">{slide.type}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Play button */}
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="w-full py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          بدء العرض
        </motion.button>
      </div>
    </AppFrame>
  );
};

// Library Preview Component
const LibraryPreview = ({ data }: { data: typeof showcaseImages[9] }) => {
  return (
    <AppFrame title="مكتبة الأدوات" icon={TrendingUp} iconColor="text-indigo-500">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-green-dark dark:text-white">مكتبتي</p>
            <p className="text-[10px] text-gray-500">{data.preview?.recentlyUsed} استخدمت مؤخراً</p>
          </div>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {data.preview?.tools?.map((tool: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className={`p-2.5 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform ${tool.color}`}
            >
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{tool.count}</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">{tool.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Browse all button */}
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="w-full py-2 border border-green-primary/30 text-green-primary rounded-lg font-medium text-xs hover:bg-green-primary/5 transition-all"
        >
          استعرض الكل
        </motion.button>

        {/* Storage info */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-center text-[10px] text-gray-500"
        >
          تم استخدام 2.5 جيجا من 10 جيجا
        </motion.div>
      </div>
    </AppFrame>
  );
};
const SliderFloatingElements = () => {
  return (
    <>
      {/* Top Right - Lightning */}
      <motion.div
        className="absolute -top-3 sm:-top-4 lg:-top-5 -right-3 sm:-right-4 lg:-right-5 w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl z-30"
        animate={{ y: [-8, 8, -8], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Zap className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />
      </motion.div>
      
      {/* Top Left - Star */}
      <motion.div
        className="absolute -top-3 sm:-top-4 lg:-top-5 -left-3 sm:-left-4 lg:-left-5 w-9 sm:w-10 lg:w-12 h-9 sm:h-10 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-xl z-30"
        animate={{ y: [6, -6, 6], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Star className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
      </motion.div>
      
      {/* Bottom Left - Download */}
      <motion.div
        className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-5 -left-3 sm:-left-4 lg:-left-5 w-9 sm:w-10 lg:w-12 h-9 sm:h-10 lg:h-12 bg-gradient-to-br from-green-primary to-green-teal rounded-lg lg:rounded-xl flex items-center justify-center shadow-xl z-30"
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Download className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
      </motion.div>
      
      {/* Bottom Right - Award */}
      <motion.div
        className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-5 -right-3 sm:-right-4 lg:-right-5 w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl z-30"
        animate={{ y: [-6, 6, -6], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Award className="w-5 sm:w-5 lg:w-6 h-5 sm:h-5 lg:h-6 text-white" />
      </motion.div>
    </>
  );
};

// Main Showcase Component
const ImageShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const currentData = showcaseImages[currentIndex];

  const renderPreview = () => {
    let PreviewComponent;
    switch (currentData.type) {
      case 'certificate':
        PreviewComponent = <CertificatePreview data={currentData} />;
        break;
      case 'quiz':
        PreviewComponent = <QuizPreview data={currentData} />;
        break;
      case 'report':
        PreviewComponent = <ReportPreview data={currentData} />;
        break;
      case 'survey':
        PreviewComponent = <QuizPreview data={currentData} />;
        break;
      case 'dashboard':
        PreviewComponent = <DashboardPreview data={currentData} />;
        break;
      case 'schedule':
        PreviewComponent = <SchedulePreview data={currentData} />;
        break;
      case 'planning':
        PreviewComponent = <PlanningPreview data={currentData} />;
        break;
      case 'templates':
        PreviewComponent = <TemplatesPreview data={currentData} />;
        break;
      case 'presentation':
        PreviewComponent = <PresentationPreview data={currentData} />;
        break;
      case 'library':
        PreviewComponent = <LibraryPreview data={currentData} />;
        break;
      default:
        PreviewComponent = <DashboardPreview data={currentData} />;
    }
    
    return (
      <motion.div
        key={currentData.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full"
      >
        {PreviewComponent}
      </motion.div>
    );
  };

  return (
    <div className="relative flex flex-col">
      {/* Fixed-height slide area — real tool previews */}
      <div className="relative overflow-hidden" style={{ height: '450px' }}>
        <AnimatePresence mode="wait">
          {renderPreview()}
        </AnimatePresence>
      </div>

      {/* Navigation Dots — smooth and elegant */}
      <div className="flex justify-center items-center gap-1.5 mt-6">
        {showcaseImages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentIndex(i)}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            aria-label={`الشريحة ${i + 1}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-300 rounded-full ${
              i === currentIndex
                ? 'w-8 h-2.5 bg-gradient-to-r from-green-primary to-green-teal shadow-lg'
                : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-green-primary/60'
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
      className="relative overflow-hidden bg-gradient-to-br from-[#F0F9F4] via-[#E8F5E9] to-[#C8E6C9] dark:from-[#0A1F1A] dark:via-[#0D1B1A] dark:to-[#0A1512] min-h-screen flex flex-col"
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

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1">

        {/* ── Upper Section: Content + Slider ── */}
        <div className="pt-24 sm:pt-28 lg:pt-24 pb-8 lg:pb-10 flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16 flex-1">

          {/* Content Side */}
          <div className="w-full lg:flex-1 text-center lg:text-right flex flex-col justify-center">
            {/* 1. Eyebrow Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <motion.span 
                className="inline-flex items-center gap-2 text-green-primary dark:text-green-light text-xs sm:text-sm font-bold tracking-wide"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                منصة مهني — احترافية في كل تفصيلة
              </motion.span>
            </motion.div>

            {/* 2. Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mb-10"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.15] tracking-tight">
                <span className="text-green-dark dark:text-white lg:inline block">
                  منصة{' '}
                </span>
                <span className="bg-gradient-to-r from-green-primary via-green-teal to-green-light bg-clip-text text-transparent">
                  مِهني
                </span>
              </h1>
            </motion.div>

            {/* 3. Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mb-10"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 dark:text-gray-300 leading-[1.7] max-w-2xl mx-auto lg:mx-0">
                <strong className="text-green-dark dark:text-white font-bold">وفّر وقتك</strong> وأنجز عملك باحترافية مع{' '}
                <strong className="text-green-dark dark:text-white font-bold">قوالب جاهزة</strong> وأدوات تنفيذية متكاملة
              </p>
            </motion.div>

            {/* 4. Feature Pills with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mb-10 flex flex-wrap items-center justify-center lg:justify-start gap-2"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-300 text-xs font-medium">
                <Palette className="w-3.5 h-3.5 text-green-primary" />
                تخصيص سهل
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-300 text-xs font-medium">
                <Download className="w-3.5 h-3.5 text-green-primary" />
                تصدير فوري
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-300 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-green-primary" />
                توفير الوقت
              </span>
            </motion.div>

            {/* 5. Audience Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <p className="text-lg sm:text-xl lg:text-2xl text-green-dark/70 dark:text-green-light/80 font-semibold tracking-wider">
                مدارس • جهات • شركات • أفراد • استخدام مخصص
              </p>
            </motion.div>

            {/* 6. CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              {/* Primary Button */}
              <motion.div 
                whileHover={{ y: -2, scale: 1.02 }} 
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link href={ROUTES.START}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-l from-green-primary to-green-teal text-white px-7 py-3 text-base font-bold rounded-xl shadow-[0_4px_20px_rgba(45,106,79,0.3)] hover:shadow-[0_8px_28px_rgba(45,106,79,0.4)] transition-all duration-300 group h-auto"
                  >
                    ابدأ مجانًا
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </motion.div>
              
              {/* Secondary Button */}
              <motion.div 
                whileHover={{ y: -2 }} 
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link href={getHomeSectionUrl('templates')}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border border-green-primary/40 text-green-dark dark:text-green-light bg-transparent hover:bg-green-primary/8 hover:border-green-primary hover:text-green-dark dark:hover:text-green-light px-7 py-3 text-base font-semibold rounded-xl transition-all duration-300 group h-auto"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    استكشف القوالب
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Slider Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-[480px] xl:w-[500px] flex-shrink-0 relative self-center"
          >
            {/* Floating elements anchored to slider */}
            <SliderFloatingElements />
            
            {/* Fixed-size Slider Container */}
            <div className="relative w-full">
              <ImageShowcase />
            </div>
          </motion.div>
        </div>

        {/* ── Lower Section: Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pb-8 lg:pb-10 border-t border-green-primary/10 pt-6 lg:pt-8"
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

