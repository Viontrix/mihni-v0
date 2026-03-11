"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Wrench, 
  CalendarDays, 
  Award, 
  ClipboardList, 
  FileBarChart2, 
  ArrowRight,
  HelpCircle,
  BarChart3,
  FileText,
  Clock,
  Crown,
  Sparkles,
  TrendingUp,
  Check,
  Play,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/sections/Navbar";
import { ROUTES, getToolUrl } from "@/lib/routes";

// All tools data - includes both active and coming soon
const allTools = [
  {
    id: 'certificate-maker',
    title: "منشئ الشهادات",
    desc: "صمم شهادات شكر وتقدير احترافية بخطوات بسيطة مع إمكانية التخصيص الكامل",
    href: "/tools/certificate-maker",
    icon: Award,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    badges: ['popular', 'pro'],
    status: 'active',
  },
  {
    id: 'quiz-generator',
    title: "منشئ الاختبارات",
    desc: "أنشئ اختبارات متنوعة ذكية حسب الموضوع والمستوى بأنواع مختلفة من الأسئلة",
    href: "/tools/quiz-generator",
    icon: HelpCircle,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    badges: ['new', 'pro'],
    status: 'active',
  },
  {
    id: 'schedule-builder',
    title: "منشئ الجداول",
    desc: "أنشئ جداول أسبوعية منظمة بسهولة مع جميع المواد والأوقات",
    href: "/tools/schedule-builder",
    icon: CalendarDays,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    badges: ['free'],
    status: 'active',
  },
  {
    id: 'performance-analyzer',
    title: "محلل الأداء",
    desc: "حلل أداء الطلاب والمعلمين مع تقارير تفصيلية ورسوم بيانية",
    href: "/tools/performance-analyzer",
    icon: BarChart3,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    badges: ['popular', 'pro'],
    status: 'active',
  },
  {
    id: 'report-generator',
    title: "منشئ التقارير",
    desc: "أنشئ تقارير احترافية لتوثيق الفعاليات والبرامج التعليمية",
    href: "/tools/report-generator",
    icon: FileText,
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    badges: ['pro'],
    status: 'active',
  },
  {
    id: 'grade-calculator',
    title: "حاسبة المعدل",
    desc: "احسب المعدل التراكمي والفصلي بسهولة مع دعم أنظمة متعددة",
    href: "/tools/grade-calculator",
    icon: FileBarChart2,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    badges: ['free', 'new'],
    status: 'active',
  },
  {
    id: 'survey-builder',
    title: "منشئ الاستبيانات",
    desc: "صمم استبيانات احترافية لجمع الآراء والتقييمات بسهولة",
    href: "#",
    icon: ClipboardList,
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500/10',
    badges: ['soon'],
    status: 'coming',
  },
  {
    id: 'question-maker',
    title: "منشئ الأسئلة",
    desc: "أنشئ بنك أسئلة تعليمية متنوعة مع خيارات متعددة للإجابات",
    href: "#",
    icon: HelpCircle,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    badges: ['soon'],
    status: 'coming',
  },
  {
    id: 'invitation-maker',
    title: "منشئ الدعوات",
    desc: "صمم دعوات احترافية للمناسبات والفعاليات بأنماط متعددة",
    href: "#",
    icon: CalendarDays,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    badges: ['soon'],
    status: 'coming',
  },
  {
    id: 'letter-maker',
    title: "منشئ الخطابات",
    desc: "أنشئ خطابات رسمية وإدارية بصيغ احترافية متعددة",
    href: "#",
    icon: FileText,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    badges: ['soon'],
    status: 'coming',
  },
];

// Badge component
const ToolBadge = ({ type }: { type: string }) => {
  const badges: Record<string, { bg: string; icon: React.ElementType; text: string }> = {
    free: { bg: 'bg-green-500', icon: Check, text: 'مجاني' },
    new: { bg: 'bg-blue-500', icon: Sparkles, text: 'جديد' },
    popular: { bg: 'bg-amber-500', icon: TrendingUp, text: 'شائع' },
    pro: { bg: 'bg-purple-500', icon: Crown, text: 'محترف' },
    soon: { bg: 'bg-gray-400', icon: Clock, text: 'قريباً' },
  };
  
  const badge = badges[type];
  if (!badge) return null;
  const Icon = badge.icon;
  
  return (
    <span className={`px-2.5 py-1 ${badge.bg} text-white text-[10px] font-bold rounded-full flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {badge.text}
    </span>
  );
};

export default function ToolsPage() {
  const activeTools = allTools.filter(t => t.status === 'active');
  const comingTools = allTools.filter(t => t.status === 'coming');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] via-white to-[#F8FAF9] dark:from-[#0D1B1A] dark:via-[#1B2D2B] dark:to-[#0D1B1A]">
      {/* Navbar */}
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href={ROUTES.HOME}>
          <Button 
            variant="outline" 
            className="border-green-primary/30 text-green-primary hover:bg-green-primary/10"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <Wrench className="w-4 h-4" />
            أدوات مهني الذكية
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-green-dark dark:text-white mb-4">
            جميع الأدوات
            <span className="block text-2xl sm:text-3xl mt-2 text-gray-600 dark:text-gray-300">
              أدوات تنفيذ احترافية متقدمة
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            اختر الأداة المناسبة وابدأ العمل مباشرة. أدوات تفاعلية ذكية لإنشاء محتوى تعليمي وإداري احترافي
          </p>
        </motion.div>

        {/* Active Tools */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-green-dark dark:text-white mb-6 flex items-center gap-2">
            <Play className="w-5 h-5 text-green-primary" />
            الأدوات المتاحة
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={tool.href}>
                    <div className="group h-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1B2D2B] p-6 hover:border-green-primary/50 hover:shadow-lg transition-all duration-300">
                      {/* Badges */}
                      <div className="flex gap-1.5 mb-4">
                        {tool.badges.map((badge) => (
                          <ToolBadge key={badge} type={badge} />
                        ))}
                      </div>

                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-green-dark dark:text-white mb-2 group-hover:text-green-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {tool.desc}
                      </p>

                      {/* Action */}
                      <div className="flex items-center text-green-primary font-medium text-sm">
                        {tool.badges.includes('free') ? 'استخدم مجاناً' : 'استكشف الأداة'}
                        <ChevronRight className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Coming Soon Tools */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-green-dark dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            قريباً
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comingTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                  className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#152B26] p-5 opacity-70"
                >
                  {/* Badge */}
                  <div className="mb-3">
                    <ToolBadge type="soon" />
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
