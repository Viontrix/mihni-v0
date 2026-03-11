"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Award,
  HelpCircle,
  Calendar,
  BarChart3,
  FileText,
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  Lock,
  Crown,
  TrendingUp,
  ClipboardList,
  Clock,
  Play,
  CheckCircle,
  Image as ImageIcon,
  ArrowRight,
  Presentation,
  Target,
  SearchCheck,
  Briefcase,
  Palette,
  FileBarChart2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/sections/Navbar';
import { ROUTES, getToolUrl } from '@/lib/routes';

// ── All tools data (homepage tools + extra tools) ─────────────────────────────
const allTools = [
  {
    id: 'certificate-maker',
    name: 'منشئ الشهادات',
    description: 'صمم شهادات شكر وتقدير احترافية بخطوات بسيطة مع إمكانية التخصيص الكامل',
    icon: Award,
    tabs: ['اختيار التصميم', 'إدخال البيانات', 'إضافة الشعار', 'التصدير'],
    features: [
      { text: '12+ تصميم فاخر', locked: false },
      { text: 'تخصيص الألوان والخطوط', locked: false },
      { text: 'إضافة الشعارات والتوقيعات', locked: true },
      { text: 'تصدير PDF عالي الجودة', locked: true },
    ],
    color: 'from-amber-500 to-orange-500',
    badges: ['popular', 'pro'],
  },
  {
    id: 'quiz-generator',
    name: 'منشئ الاختبارات',
    description: 'أنشئ اختبارات متنوعة ذكية حسب الموضوع والمستوى بأنواع مختلفة من الأسئلة',
    icon: HelpCircle,
    tabs: ['اختياري', 'صح/خطأ', 'مقالي', 'التصدير'],
    features: [
      { text: 'أسئلة اختيار من متعدد', locked: false },
      { text: 'أسئلة ح/خطأ', locked: false },
      { text: 'أسئلة مقالية', locked: true },
      { text: 'توليد ذكي للأسئلة', locked: true },
    ],
    color: 'from-green-500 to-emerald-500',
    badges: ['new', 'pro'],
  },
  {
    id: 'schedule-builder',
    name: 'منشئ الجداول',
    description: 'أنشئ جداول أسبوعية منظمة بسهولة مع جميع المواد والأوقات',
    icon: Calendar,
    tabs: ['الأيام', 'المواد', 'الأوقات', 'التصدير'],
    features: [
      { text: 'جدول أسبوعي كامل', locked: false },
      { text: 'إضافة المواد والأوقات', locked: false },
      { text: 'تخصيص الألوان', locked: false },
      { text: 'حفظ في السحابة', locked: true },
    ],
    color: 'from-purple-500 to-violet-500',
    badges: ['free'],
  },
  {
    id: 'performance-analyzer',
    name: 'محلل الأداء',
    description: 'حلل أداء الطلاب والمعلمين مع تقارير تفصيلية ورسوم بيانية',
    icon: BarChart3,
    tabs: ['الإحصائيات', 'الرسوم', 'المقارنة', 'التقرير'],
    features: [
      { text: 'تحليل النتائج الشامل', locked: false },
      { text: 'رسوم بيانية تفاعلية', locked: true },
      { text: 'مقارنة الفصول', locked: true },
      { text: 'تقارير دورية', locked: true },
    ],
    color: 'from-rose-500 to-pink-500',
    badges: ['popular', 'pro'],
  },
  {
    id: 'report-builder',
    name: 'منشئ التقارير',
    description: 'أنشئ تقارير احترافية لتوثيق الفعاليات والبرامج التعليمية',
    icon: FileText,
    tabs: ['القالب', 'المحتوى', 'الصور', 'التصدير'],
    features: [
      { text: 'قوالب تقارير جاهزة', locked: false },
      { text: 'إضافة الصور والجداول', locked: true },
      { text: 'تخصيص التصميم', locked: true },
      { text: 'توقيع إلكتروني', locked: true },
    ],
    color: 'from-teal-500 to-cyan-500',
    badges: ['pro'],
  },
  {
    id: 'grade-calculator',
    name: 'حاسبة المعدل',
    description: 'احسب المعدل التراكمي والفصلي بسهولة مع دعم أنظمة تقديم متعددة',
    icon: FileBarChart2,
    tabs: ['النظام', 'المواد', 'الحساب', 'التقرير'],
    features: [
      { text: 'دعم نظام GPA', locked: false },
      { text: 'النظام السعودي والجامعي', locked: false },
      { text: 'مقارنة الفصول الدراسية', locked: true },
      { text: 'تقرير شامل للمعدل', locked: true },
    ],
    color: 'from-blue-500 to-indigo-500',
    badges: ['free', 'new'],
  },
  {
    id: 'survey-builder',
    name: 'منشئ الاستبيانات',
    description: 'صمم استبيانات احترافية لجمع الآراء والتقييمات بسهولة',
    icon: ClipboardList,
    tabs: ['الأسئلة', 'التصميم', 'النشر', 'التحليل'],
    features: [
      { text: 'أنواع متعددة من الأسئلة', locked: false },
      { text: 'تخصيص التصميم', locked: false },
      { text: 'مشاركة سهلة', locked: false },
      { text: 'تحليل النتائج', locked: false },
    ],
    color: 'from-gray-400 to-gray-500',
    badges: ['soon'],
  },
  {
    id: 'question-maker',
    name: 'منشئ الأسئلة',
    description: 'أنشئ بنك أسئلة تعليمية متنوعة مع خيارات متعددة للإجابات',
    icon: HelpCircle,
    tabs: ['الموضوع', 'النوع', 'العدد', 'التوليد'],
    features: [
      { text: 'توليد أسئلة ذكي', locked: false },
      { text: 'تخصيص مستوى الصعوبة', locked: false },
      { text: 'تصدير بنك الأسئلة', locked: true },
      { text: 'تصنيف حسب الموضوع', locked: true },
    ],
    color: 'from-indigo-500 to-purple-500',
    badges: ['soon'],
  },
  {
    id: 'invitation-maker',
    name: 'منشئ الدعوات',
    description: 'صمم دعوات احترافية للمناسبات والفعاليات بأنماط متعددة',
    icon: Calendar,
    tabs: ['القالب', 'التفاصيل', 'التصميم', 'المشاركة'],
    features: [
      { text: 'قوالب دعوات جاهزة', locked: false },
      { text: 'تخصيص الألوان والخطوط', locked: false },
      { text: 'إضافة خريطة الموقع', locked: true },
      { text: 'تأكيد الحضور', locked: true },
    ],
    color: 'from-pink-500 to-rose-500',
    badges: ['soon'],
  },
  {
    id: 'letter-maker',
    name: 'منشئ الخطابات',
    description: 'أنشئ خطابات رسمية وإدارية بصيغ احترافية متعددة',
    icon: FileText,
    tabs: ['النوع', 'المحتوى', 'التنسيق', 'التصدير'],
    features: [
      { text: 'قوالب خطابات رسمية', locked: false },
      { text: 'تنسيق احترافي', locked: false },
      { text: 'توقيع إلكتروني', locked: true },
      { text: 'تتبع المرسلات', locked: true },
    ],
    color: 'from-cyan-500 to-blue-500',
    badges: ['soon'],
  },
  {
    id: 'presentation-maker',
    name: 'منشئ العروض',
    description: 'صمم عروض تقديمية احترافية مثل البوربوينت بقوالب جاهزة وأنماط متعددة',
    icon: Presentation,
    tabs: ['القالب', 'الشرائح', 'التصميم', 'التصدير'],
    features: [
      { text: 'قوالب عروض جاهزة', locked: false },
      { text: 'إضافة صور ومخططات', locked: false },
      { text: 'تأثيرات انتقالية', locked: true },
      { text: 'تصدير PPTX', locked: true },
    ],
    color: 'from-orange-500 to-red-500',
    badges: ['soon'],
  },
  {
    id: 'performance-evaluation',
    name: 'منشئ تقييم الأداء',
    description: 'أنشئ نماذج تقييم أداء احترافية للموظفين والطلاب بمعايير دقيقة',
    icon: Target,
    tabs: ['المعايير', 'التقييم', 'التقرير', 'التصدير'],
    features: [
      { text: 'نماذج تقييم مخصصة', locked: false },
      { text: 'معايير تقييم متعددة', locked: false },
      { text: 'مقارنة الأداء', locked: true },
      { text: 'تقارير تحليلية', locked: true },
    ],
    color: 'from-emerald-500 to-green-600',
    badges: ['soon'],
  },
  {
    id: 'needs-analysis',
    name: 'منشئ تحليل احتياج',
    description: 'حلل الاحتياجات التدريبية والتعليمية وأنشئ تقارير تحليلية شاملة',
    icon: SearchCheck,
    tabs: ['الأهداف', 'التحليل', 'الفجوات', 'التقرير'],
    features: [
      { text: 'تحليل الاحتياجات الشامل', locked: false },
      { text: 'تحديد الفجوات التدريبية', locked: false },
      { text: 'خطة تطوير مقترحة', locked: true },
      { text: 'تقرير مفصل للإدارة', locked: true },
    ],
    color: 'from-sky-500 to-blue-600',
    badges: ['soon'],
  },
  {
    id: 'consulting-services',
    name: 'منشئ خدمات استشارية',
    description: 'أنشئ عروض وباقات خدمات استشارية احترافية بتصاميم جذابة',
    icon: Briefcase,
    tabs: ['الخدمات', 'الباقات', 'التسعير', 'التصدير'],
    features: [
      { text: 'قوالب عروض احترافية', locked: false },
      { text: 'جداول أسعار مرنة', locked: false },
      { text: 'إضافة شعار الشركة', locked: true },
      { text: 'إرسال مباشر للعميل', locked: true },
    ],
    color: 'from-slate-500 to-gray-600',
    badges: ['soon'],
  },
  {
    id: 'promotional-designs',
    name: 'منشئ تصاميم دعائية',
    description: 'صمم منشورات وإعلانات دعائية احترافية للمناسبات والحملات التسويقية',
    icon: Palette,
    tabs: ['القالب', 'المحتوى', 'الألوان', 'التصدير'],
    features: [
      { text: 'قوالب دعائية متنوعة', locked: false },
      { text: 'تخصيص الألوان والخطوط', locked: false },
      { text: 'مقاسات منصات التواصل', locked: true },
      { text: 'تصدير بجودة عالية', locked: true },
    ],
    color: 'from-fuchsia-500 to-pink-600',
    badges: ['soon'],
  },
];

