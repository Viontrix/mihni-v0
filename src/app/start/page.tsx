"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap,
  Search,
  ArrowLeft,
  Award,
  FileText,
  Calendar,
  BarChart3,
  ClipboardList,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/sections/Navbar';

const tools = [
  {
    id: 'certificate-maker',
    name: 'منشئ الشهادات',
    description: 'صمم وأنشئ شهادات تقدير احترافية بتصاميم متعددة',
    icon: Award,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    category: 'تصميم',
    isNew: false,
    isPro: false,
  },
  {
    id: 'quiz-generator',
    name: 'منشئ الاختبارات',
    description: 'أنشئ اختبارات ذكية مع خيارات متعددة وتصحيح تلقائي',
    icon: FileText,
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    category: 'تعليم',
    isNew: true,
    isPro: false,
  },
  {
    id: 'schedule-builder',
    name: 'منشئ الجداول',
    description: 'نظم جداولك الدراسية والمهام بسهولة',
    icon: Calendar,
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-purple-50',
    category: 'تنظيم',
    isNew: false,
    isPro: false,
  },
  {
    id: 'performance-analyzer',
    name: 'محلل الأداء',
    description: 'حلل النتائج والأداء مع رسوم بيانية تفاعلية',
    icon: BarChart3,
    color: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50',
    category: 'تحليل',
    isNew: false,
    isPro: true,
  },
  {
    id: 'report-builder',
    name: 'منشئ التقارير',
    description: 'أنشئ تقارير مهنية شاملة وقابلة للتخصيص',
    icon: ClipboardList,
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-50',
    category: 'تقارير',
    isNew: false,
    isPro: true,
  },
  {
    id: 'survey-builder',
    name: 'منشئ الاستبيانات',
    description: 'أنشئ استبيانات احترافية لجمع البيانات والآراء',
    icon: MessageSquare,
    color: 'from-teal-400 to-green-500',
    bgColor: 'bg-teal-50',
    category: 'بحث',
    isNew: true,
    isPro: false,
  },
];

const categories = ['الكل', 'تصميم', 'تعليم', 'تنظيم', 'تحليل', 'تقارير', 'بحث'];

export default function StartPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
      <Navbar />
      <div className="h-[80px]" />

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-green-primary/10 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-primary/10 to-green-teal/10 text-green-primary text-sm font-semibold mb-6 border border-green-primary/20"
            >
              <Zap className="w-4 h-4" />
              الأدوات الذكية
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-green-dark dark:text-white mb-6">
              اختر <span className="text-green-primary">الأداة المناسبة</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              مجموعة من الأدوات الذكية المصممة خصيصاً للكوادر التعليمية
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن أداة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-14 py-6 text-lg rounded-2xl border-2 border-green-primary/20 focus:border-green-primary bg-white dark:bg-[#1B2D2B] shadow-lg"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`rounded-full ${
                    selectedCategory === category
                      ? 'bg-green-primary text-white'
                      : 'border-green-primary/20 text-gray-600 hover:border-green-primary'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/tools/${tool.id}`}>
                    <div className="bg-white dark:bg-[#1B2D2B] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:border-green-primary/30 transition-all shadow-sm hover:shadow-xl group cursor-pointer h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex gap-2">
                          {tool.isNew && (
                            <Badge className="bg-green-primary text-white">جديد</Badge>
                          )}
                          {tool.isPro && (
                            <Badge variant="outline" className="border-amber-400 text-amber-600">Pro</Badge>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-green-dark dark:text-white mb-2">{tool.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                        <span className="text-green-primary group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                          ابدأ الآن
                          <ArrowLeft className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة أو اختر فئة أخرى</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
