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
  Edit3,
  LayoutGrid,
  FileDown,
  Layers
} from 'lucide-react';

// صور العرض المتغيرة - 8 أدوات رئيسية
const showcaseImages = [
  {
    id: 1,
    title: 'منشئ الشهادات',
    description: 'صمم شهادات احترافية بسهولة',
    icon: Award,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 2,
    title: 'مولد الاختبارات',
    description: 'أنشئ اختبارات متنوعة في ثوانٍ',
    icon: FileText,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'إنشاء التقارير',
    description: 'تقارير تفصيلية جاهزة للطباعة',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 4,
    title: 'مكتبة القوالب',
    description: 'مئات القوالب الجاهزة للاستخدام',
    icon: LayoutGrid,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 5,
    title: 'محرر القوالب',
    description: 'خصص قوالبك حسب احتياجاتك',
    icon: Edit3,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 6,
    title: 'التصدير PDF',
    description: 'صدّر ملفاتك بجودة عالية',
    icon: FileDown,
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 7,
    title: 'لوحة التحكم',
    description: 'تابع إنجازاتك وإحصائياتك',
    icon: Layers,
    color: 'from-indigo-500 to-violet-500'
  },
  {
    id: 8,
    title: 'مكتبة الأدوات',
    description: 'كل ما تحتاجه في مكان واحد',
    icon: Zap,
    color: 'from-emerald-500 to-teal-500'
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
      {/* Top-right orb */}
      <motion.div
        className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-green-primary/15 via-green-teal/10 to-transparent blur-[110px]"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Bottom-left orb */}
      <motion.div
        className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-green-light/15 via-green-teal/10 to-transparent blur-[90px]"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Center subtle glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-green-primary/5 via-green-teal/8 to-green-light/5 blur-[80px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Top-center accent */}
      <motion.div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-b from-green-primary/8 to-transparent blur-[60px]"
        animate={{ y: [0, 20, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
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

// Unified Tool Preview Component - renders each tool as a mini UI mockup
const ToolPreview = ({ data }: { data: typeof showcaseImages[number] }) => {
  const Icon = data.icon;

  // Tool-specific content based on id
  const renderToolContent = () => {
    switch (data.id) {
      case 1: // Certificate Generator
        return (
          <div className="space-y-3">
            <div className="aspect-[1.5/1] bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-xl border-2 border-amber-200 flex flex-col items-center justify-center p-4 relative">
              <div className="absolute inset-2 border border-amber-300/50 rounded-lg" />
              <Award className="w-8 h-8 text-amber-500 mb-2" />
              <div className="text-sm font-bold text-amber-700">شهادة تقدير</div>
              <div className="text-xs text-amber-600 mt-1">تقديراً للجهود المتميزة</div>
              <div className="w-16 h-0.5 bg-amber-300 mt-2" />
            </div>
            <div className="flex gap-2">
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 0.8 }} className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
            </div>
          </div>
        );

      case 2: // Test Generator
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[{ label: 'اختياري', count: 10 }, { label: 'صح/خطأ', count: 5 }, { label: 'مقالي', count: 3 }].map((q, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">{q.count}</div>
                  <div className="text-[10px] text-gray-500">{q.label}</div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-center">
              <div className="text-xs opacity-80">إجمالي الأسئلة</div>
              <div className="text-xl font-bold">18 سؤال</div>
            </motion.div>
          </div>
        );

      case 3: // Report Creation
        return (
          <div className="space-y-3">
            {[{ label: 'الرياضيات', value: 95 }, { label: 'العلوم', value: 88 }, { label: 'اللغة العربية', value: 92 }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#152B26] rounded-lg">
                <span className="text-xs text-gray-700 dark:text-gray-300">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }} />
                  </div>
                  <span className="text-xs font-bold text-blue-600">{item.value}%</span>
                </div>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
              <div className="text-xs text-gray-500">المعدل العام</div>
              <div className="text-2xl font-bold text-blue-600">91.7%</div>
            </motion.div>
          </div>
        );

      case 4: // Template Library
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { color: 'bg-amber-100', icon: Award },
                { color: 'bg-blue-100', icon: FileText },
                { color: 'bg-purple-100', icon: LayoutGrid },
                { color: 'bg-green-100', icon: TrendingUp },
                { color: 'bg-red-100', icon: Calendar },
                { color: 'bg-teal-100', icon: Star },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }} className={`aspect-square ${item.color} rounded-lg flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-gray-600" />
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-xs font-semibold text-green-700">+100 قالب</span>
              <LayoutGrid className="w-4 h-4 text-green-600" />
            </motion.div>
          </div>
        );

      case 5: // Template Editor
        return (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-[#152B26] rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center">
                  <Edit3 className="w-3 h-3 text-teal-600" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2">
                <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ delay: 0.3 }} className="h-2 bg-teal-200 rounded" />
                <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ delay: 0.4 }} className="h-2 bg-teal-100 rounded" />
                <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ delay: 0.5 }} className="h-2 bg-teal-200 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              {['الخط', 'اللون', 'الحجم'].map((label, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }} className="flex-1 p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center text-[10px] text-teal-700">{label}</motion.div>
              ))}
            </div>
          </div>
        );

      case 6: // Export PDF
        return (
          <div className="space-y-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
              <FileDown className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-red-700">تصدير PDF</div>
            </motion.div>
            <div className="space-y-2">
              {['جودة عالية', 'حجم مضغوط', 'طباعة جاهزة'].map((label, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#152B26] rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                    <Star className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 7: // Dashboard
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-gray-800 dark:text-white">مرحباً!</div>
              <div className="px-2 py-1 bg-indigo-100 rounded text-[10px] text-indigo-700">محترف</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{ value: '24', label: 'قالب', color: 'bg-blue-50 text-blue-600' }, { value: '156', label: 'شهادة', color: 'bg-amber-50 text-amber-600' }, { value: '89%', label: 'إنجاز', color: 'bg-green-50 text-green-600' }].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className={`p-2 rounded-lg text-center ${stat.color}`}>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-[10px]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="space-y-1.5">
              {['شهادة تقدير', 'تقرير أداء'].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#152B26] rounded-lg">
                  <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center">
                    <Award className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 8: // Tools Library
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Award, label: 'شهادات', color: 'bg-amber-100 text-amber-600' },
                { icon: FileText, label: 'تقارير', color: 'bg-blue-100 text-blue-600' },
                { icon: LayoutGrid, label: 'قوالب', color: 'bg-purple-100 text-purple-600' },
                { icon: Calendar, label: 'جداول', color: 'bg-green-100 text-green-600' },
              ].map((tool, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className={`p-3 rounded-xl flex flex-col items-center ${tool.color}`}>
                  <tool.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">{tool.label}</span>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl text-center border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">جميع الأدوات متاحة</span>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative bg-white dark:bg-[#1B2D2B] rounded-3xl shadow-[0_25px_70px_rgba(45,106,79,0.18)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden border border-green-primary/10"
    >
      {/* Browser Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 dark:bg-[#152B26] border-b border-green-primary/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className={`flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${data.color} rounded-lg text-xs text-white font-medium`}>
            <Icon className="w-3.5 h-3.5" />
            {data.title}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {renderToolContent()}
      </div>
    </motion.div>
  );
};

// Floating Elements Component
const FloatingElements = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentData = showcaseImages[currentIndex];

  const renderPreview = () => {
    return <ToolPreview data={currentData} />;
  };

  return (
    <div className="relative">
      {/* Main Preview with Floating Elements */}
      <motion.div
        className="relative transform scale-105 origin-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{
              duration: 0.7,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.5 }
            }}
          >
            {renderPreview()}
          </motion.div>
        </AnimatePresence>

        {/* Floating Elements - positioned relative to the preview card */}
        <FloatingElements />
      </motion.div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-1.5 mt-8">
        {showcaseImages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentIndex(i)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.85 }}
            className={`rounded-full transition-all duration-300 ${i === currentIndex
                ? 'w-6 h-2 bg-gradient-to-r from-green-primary to-green-teal'
                : 'w-2 h-2 bg-gray-300 hover:bg-green-primary/50'
              }`}
          />
        ))}
      </div>

      {/* Title Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mt-5 text-center"
        >
          <p className="text-sm sm:text-base font-bold text-green-dark dark:text-white">{currentData.title}</p>
          <p className="text-xs text-gray-500">{currentData.description}</p>
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-20 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">

          {/* Left Side - Content */}
          <div className="text-center lg:text-right order-2 lg:order-1 pt-4 lg:pt-8 max-w-[600px] mx-auto lg:mx-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-5"
            >
              <motion.span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-primary/10 dark:bg-green-primary/20 border border-green-primary/20 text-green-primary dark:text-green-light text-sm font-bold"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
                أنجز أعمالك باحترافية
              </motion.span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-6xl sm:text-6xl lg:text-8xl xl:text-9xl font-extrabold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-green-primary via-green-teal to-green-light bg-clip-text text-transparent">
                  منصة مهني
                </span>
              </h2>
              {/* Decorative underline accent */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-1 mt-2 rounded-full bg-gradient-to-r from-green-primary via-green-teal to-green-light origin-right"
                style={{ maxWidth: '60%' }}
              />
            </motion.div>

            {/* Marketing Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                منصة رقمية تساعد المدارس والجهات والشركات والأفراد على إنجاز أعمالهم بسرعة واحترافية باستخدام قوالب جاهزة وأدوات ذكية سهلة الاستخدام.
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-8"
            >
              {[
                { icon: Clock, text: 'توفر الوقت' },
                { icon: Palette, text: 'تصميم احترافي' },
                { icon: Zap, text: 'تخصيص سهل' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -2, scale: 1.05, boxShadow: '0 8px 20px rgba(45,106,79,0.12)' }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-[#1B2D2B]/70 rounded-full border border-green-primary/10 hover:border-green-primary/30 backdrop-blur-sm cursor-default transition-colors"
                >
                  <feature.icon className="w-4 h-4 text-green-primary" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6"
            >
              <motion.div whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.96 }} className="relative">
                {/* Subtle pulse ring */}
                <motion.span
                  className="absolute inset-0 rounded-2xl bg-green-primary/30 pointer-events-none"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Link href={ROUTES.START}>
                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-green-primary to-green-teal text-white px-10 py-7 text-lg rounded-2xl shadow-lg hover:shadow-[0_20px_40px_rgba(45,106,79,0.35)] transition-all duration-300 group font-bold hover:from-green-primary/95 hover:to-green-teal/95"
                  >
                    ابدأ مجاناً
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href={getHomeSectionUrl('templates')}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-primary/40 text-green-primary hover:bg-green-primary/10 hover:border-green-primary px-10 py-7 text-lg rounded-2xl transition-all font-bold bg-white/50 dark:bg-[#1B2D2B]/50 backdrop-blur-sm"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    استكشف قوالبنا
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Bar - Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 px-4 sm:px-0 mb-6 text-sm"
            >
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold">4.9 تقييم المستخدمين</span>
              </div>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 hidden sm:block" />
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Users className="w-4 h-4 text-green-primary" />
                <span className="font-semibold">+10,000 مستخدم</span>
              </div>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 hidden sm:block" />
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">+50 أداة ذكية</span>
              </div>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 hidden sm:block" />
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 text-purple-500" />
                <span className="font-semibold">+100 قالب</span>
              </div>
            </motion.div>


          </div>

          {/* Right Side - Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative pb-12 lg:pb-0"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-r from-green-primary/25 via-green-teal/20 to-green-light/20 rounded-[2rem] lg:rounded-[3rem] blur-2xl lg:blur-3xl opacity-70" />
            {/* Second inner glow ring for depth */}
            <motion.div
              className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-green-primary/10 to-transparent rounded-[2rem] lg:rounded-[3rem] blur-xl"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Image Showcase Container */}
            <div className="relative mx-auto lg:mx-0 max-w-[300px] sm:max-w-[360px] lg:max-w-[420px]">
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
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`relative ${bgColors[index]} dark:bg-opacity-10 rounded-xl p-3 sm:p-4 border border-transparent hover:border-green-primary/20 hover:shadow-[0_12px_32px_rgba(45,106,79,0.15)] transition-all overflow-hidden group cursor-pointer`}
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