// ── ToolPreview (same as homepage) ────────────────────────────────────────────
const ToolPreview = ({ tool }: { tool: typeof allTools[0] }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tool.tabs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tool.tabs.length]);

  return (
    <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-xl overflow-hidden border border-green-primary/10 p-3">
      <div className="flex gap-1 mb-3">
        {tool.tabs.map((tab, i) => (
          <motion.div
            key={tab}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium text-center transition-all ${
              activeTab === i ? 'bg-green-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
            }`}
            animate={{ scale: activeTab === i ? 1.02 : 1 }}
          >
            {tab}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="h-28 flex items-center justify-center"
        >
          {tool.id === 'certificate-maker' && (
            <div className="relative w-28 h-32 bg-gradient-to-b from-amber-50 to-white rounded-lg shadow-lg border border-amber-200 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-1 border-2 border-amber-300/50 rounded" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-lg" />
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-2 shadow-md"
              >
                <Award className="w-5 h-5 text-white" />
              </motion.div>
              <div className="w-16 h-1.5 bg-amber-200 rounded mb-1" />
              <div className="w-12 h-1 bg-amber-100 rounded" />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-red-400 rounded-full opacity-80" />
            </div>
          )}
          {tool.id === 'quiz-generator' && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((num, i) => (
                  <motion.div
                    key={num}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === activeTab % 5 ? 'bg-green-500 text-white shadow-md' : 'bg-green-100 text-green-600'}`}
                    animate={{ scale: i === activeTab % 5 ? 1.15 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
              <div className="w-32 h-16 bg-white rounded-lg shadow-sm border border-green-100 p-2 mt-1">
                <div className="w-20 h-2 bg-gray-200 rounded mb-2" />
                <div className="flex gap-1.5">
                  <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-[10px] text-green-600">أ</div>
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">ب</div>
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">ج</div>
                </div>
              </div>
            </div>
          )}
          {tool.id === 'schedule-builder' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-4 gap-1 p-2 bg-white rounded-lg shadow-sm border border-purple-100">
                <div className="w-8 h-6 rounded bg-purple-200 flex items-center justify-center text-[8px] text-purple-700 font-bold">اليوم</div>
                <div className="w-8 h-6 rounded bg-purple-200 flex items-center justify-center text-[8px] text-purple-700 font-bold">1</div>
                <div className="w-8 h-6 rounded bg-purple-200 flex items-center justify-center text-[8px] text-purple-700 font-bold">2</div>
                <div className="w-8 h-6 rounded bg-purple-200 flex items-center justify-center text-[8px] text-purple-700 font-bold">3</div>
                {['أ', 'إ', 'ث'].map((day, rowIdx) => (
                  <div key={`row-${rowIdx}`} className="contents">
                    <motion.div className="w-8 h-6 rounded bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold" animate={{ opacity: rowIdx === activeTab % 3 ? 1 : 0.7 }}>{day}</motion.div>
                    {[0, 1, 2].map((colIdx) => (
                      <motion.div
                        key={`cell-${rowIdx}-${colIdx}`}
                        className={`w-8 h-6 rounded flex items-center justify-center text-[8px] ${rowIdx === activeTab % 3 && colIdx === activeTab % 3 ? 'bg-purple-400 text-white' : 'bg-purple-50 text-purple-400'}`}
                        animate={{ scale: rowIdx === activeTab % 3 && colIdx === activeTab % 3 ? 1.1 : 1 }}
                      >
                        {['ع', 'ر', 'ح'][colIdx]}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          {tool.id === 'performance-analyzer' && (
            <div className="flex items-end gap-2 h-20">
              {[40, 65, 85, 55, 70].map((h, i) => (
                <motion.div key={i} className="w-6 bg-gradient-to-t from-rose-500 to-pink-400 rounded-t" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1 }} />
              ))}
            </div>
          )}
          {tool.id === 'report-builder' && (
            <div className="space-y-2 w-full px-4">
              <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-teal-500 rounded-full" animate={{ width: ['0%', '70%'] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-4 h-4 text-teal-500" /></div>
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-4 h-4 text-teal-500" /></div>
              </div>
            </div>
          )}
          {tool.id === 'grade-calculator' && (
            <div className="flex flex-col items-center gap-2">
              {[{ label: 'GPA', val: 3.8, max: 4, color: 'bg-blue-500' }, { label: 'سعودي', val: 88, max: 100, color: 'bg-indigo-500' }].map((item, i) => (
                <div key={i} className="flex items-center gap-2 w-32">
                  <span className="text-[9px] text-blue-600 w-8 text-left">{item.label}</span>
                  <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                    <motion.div className={`h-full ${item.color} rounded-full`} initial={{ width: 0 }} animate={{ width: `${(item.val / item.max) * 100}%` }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }} />
                  </div>
                  <span className="text-[9px] text-blue-600 font-bold">{item.val}</span>
                </div>
              ))}
              <div className="w-16 h-8 bg-blue-50 rounded-lg flex items-center justify-center mt-1">
                <span className="text-blue-600 font-bold text-sm">3.8</span>
              </div>
            </div>
          )}
          {tool.id === 'survey-builder' && (
            <div className="text-center"><ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-2" /><span className="text-xs text-gray-400">قريباً</span></div>
          )}
          {tool.id === 'question-maker' && (
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-20">
                {[2, 1, 0].map((offset) => (
                  <motion.div key={offset} className="absolute w-20 h-14 bg-white rounded-lg shadow-sm border border-indigo-100 flex items-center justify-center" style={{ top: offset * 6, right: offset * 4, zIndex: 3 - offset }} animate={{ y: offset === 0 ? [0, -3, 0] : 0 }} transition={{ duration: 2, repeat: Infinity, delay: offset * 0.2 }}>
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-indigo-400 font-medium">بنك أسئلة</span>
            </div>
          )}
          {tool.id === 'invitation-maker' && (
            <div className="flex flex-col items-center">
              <motion.div className="relative w-24 h-28 bg-gradient-to-b from-pink-50 to-white rounded-lg shadow-md border border-pink-200 overflow-hidden" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }}>
                <div className="h-6 bg-gradient-to-r from-pink-400 to-rose-400" />
                <div className="p-2 flex flex-col items-center">
                  <Calendar className="w-6 h-6 text-pink-400 mb-1" />
                  <div className="w-14 h-1.5 bg-pink-200 rounded mb-1" />
                  <div className="w-10 h-1 bg-pink-100 rounded" />
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-rose-300 rounded-full opacity-60" />
              </motion.div>
            </div>
          )}
          {tool.id === 'letter-maker' && (
            <div className="flex flex-col items-center">
              <motion.div className="relative w-20 h-24 bg-white rounded-lg shadow-md border border-cyan-100 p-2" animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="w-full h-2 bg-cyan-100 rounded mb-2" />
                <div className="space-y-1.5">
                  <div className="w-full h-1 bg-gray-100 rounded" />
                  <div className="w-4/5 h-1 bg-gray-100 rounded" />
                  <div className="w-full h-1 bg-gray-100 rounded" />
                  <div className="w-3/5 h-1 bg-gray-100 rounded" />
                </div>
                <motion.div className="absolute bottom-2 left-2 w-6 h-6 bg-cyan-400 rounded-full opacity-80" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </motion.div>
            </div>
          )}
          {tool.id === 'presentation-maker' && (
            <div className="flex flex-col items-center">
              <motion.div className="relative w-32 h-20 bg-gradient-to-br from-orange-50 to-white rounded-lg shadow-md border border-orange-200 overflow-hidden" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="h-4 bg-gradient-to-r from-orange-400 to-red-400 flex items-center px-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <div className="w-full h-2 bg-orange-200 rounded" />
                  <div className="w-3/4 h-1.5 bg-orange-100 rounded" />
                  <div className="flex gap-1 mt-1">
                    <div className="w-8 h-5 bg-orange-100 rounded" />
                    <div className="w-8 h-5 bg-orange-50 rounded" />
                  </div>
                </div>
              </motion.div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className={`w-6 h-4 rounded border ${i === activeTab % 3 ? 'bg-orange-400 border-orange-400' : 'bg-white border-gray-200'}`} animate={{ scale: i === activeTab % 3 ? 1.1 : 1 }} />
                ))}
              </div>
            </div>
          )}
          {tool.id === 'performance-evaluation' && (
            <div className="flex flex-col items-center gap-2">
              {[{ label: 'الأداء', val: 85 }, { label: 'التواصل', val: 70 }, { label: 'الإنتاج', val: 92 }].map((item, i) => (
                <div key={i} className="flex items-center gap-2 w-32">
                  <span className="text-[9px] text-emerald-600 w-10 text-left">{item.label}</span>
                  <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${item.val}%` }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }} />
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold">{item.val}%</span>
                </div>
              ))}
            </div>
          )}
          {tool.id === 'needs-analysis' && (
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div className="absolute w-20 h-20 rounded-full border-4 border-sky-200" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="absolute w-14 h-14 rounded-full border-4 border-sky-400" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                <motion.div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <SearchCheck className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>
          )}
          {tool.id === 'consulting-services' && (
            <div className="flex flex-col items-center gap-1.5">
              {[{ w: 'w-28', opacity: 'opacity-100' }, { w: 'w-24', opacity: 'opacity-80' }, { w: 'w-20', opacity: 'opacity-60' }].map((item, i) => (
                <motion.div key={i} className={`${item.w} h-5 bg-slate-300 rounded-lg flex items-center px-2 gap-1 ${item.opacity}`} animate={{ x: [0, i % 2 === 0 ? 3 : -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}>
                  <Briefcase className="w-3 h-3 text-white" />
                  <div className="flex-1 h-1 bg-white/40 rounded" />
                </motion.div>
              ))}
              <div className="flex items-center gap-1 mt-1">
                <div className="w-4 h-4 bg-slate-500 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>
                <span className="text-[10px] text-slate-500">خدمة متكاملة</span>
              </div>
            </div>
          )}
          {tool.id === 'promotional-designs' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 gap-1.5">
                {[{ c: 'from-fuchsia-400 to-pink-400', s: '★' }, { c: 'from-purple-400 to-indigo-400', s: '♦' }, { c: 'from-pink-400 to-rose-400', s: '●' }, { c: 'from-indigo-400 to-blue-400', s: '▲' }].map((item, i) => (
                  <motion.div key={i} className={`w-12 h-10 bg-gradient-to-br ${item.c} rounded-lg flex items-center justify-center text-white text-lg`} animate={{ scale: i === activeTab % 4 ? 1.1 : 1, rotate: i === activeTab % 4 ? 5 : 0 }} transition={{ duration: 0.3 }}>
                    {item.s}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
        {tool.tabs.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${activeTab === i ? 'bg-green-primary w-3' : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  );
};

// ── ToolBadge (same as homepage) ──────────────────────────────────────────────
const ToolBadge = ({ type }: { type: string }) => {
  const badges: Record<string, { bg: string; icon: React.ElementType; text: string }> = {
    free:    { bg: 'bg-green-500',  icon: Check,      text: 'مجاني'        },
    new:     { bg: 'bg-blue-500',   icon: Sparkles,   text: 'جديد'         },
    popular: { bg: 'bg-amber-500',  icon: TrendingUp, text: 'شائع'         },
    pro:     { bg: 'bg-purple-500', icon: Crown,      text: 'يتطلب ترقية' },
    soon:    { bg: 'bg-gray-400',   icon: Clock,      text: 'قريباً'       },
  };
  const badge = badges[type];
  if (!badge) return null;
  const Icon = badge.icon;
  return (
    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className={`px-2.5 py-1 ${badge.bg} text-white text-[10px] font-bold rounded-full flex items-center gap-1`}>
      <Icon className="w-3 h-3" />{badge.text}
    </motion.span>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] via-white to-[#F8FAF9] dark:from-[#0D1B1A] dark:via-[#1B2D2B] dark:to-[#0D1B1A]">
      <Navbar />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-24 right-0 w-[600px] h-[600px] bg-green-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-teal/5 rounded-full blur-[100px]" />
        <motion.div className="absolute top-32 right-32 w-16 h-16 bg-amber-400/10 rounded-full blur-xl" animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.div className="absolute bottom-32 left-32 w-20 h-20 bg-blue-400/10 rounded-full blur-xl" animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back button */}
        <div className="pt-6 pb-2">
          <Link href={ROUTES.HOME}>
            <Button variant="outline" className="border-green-primary/30 text-green-primary hover:bg-green-primary/10 gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16 pt-6">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-6" whileHover={{ scale: 1.02 }}>
            <Zap className="w-4 h-4" />
            الأدوات الذكية
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold text-green-dark dark:text-white mb-4">
            Smart Tools
            <span className="block text-2xl sm:text-3xl mt-2 bg-gradient-to-r from-green-primary to-green-teal bg-clip-text text-transparent">
              أدوات تنفيذ احترافية متقدمة
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            أدوات ذكية قابلة للتخصيص الكامل، مصممة لتبسيط مهامك اليومية ورفع إنتاجيتك بكفاءة واحترافية
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
        >
          {allTools.map((tool) => {
            const Icon = tool.icon;
            const isSoon = tool.badges.includes('soon');
            return (
              <motion.div key={tool.id} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <div className="relative p-5 bg-white dark:bg-[#1B2D2B] rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-green-primary/50 transition-all duration-300 hover:shadow-xl h-full flex flex-col overflow-hidden">

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10 max-w-[calc(100%-2rem)]">
                    {tool.badges.map((badge) => <ToolBadge key={badge} type={badge} />)}
                  </div>

                  {/* Preview */}
                  <div className="mb-4 mt-8">
                    <ToolPreview tool={tool} />
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-green-dark dark:text-white group-hover:text-green-primary transition-colors">
                      {tool.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${feature.locked ? 'bg-amber-100' : 'bg-green-primary/10'}`}>
                          {feature.locked ? <Lock className="w-2.5 h-2.5 text-amber-600" /> : <Check className="w-2.5 h-2.5 text-green-primary" />}
                        </div>
                        <span className={`text-xs ${feature.locked ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link href={isSoon ? '#' : getToolUrl(tool.id)}>
                    <Button
                      variant="outline"
                      disabled={isSoon}
                      className={`w-full py-3 rounded-xl font-medium transition-all ${
                        isSoon
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-2 border-green-primary/30 text-green-primary hover:bg-green-primary hover:text-white hover:border-green-primary'
                      }`}
                    >
                      {isSoon ? (
                        <><Clock className="w-4 h-4 ml-2" />قريباً</>
                      ) : tool.badges.includes('free') ? (
                        <><Play className="w-4 h-4 ml-2" />استخدم مجاناً</>
                      ) : (
                        <><Crown className="w-4 h-4 ml-2" />استكشف الأداة</>
                      )}
                      <ChevronRight className="w-4 h-4 mr-auto" />
                    </Button>
                  </Link>

                  {/* Hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
