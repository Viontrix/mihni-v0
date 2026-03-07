"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FileText,
  Search,
  ArrowLeft,
  Download,
  Eye,
  Crown,
  Briefcase
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/sections/Navbar';

const templates = [
  {
    id: 'certificate-excellence',
    name: 'شهادة تفوق',
    description: 'قالب شهادة تفوق للطلاب المتميزين',
    category: 'شهادات',
    downloads: 1250,
    isPro: false,
    image: '/templates/certificate-1.png',
  },
  {
    id: 'weekly-schedule',
    name: 'جدول أسبوعي',
    description: 'قالب جدول حصص أسبوعي منظم',
    category: 'جداول',
    downloads: 890,
    isPro: false,
    image: '/templates/schedule-1.png',
  },
  {
    id: 'performance-report',
    name: 'تقرير أداء',
    description: 'نموذج تقرير أداء شامل',
    category: 'تقارير',
    downloads: 670,
    isPro: true,
    image: '/templates/report-1.png',
  },
  {
    id: 'quiz-template',
    name: 'نموذج اختبار',
    description: 'قالب اختبار قابل للتخصيص',
    category: 'اختبارات',
    downloads: 1100,
    isPro: false,
    image: '/templates/quiz-1.png',
  },
  {
    id: 'certificate-participation',
    name: 'شهادة مشاركة',
    description: 'قالب شهادة مشاركة في فعالية',
    category: 'شهادات',
    downloads: 750,
    isPro: false,
    image: '/templates/certificate-2.png',
  },
  {
    id: 'monthly-report',
    name: 'تقرير شهري',
    description: 'نموذج تقرير شهري مفصل',
    category: 'تقارير',
    downloads: 420,
    isPro: true,
    image: '/templates/report-2.png',
  },
];

const categories = ['الكل', 'شهادات', 'جداول', 'تقارير', 'اختبارات'];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || template.category === selectedCategory;
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
              <FileText className="w-4 h-4" />
              مكتبة القوالب
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-green-dark dark:text-white mb-6">
              قوالب <span className="text-green-primary">جاهزة للاستخدام</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              مجموعة متنوعة من القوالب الاحترافية المصممة خصيصاً للمعلمين والإداريين
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن قالب..."
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

      {/* Templates Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white dark:bg-[#1B2D2B] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-green-primary/30 transition-all shadow-sm hover:shadow-xl group">
                  {/* Preview Image */}
                  <div className="relative h-48 bg-gradient-to-br from-green-primary/10 to-green-teal/10 flex items-center justify-center">
                    <FileText className="w-20 h-20 text-green-primary/30" />
                    {template.isPro && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-400 text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button variant="secondary" size="sm" className="rounded-full">
                        <Eye className="w-4 h-4 mr-1" />
                        معاينة
                      </Button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-green-dark dark:text-white">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">{template.category}</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {template.downloads} تحميل
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white rounded-full"
                      >
                        استخدم القالب
                        <ArrowLeft className="w-3 h-3 mr-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
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
