"use client";

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ROUTES, getTemplateUrl } from '@/lib/routes';
import { 
  Award, 
  FileText, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  BookOpen,
  GraduationCap,
  Medal,
  CheckCircle,
  TrendingUp,
  Star,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Download,
  Eye,
  Heart,
  Lock,
  Check,
  Users,
  Target,
  Briefcase,
  FolderKanban,
  FileBarChart,
  Radio,
  PartyPopper,
  ScrollText,
  UserCheck,
  FolderCheck,
  Trophy,
  Presentation,
  MessagesSquare,
  ClipboardCheck,
  UserCog,
  FileBadge,
  Building2,
  Handshake,
  FileSearch,
  UserPlus,
  AlertTriangle,
  FileX,
  Lightbulb,
  UsersRound,
  CalendarDays,
  FileCheck,
  FilePen,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/sections/Navbar';

// Template Badge Component
const TemplateBadge = ({ type }: { type: string }) => {
  const badges: Record<string, { bg: string; icon: React.ElementType; text: string }> = {
    free: { bg: 'bg-green-500', icon: Check, text: 'مجاني' },
    new: { bg: 'bg-blue-500', icon: Sparkles, text: 'جديد' },
    popular: { bg: 'bg-amber-500', icon: TrendingUp, text: 'شائع' },
    pro: { bg: 'bg-purple-500', icon: Lock, text: 'محترف' },
  };
  
  const badge = badges[type];
  if (!badge) return null;
  const Icon = badge.icon;
  
  return (
    <span className={`px-2 py-0.5 ${badge.bg} text-white text-[10px] font-bold rounded-full flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {badge.text}
    </span>
  );
};

// Template Card Component
const TemplateCard = ({ template, index }: { template: typeof allTemplates[0]; index: number }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-[#1B2D2B] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-green-primary/50 transition-all duration-300 hover:shadow-lg"
    >
      {/* Preview Image */}
      <div className={`h-36 ${template.gradient} relative overflow-hidden`}>
        {/* Template Preview Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-16 h-16 bg-white/90 dark:bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg"
          >
            <template.icon className={`w-8 h-8 ${template.iconColor}`} />
          </motion.div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1">
          {template.badges.map((badge) => (
            <TemplateBadge key={badge} type={badge} />
          ))}
        </div>
        
        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-green-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            className="flex gap-2"
          >
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-green-primary hover:text-white transition-colors">
              <Eye className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-100 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
          {template.category}
        </span>
        
        {/* Title */}
        <h4 className="font-bold text-green-dark dark:text-white mt-1 mb-2 group-hover:text-green-primary transition-colors line-clamp-1">
          {template.name}
        </h4>
        
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            {template.downloads}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            {template.rating}
          </span>
        </div>
        
        {/* Action */}
        <Link href={getTemplateUrl(template.id)}>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-xs border-green-primary/30 text-green-primary hover:bg-green-primary hover:text-white transition-all"
          >
            {template.badges.includes('free') ? 'استخدم مجاناً' : 'استخدم القالب'}
            <ChevronRight className="w-4 h-4 mr-auto" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

// Template Categories
const categories = [
  { id: 'all', name: 'الكل', count: 65 },
  { id: 'educational', name: 'تعليمية', count: 20 },
  { id: 'activities', name: 'أنشطة وفعاليات', count: 10 },
  { id: 'admin', name: 'إدارية', count: 8 },
  { id: 'training', name: 'تدريب', count: 11 },
  { id: 'hr', name: 'موارد بشرية', count: 10 },
  { id: 'projects', name: 'إدارة مشاريع', count: 10 },
  { id: 'consulting', name: 'استشارات', count: 6 },
];

// All Templates Data
const allTemplates = [
  // ===== قوالب تعليمية =====
  {
    id: 'daily-lesson-prep',
    name: 'تحضير درس يومي',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100',
    badges: ['free', 'popular'],
    icon: BookOpen,
    iconColor: 'text-blue-500',
    downloads: '3.2k',
    rating: '4.9',
  },
  {
    id: 'weekly-prep',
    name: 'تحضير أسبوعي',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-indigo-100 via-indigo-50 to-purple-100',
    badges: ['free'],
    icon: Calendar,
    iconColor: 'text-indigo-500',
    downloads: '2.8k',
    rating: '4.8',
  },
  {
    id: 'curriculum-distribution',
    name: 'توزيع منهج',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-teal-100 via-teal-50 to-cyan-100',
    badges: ['free'],
    icon: ClipboardList,
    iconColor: 'text-teal-500',
    downloads: '2.1k',
    rating: '4.7',
  },
  {
    id: 'weekly-plan',
    name: 'الخطة الأسبوعية',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-green-100 via-green-50 to-emerald-100',
    badges: ['free', 'popular'],
    icon: CalendarDays,
    iconColor: 'text-green-500',
    downloads: '4.1k',
    rating: '4.9',
  },
  {
    id: 'worksheet',
    name: 'ورقة عمل',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100',
    badges: ['free'],
    icon: FileText,
    iconColor: 'text-amber-500',
    downloads: '3.5k',
    rating: '4.8',
  },
  {
    id: 'short-quiz',
    name: 'اختبار قصير',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100',
    badges: ['free', 'popular'],
    icon: ClipboardCheck,
    iconColor: 'text-rose-500',
    downloads: '5.2k',
    rating: '4.9',
  },
  {
    id: 'remedial-plan',
    name: 'خطة علاجية',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-orange-100 via-orange-50 to-amber-100',
    badges: ['pro'],
    icon: Target,
    iconColor: 'text-orange-500',
    downloads: '1.8k',
    rating: '4.7',
  },
  {
    id: 'enrichment-plan',
    name: 'خطة إثرائية',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100',
    badges: ['pro'],
    icon: Lightbulb,
    iconColor: 'text-purple-500',
    downloads: '1.5k',
    rating: '4.6',
  },
  {
    id: 'student-tracking',
    name: 'سجل متابعة الطالبات',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-100',
    badges: ['free'],
    icon: Users,
    iconColor: 'text-cyan-500',
    downloads: '2.9k',
    rating: '4.8',
  },
  {
    id: 'model-lesson',
    name: 'توثيق حصة نموذجية',
    category: 'تعليمية',
    categoryId: 'educational',
    gradient: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-green-100',
    badges: ['new', 'pro'],
    icon: Trophy,
    iconColor: 'text-emerald-500',
    downloads: '987',
    rating: '4.9',
  },

  // ===== قوالب أنشطة وفعاليات =====
  {
    id: 'student-activity-report',
    name: 'تقرير نشاط طلابي',
    category: 'أنشطة وفعاليات',
    categoryId: 'activities',
    gradient: 'bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100',
    badges: ['free'],
    icon: FileBarChart,
    iconColor: 'text-pink-500',
    downloads: '2.3k',
    rating: '4.7',
  },
  {
    id: 'educational-initiative',
    name: 'مبادرة تعليمية',
    category: 'أنشطة وفعاليات',
    categoryId: 'activities',
    gradient: 'bg-gradient-to-br from-violet-100 via-violet-50 to-purple-100',
    badges: ['new', 'pro'],
    icon: Lightbulb,
    iconColor: 'text-violet-500',
    downloads: '1.2k',
    rating: '4.8',
  },
  {
    id: 'school-radio',
    name: 'برنامج إذاعي مدرسي',
    category: 'أنشطة وفعاليات',
    categoryId: 'activities',
    gradient: 'bg-gradient-to-br from-red-100 via-red-50 to-orange-100',
    badges: ['free', 'popular'],
    icon: Radio,
    iconColor: 'text-red-500',
    downloads: '3.8k',
    rating: '4.9',
  },
  {
    id: 'school-event-plan',
    name: 'خطة فعالية مدرسية',
    category: 'أنشطة وفعاليات',
    categoryId: 'activities',
    gradient: 'bg-gradient-to-br from-fuchsia-100 via-fuchsia-50 to-pink-100',
    badges: ['free'],
    icon: PartyPopper,
    iconColor: 'text-fuchsia-500',
    downloads: '2.1k',
    rating: '4.7',
  },
  {
    id: 'evidence-record',
    name: 'سجل الشواهد',
    category: 'أنشطة وفعاليات',
    categoryId: 'activities',
    gradient: 'bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100',
    badges: ['pro'],
    icon: FolderCheck,
    iconColor: 'text-slate-500',
    downloads: '1.4k',
    rating: '4.6',
  },
  {
    id: 'professional-portfolio',
    name: 'ملف الإنجاز المهني',
    category: 'أنشطة وفعاليات',
    categoryId: 'activities',
    gradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100',
    badges: ['popular', 'pro'],
    icon: Trophy,
    iconColor: 'text-amber-500',
    downloads: '2.7k',
    rating: '4.9',
  },
  {
    id: 'appreciation-certificate',
    name: 'شهادة شكر وتقدير',
    category: 'أنشطة وفعاليات',
    categoryId: 'activities',
    gradient: 'bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-100',
    badges: ['free', 'popular'],
    icon: Award,
    iconColor: 'text-yellow-600',
    downloads: '6.2k',
    rating: '4.9',
  },

  // ===== قوالب إدارية =====
  {
    id: 'meeting-minutes',
    name: 'محضر اجتماع',
    category: 'إدارية',
    categoryId: 'admin',
    gradient: 'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100',
    badges: ['free', 'popular'],
    icon: MessagesSquare,
    iconColor: 'text-blue-500',
    downloads: '4.5k',
    rating: '4.8',
  },
  {
    id: 'official-letter',
    name: 'خطاب رسمي',
    category: 'إدارية',
    categoryId: 'admin',
    gradient: 'bg-gradient-to-br from-gray-100 via-gray-50 to-slate-100',
    badges: ['free'],
    icon: ScrollText,
    iconColor: 'text-gray-600',
    downloads: '3.9k',
    rating: '4.7',
  },
  {
    id: 'leave-request',
    name: 'طلب استئذان',
    category: 'إدارية',
    categoryId: 'admin',
    gradient: 'bg-gradient-to-br from-teal-100 via-teal-50 to-cyan-100',
    badges: ['free'],
    icon: FileCheck,
    iconColor: 'text-teal-500',
    downloads: '2.8k',
    rating: '4.6',
  },
  {
    id: 'admin-meeting-minutes',
    name: 'محضر اجتماع إداري',
    category: 'إدارية',
    categoryId: 'admin',
    gradient: 'bg-gradient-to-br from-indigo-100 via-indigo-50 to-blue-100',
    badges: ['pro'],
    icon: MessageCircle,
    iconColor: 'text-indigo-500',
    downloads: '1.6k',
    rating: '4.7',
  },
  {
    id: 'training-center-report',
    name: 'تقرير أداء مركز تدريبي',
    category: 'إدارية',
    categoryId: 'admin',
    gradient: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-green-100',
    badges: ['new', 'pro'],
    icon: BarChart3,
    iconColor: 'text-emerald-500',
    downloads: '876',
    rating: '4.8',
  },
  {
    id: 'trainee-satisfaction-survey',
    name: 'استبيان رضا المتدربين',
    category: 'إدارية',
    categoryId: 'admin',
    gradient: 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100',
    badges: ['free'],
    icon: ClipboardList,
    iconColor: 'text-purple-500',
    downloads: '2.1k',
    rating: '4.7',
  },

  // ===== قوالب تدريب =====
  {
    id: 'training-program-plan',
    name: 'خطة برنامج تدريبي',
    category: 'تدريب',
    categoryId: 'training',
    gradient: 'bg-gradient-to-br from-green-100 via-green-50 to-emerald-100',
    badges: ['pro', 'popular'],
    icon: FolderKanban,
    iconColor: 'text-green-500',
    downloads: '2.4k',
    rating: '4.8',
  },
  {
    id: 'trainee-registration',
    name: 'تسجيل متدرب',
    category: 'تدريب',
    categoryId: 'training',
    gradient: 'bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-100',
    badges: ['free'],
    icon: UserPlus,
    iconColor: 'text-cyan-500',
    downloads: '1.9k',
    rating: '4.6',
  },
  {
    id: 'training-course-evaluation',
    name: 'تقييم دورة تدريبية',
    category: 'تدريب',
    categoryId: 'training',
    gradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100',
    badges: ['free', 'popular'],
    icon: Star,
    iconColor: 'text-amber-500',
    downloads: '3.1k',
    rating: '4.9',
  },
  {
    id: 'training-execution-report',
    name: 'تقرير تنفيذ برنامج تدريبي',
    category: 'تدريب',
    categoryId: 'training',
    gradient: 'bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100',
    badges: ['pro'],
    icon: FileBarChart,
    iconColor: 'text-rose-500',
    downloads: '1.3k',
    rating: '4.7',
  },
  {
    id: 'training-agreement',
    name: 'اتفاقية تقديم تدريب',
    category: 'تدريب',
    categoryId: 'training',
    gradient: 'bg-gradient-to-br from-indigo-100 via-indigo-50 to-purple-100',
    badges: ['pro'],
    icon: Handshake,
    iconColor: 'text-indigo-500',
    downloads: '987',
    rating: '4.6',
  },
  {
    id: 'employee-development-plan',
    name: 'خطة تطوير مهني للموظفين',
    category: 'تدريب',
    categoryId: 'training',
    gradient: 'bg-gradient-to-br from-violet-100 via-violet-50 to-purple-100',
    badges: ['new', 'pro'],
    icon: TrendingUp,
    iconColor: 'text-violet-500',
    downloads: '1.1k',
    rating: '4.8',
  },

  // ===== قوالب موارد بشرية =====
  {
    id: 'job-application',
    name: 'نموذج طلب توظيف',
    category: 'موارد بشرية',
    categoryId: 'hr',
    gradient: 'bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100',
    badges: ['free', 'popular'],
    icon: FileBadge,
    iconColor: 'text-blue-500',
    downloads: '4.2k',
    rating: '4.8',
  },
  {
    id: 'job-interview',
    name: 'نموذج مقابلة وظيفية',
    category: 'موارد بشرية',
    categoryId: 'hr',
    gradient: 'bg-gradient-to-br from-teal-100 via-teal-50 to-emerald-100',
    badges: ['pro'],
    icon: UserCheck,
    iconColor: 'text-teal-500',
    downloads: '1.8k',
    rating: '4.7',
  },
  {
    id: 'employee-performance-evaluation',
    name: 'تقييم أداء الموظف',
    category: 'موارد بشرية',
    categoryId: 'hr',
    gradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100',
    badges: ['pro', 'popular'],
    icon: BarChart3,
    iconColor: 'text-amber-500',
    downloads: '2.9k',
    rating: '4.9',
  },
  {
    id: 'work-commencement',
    name: 'نموذج مباشرة عمل',
    category: 'موارد بشرية',
    categoryId: 'hr',
    gradient: 'bg-gradient-to-br from-green-100 via-green-50 to-emerald-100',
    badges: ['free'],
    icon: UserCog,
    iconColor: 'text-green-500',
    downloads: '2.1k',
    rating: '4.6',
  },
  {
    id: 'leave-request-hr',
    name: 'نموذج طلب إجازة',
    category: 'موارد بشرية',
    categoryId: 'hr',
    gradient: 'bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-100',
    badges: ['free'],
    icon: Calendar,
    iconColor: 'text-cyan-500',
    downloads: '3.5k',
    rating: '4.7',
  },
  {
    id: 'employee-warning',
    name: 'نموذج إنذار موظف',
    category: 'موارد بشرية',
    categoryId: 'hr',
    gradient: 'bg-gradient-to-br from-red-100 via-red-50 to-orange-100',
    badges: ['pro'],
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    downloads: '1.2k',
    rating: '4.5',
  },
  {
    id: 'employee-training-plan',
    name: 'خطة تدريب الموظفين',
    category: 'موارد بشرية',
    categoryId: 'hr',
    gradient: 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100',
    badges: ['pro'],
    icon: GraduationCap,
    iconColor: 'text-purple-500',
    downloads: '1.6k',
    rating: '4.7',
  },
  {
    id: 'resignation',
    name: 'نموذج استقالة موظف',
    category: 'موارد بشرية',
    categoryId: 'hr',
    gradient: 'bg-gradient-to-br from-gray-100 via-gray-50 to-slate-100',
    badges: ['free'],
    icon: FileX,
    iconColor: 'text-gray-500',
    downloads: '1.9k',
    rating: '4.6',
  },

  // ===== قوالب إدارة مشاريع =====
  {
    id: 'project-charter',
    name: 'ميثاق المشروع',
    category: 'إدارة مشاريع',
    categoryId: 'projects',
    gradient: 'bg-gradient-to-br from-indigo-100 via-indigo-50 to-blue-100',
    badges: ['pro', 'popular'],
    icon: FolderKanban,
    iconColor: 'text-indigo-500',
    downloads: '2.1k',
    rating: '4.9',
  },
  {
    id: 'project-execution-plan',
    name: 'خطة تنفيذ المشروع',
    category: 'إدارة مشاريع',
    categoryId: 'projects',
    gradient: 'bg-gradient-to-br from-teal-100 via-teal-50 to-cyan-100',
    badges: ['pro'],
    icon: ClipboardList,
    iconColor: 'text-teal-500',
    downloads: '1.7k',
    rating: '4.8',
  },
  {
    id: 'project-progress-tracking',
    name: 'متابعة تقدم المشروع',
    category: 'إدارة مشاريع',
    categoryId: 'projects',
    gradient: 'bg-gradient-to-br from-green-100 via-green-50 to-emerald-100',
    badges: ['pro'],
    icon: TrendingUp,
    iconColor: 'text-green-500',
    downloads: '1.5k',
    rating: '4.7',
  },
  {
    id: 'risk-register',
    name: 'سجل المخاطر',
    category: 'إدارة مشاريع',
    categoryId: 'projects',
    gradient: 'bg-gradient-to-br from-red-100 via-red-50 to-orange-100',
    badges: ['pro'],
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    downloads: '1.1k',
    rating: '4.6',
  },
  {
    id: 'project-closure',
    name: 'نموذج إغلاق مشروع',
    category: 'إدارة مشاريع',
    categoryId: 'projects',
    gradient: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-green-100',
    badges: ['pro'],
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    downloads: '987',
    rating: '4.7',
  },
  {
    id: 'change-management',
    name: 'إدارة التغيير في المشروع',
    category: 'إدارة مشاريع',
    categoryId: 'projects',
    gradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100',
    badges: ['new', 'pro'],
    icon: FilePen,
    iconColor: 'text-amber-500',
    downloads: '654',
    rating: '4.8',
  },
  {
    id: 'stakeholder-register',
    name: 'سجل أصحاب المصلحة',
    category: 'إدارة مشاريع',
    categoryId: 'projects',
    gradient: 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100',
    badges: ['pro'],
    icon: UsersRound,
    iconColor: 'text-purple-500',
    downloads: '876',
    rating: '4.6',
  },
  {
    id: 'project-success-evaluation',
    name: 'تقييم نجاح المشروع',
    category: 'إدارة مشاريع',
    categoryId: 'projects',
    gradient: 'bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-100',
    badges: ['pro'],
    icon: Trophy,
    iconColor: 'text-cyan-500',
    downloads: '765',
    rating: '4.8',
  },

  // ===== قوالب استشارات =====
  {
    id: 'consulting-service-offer',
    name: 'عرض خدمة استشارية',
    category: 'استشارات',
    categoryId: 'consulting',
    gradient: 'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100',
    badges: ['pro', 'popular'],
    icon: Briefcase,
    iconColor: 'text-blue-500',
    downloads: '1.8k',
    rating: '4.9',
  },
  {
    id: 'consulting-agreement',
    name: 'اتفاقية استشارية',
    category: 'استشارات',
    categoryId: 'consulting',
    gradient: 'bg-gradient-to-br from-teal-100 via-teal-50 to-cyan-100',
    badges: ['pro'],
    icon: Handshake,
    iconColor: 'text-teal-500',
    downloads: '1.2k',
    rating: '4.7',
  },
  {
    id: 'consulting-report',
    name: 'تقرير استشاري',
    category: 'استشارات',
    categoryId: 'consulting',
    gradient: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-green-100',
    badges: ['pro'],
    icon: FileText,
    iconColor: 'text-emerald-500',
    downloads: '987',
    rating: '4.8',
  },
  {
    id: 'client-needs-analysis',
    name: 'تحليل احتياج العميل',
    category: 'استشارات',
    categoryId: 'consulting',
    gradient: 'bg-gradient-to-br from-violet-100 via-violet-50 to-purple-100',
    badges: ['new', 'pro'],
    icon: FileSearch,
    iconColor: 'text-violet-500',
    downloads: '654',
    rating: '4.7',
  },
  {
    id: 'client-follow-up',
    name: 'متابعة عميل',
    category: 'استشارات',
    categoryId: 'consulting',
    gradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100',
    badges: ['pro'],
    icon: Users,
    iconColor: 'text-amber-500',
    downloads: '543',
    rating: '4.6',
  },
  {
    id: 'business-plan',
    name: 'خطة عمل',
    category: 'استشارات',
    categoryId: 'consulting',
    gradient: 'bg-gradient-to-br from-indigo-100 via-indigo-50 to-blue-100',
    badges: ['pro', 'new'],
    icon: Building2,
    iconColor: 'text-indigo-500',
    downloads: '1.1k',
    rating: '4.9',
  },
];

// Grid Icon for stats
function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function TemplatesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const filteredTemplates = allTemplates.filter(
    (template) => activeCategory === 'all' || template.categoryId === activeCategory
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1B1A]">
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

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300A896' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Section Header */}
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
            <BookOpen className="w-4 h-4" />
            مكتبة القوالب الجاهزة
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-green-dark dark:text-white mb-4">
            Template Library
            <span className="block text-2xl sm:text-3xl mt-2 text-gray-600 dark:text-gray-300">
              قوالب فردية مستقلة جاهزة للاستخدام
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            مكتبة ضخمة من القوالب الاحترافية المصممة مسبقاً، تعديل بسيط فقط بدون تخصيص متقدم
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          {[
            { value: '65+', label: 'قالب جاهز', icon: FileText },
            { value: '8', label: 'تصنيف', icon: GridIcon },
            { value: '50k+', label: 'تحميل', icon: Download },
            { value: '4.8', label: 'تقييم', icon: Star },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <stat.icon className="w-4 h-4 text-green-primary" />
              <span className="font-bold text-green-dark dark:text-white">{stat.value}</span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-green-primary text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat.name}
              <span className={`mr-1.5 text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>
                ({cat.count})
              </span>
            </button>
          ))}
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {filteredTemplates.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </motion.div>

        {/* Free Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-bold text-green-primary">مجاني:</span> جميع القوالب المجانية متاحة للاستخدام الفوري
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
