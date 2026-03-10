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
    color: 'from-teal-500 to-emerald-600',
    icon: Calendar,
    preview: {
      days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      classes: ['رياضيات', 'علوم', 'عربي', 'إنجليزي', 'فنية']
    }
  }
];

// Floating particles - Minimal for performance
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-green-primary/20"
          initial={{ 
            x: `${15 + i * 10}%`, 
            y: '105%',
            opacity: 0
          }}
          animate={{ 
            y: '-5%',
            opacity: [0, 0.6, 0]
          }}
          transition={{ 
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Subtle gradient orbs - Static for performance
const GradientOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-primary/15 to-transparent blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-green-teal/10 to-transparent blur-[80px]" />
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

// Dashboard Preview Component
const DashboardPreview = ({ data }: { data: typeof showcaseImages[0] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative bg-white dark:bg-[#1A2B28] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden border border-gray-200/50 dark:border-white/10"
    >
      {/* Browser Header - More refined */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 dark:bg-[#0F1D1A] border-b border-gray-200/50 dark:border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#0D1B1A] rounded-md text-xs text-gray-500 border border-gray-200/50 dark:border-white/5">
            <TrendingUp className="w-3 h-3 text-green-primary" />
            mihni.app
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Welcome - More compact */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-green-dark dark:text-white">
              مرحباً بك
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">5 قوالب جديدة متاحة</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200/50 dark:border-green-800/30">
            <Award className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">PRO</span>
          </div>
        </div>

        {/* Stats - More refined */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {data.stats?.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-lg text-center border border-gray-100 dark:border-white/5"
            >
              <div className="text-lg font-bold text-green-dark dark:text-white">{stat.value}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Activities - Cleaner */}
        <div className="space-y-2">
          {data.activities?.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5"
            >
              <div className="w-7 h-7 rounded-md bg-green-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-3.5 h-3.5 text-green-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-dark dark:text-white truncate">{item.name}</p>
              </div>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Certificate Preview Component
const CertificatePreview = ({ data }: { data: typeof showcaseImages[1] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative bg-white dark:bg-[#1A2B28] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden border border-gray-200/50 dark:border-white/10"
    >
      {/* Browser Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 dark:bg-[#0F1D1A] border-b border-gray-200/50 dark:border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#0D1B1A] rounded-md text-xs text-gray-500 border border-gray-200/50 dark:border-white/5">
            <Award className="w-3 h-3 text-amber-500" />
            منشئ الشهادات
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Certificate Preview - Cleaner */}
        <div className="aspect-[1.4/1] bg-gradient-to-br from-amber-50/80 via-white to-amber-50/80 rounded-lg border-2 border-amber-200/60 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
          {/* Subtle decorative frame */}
          <div className="absolute inset-2 border border-amber-300/30 rounded" />
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-amber-700 mb-1">{data.preview?.title}</h3>
            <p className="text-amber-600/80 text-xs mb-3">{data.preview?.subtitle}</p>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-base font-bold text-gray-800 mb-1">{data.preview?.recipient}</p>
            <p className="text-gray-400 text-[10px]">{data.preview?.date}</p>
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </div>
          <span className="text-[10px] text-gray-500">جاهز</span>
        </div>
      </div>
    </motion.div>
  );
};

// Calculator Preview Component
const CalculatorPreview = ({ data }: { data: typeof showcaseImages[2] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative bg-white dark:bg-[#1A2B28] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden border border-gray-200/50 dark:border-white/10"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 dark:bg-[#0F1D1A] border-b border-gray-200/50 dark:border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#0D1B1A] rounded-md text-xs text-gray-500 border border-gray-200/50 dark:border-white/5">
            <Calculator className="w-3 h-3 text-blue-500" />
            حاسبة الدرجات
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-2">
          {data.preview?.subjects?.map((subject: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5"
            >
              <span className="text-xs font-medium text-green-dark dark:text-white">{subject.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.score}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                  />
                </div>
                <span className="text-xs font-bold text-blue-600">{subject.score}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center border border-blue-100 dark:border-blue-800/30"
        >
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">المعدل العام</p>
          <p className="text-2xl font-bold text-blue-600">{data.preview?.average || '0%'}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Quiz Preview Component
const QuizPreview = ({ data }: { data: typeof showcaseImages[3] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative bg-white dark:bg-[#1A2B28] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden border border-gray-200/50 dark:border-white/10"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 dark:bg-[#0F1D1A] border-b border-gray-200/50 dark:border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#0D1B1A] rounded-md text-xs text-gray-500 border border-gray-200/50 dark:border-white/5">
            <FileText className="w-3 h-3 text-purple-500" />
            مولد الاختبارات
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {data.preview?.questions?.map((q: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center border border-purple-100 dark:border-purple-800/30"
            >
              <p className="text-xl font-bold text-purple-600">{q.count}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{q.type}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 bg-purple-600 rounded-lg text-white text-center"
        >
          <p className="text-[10px] opacity-80 mb-0.5">إجمالي الأسئلة</p>
          <p className="text-xl font-bold">{data.preview?.total || '0'}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Schedule Preview Component
const SchedulePreview = ({ data }: { data: typeof showcaseImages[4] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative bg-white dark:bg-[#1A2B28] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden border border-gray-200/50 dark:border-white/10"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 dark:bg-[#0F1D1A] border-b border-gray-200/50 dark:border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#0D1B1A] rounded-md text-xs text-gray-500 border border-gray-200/50 dark:border-white/5">
            <Calendar className="w-3 h-3 text-teal-500" />
            الجدول الدراسي
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-5 gap-1.5">
          {data.preview?.days?.map((day: string, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="text-center"
            >
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 font-medium">{day}</div>
              <div className="space-y-1">
                {data.preview?.classes?.slice(0, 3).map((cls: string, j: number) => (
                  <motion.div 
                    key={j}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.04 + j * 0.02 }}
                    className={`text-[9px] py-1 px-0.5 rounded font-medium ${
                      j === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      j === 1 ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    {cls}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Floating Elements Component - Refined with subtle animations
const FloatingElements = () => {
  return (
    <>
      {/* Top Right - Zap */}
      <motion.div
        className="absolute -top-3 sm:-top-4 lg:-top-5 -right-3 sm:-right-4 lg:-right-5 w-9 sm:w-10 lg:w-12 h-9 sm:h-10 lg:h-12 bg-amber-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 z-30"
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Zap className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
      </motion.div>
      
      {/* Top Left - Star */}
      <motion.div
        className="absolute -top-3 sm:-top-4 lg:-top-5 -left-3 sm:-left-4 lg:-left-5 w-8 sm:w-9 lg:w-11 h-8 sm:h-9 lg:h-11 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 z-30"
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Star className="w-3.5 sm:w-4 lg:w-5 h-3.5 sm:h-4 lg:h-5 text-white" />
      </motion.div>
      
      {/* Bottom Left - Download */}
      <motion.div
        className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-5 -left-3 sm:-left-4 lg:-left-5 w-8 sm:w-9 lg:w-11 h-8 sm:h-9 lg:h-11 bg-green-primary rounded-lg flex items-center justify-center shadow-lg shadow-green-primary/30 z-30"
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Download className="w-3.5 sm:w-4 lg:w-5 h-3.5 sm:h-4 lg:h-5 text-white" />
      </motion.div>
      
      {/* Bottom Right - Award */}
      <motion.div
        className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-5 -right-3 sm:-right-4 lg:-right-5 w-9 sm:w-10 lg:w-12 h-9 sm:h-10 lg:h-12 bg-blue-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 z-30"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Award className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
      </motion.div>
    </>
  );
};

// Main Showcase Component
const ImageShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 3000);
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
      default:
        return <DashboardPreview data={currentData} />;
    }
  };

  return (
    <div className="relative">
      {/* Main Preview with Floating Elements */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {renderPreview()}
        </AnimatePresence>
        
        {/* Floating Elements - positioned relative to the preview card */}
        <FloatingElements />
      </div>

      {/* Navigation Dots - Cleaner */}
      <div className="flex justify-center gap-2 mt-5">
        {showcaseImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? 'w-6 bg-green-primary' 
                : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Title Overlay - More compact */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center"
        >
          <p className="text-sm sm:text-base font-semibold text-green-dark dark:text-white">{currentData.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{currentData.description}</p>
        </motion.div>
      </AnimatePresence>
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-32 sm:pt-36 lg:pt-32 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center">
          
          {/* Left Side - Content */}
          <div className="text-center lg:text-right order-2 lg:order-1 pt-6 lg:pt-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-6 lg:mb-8"
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-white/10 rounded-full text-green-primary dark:text-green-light text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-sm border border-green-primary/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-primary/10">
                  <Sparkles className="w-3 h-3" />
                </span>
                قوالب ذكية وأدوات تنفيذية للمحترفين
              </motion.span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-5 lg:mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.15] tracking-tight text-balance">
                <span className="text-green-dark dark:text-white">
                  أنجز أعمالك
                </span>
                <br className="hidden sm:block" />
                <span className="text-green-dark dark:text-white">
                  باحترافية مع{' '}
                </span>
                <span className="bg-gradient-to-l from-green-primary via-green-teal to-green-light bg-clip-text text-transparent">
                  مِهني
                </span>
              </h1>
            </motion.div>

            {/* Marketing Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8 lg:mb-10"
            >
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0 lg:max-w-none text-balance">
                منصة متكاملة تخدم <span className="text-green-primary font-semibold">المدارس والمنظمات والشركات والأفراد</span> بقوالب جاهزة وأدوات ذكية تختصر الوقت وترفع الجودة
              </p>
            </motion.div>

            {/* Target Audience Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-8 lg:mb-10"
            >
              {[
                { icon: Users, text: 'للمدارس', color: 'text-blue-600 dark:text-blue-400' },
                { icon: Award, text: 'للمنظمات', color: 'text-amber-600 dark:text-amber-400' },
                { icon: TrendingUp, text: 'للشركات', color: 'text-green-600 dark:text-green-400' },
                { icon: Star, text: 'للأفراد', color: 'text-purple-600 dark:text-purple-400' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-white/10 backdrop-blur-sm cursor-default"
                >
                  <feature.icon className={`w-3.5 h-3.5 ${feature.color}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              {/* Primary CTA */}
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link href={ROUTES.START}>
                  <Button
                    size="lg"
                    className="relative overflow-hidden bg-green-primary hover:bg-green-primary/90 text-white px-8 py-6 text-base sm:text-lg rounded-xl shadow-lg shadow-green-primary/25 hover:shadow-xl hover:shadow-green-primary/30 transition-all duration-300 group font-bold"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      ابدأ الآن مجاناً
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    </span>
                  </Button>
                </Link>
              </motion.div>
              
              {/* Secondary CTA */}
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link href={getHomeSectionUrl('templates')}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-gray-500 px-8 py-6 text-base sm:text-lg rounded-xl transition-all duration-200 font-medium bg-white/50 dark:bg-transparent backdrop-blur-sm group"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-green-primary" />
                    تصفح القوالب
                  </Button>
                </Link>
              </motion.div>
            </motion.div>


          </div>

          {/* Right Side - Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2 relative pb-16 lg:pb-20"
          >
            {/* Subtle Glow Effect */}
            <div className="absolute -inset-4 lg:-inset-8 bg-gradient-to-br from-green-primary/15 via-transparent to-green-teal/10 rounded-3xl blur-2xl opacity-60" />
            
            {/* Image Showcase Container */}
            <div className="relative mx-auto lg:mx-0 max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]">
              <ImageShowcase />
            </div>
          </motion.div>
        </div>

        {/* Stats Section - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 lg:mt-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const iconColors = [
                'text-blue-500',
                'text-green-500', 
                'text-purple-500',
                'text-amber-500'
              ];
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                  className="bg-white/60 dark:bg-white/5 rounded-xl p-4 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${iconColors[index]}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-dark dark:text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
