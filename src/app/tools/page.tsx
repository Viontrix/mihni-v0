"use client";

import Link from "next/link";
import { Wrench, CalendarDays, Award, ClipboardList, FileBarChart2, ArrowLeft } from "lucide-react";

const tools = [
  {
    title: "منشئ الجداول",
    desc: "إنشاء جداول منظمة بسرعة وبشكل احترافي.",
    href: "/tools/schedule-builder",
  },
  {
    title: "منشئ الشهادات",
    desc: "إنشاء شهادات احترافية وتخصيصها بسهولة.",
    href: "/tools/certificate-maker",
  },
  {
    title: "منشئ الاختبارات",
    desc: "إعداد الاختبارات والنماذج التعليمية بسرعة.",
    href: "/tools/quiz-generator",
  },
  {
    title: "منشئ التقارير",
    desc: "تجهيز تقارير مرتبة وجاهزة للطباعة أو المشاركة.",
    href: "/tools/report-generator",
  },
];

const icons = [CalendarDays, Award, ClipboardList, FileBarChart2];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FBF9] to-[#EAF7F3] dark:from-[#0D1B1A] dark:to-[#122422]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between flex-row-reverse">
          <div className="text-right">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 px-4 py-2 mb-4 text-green-700 dark:text-green-300">
              <Wrench className="w-4 h-4" />
              أدوات مهني الذكية
            </div>
            <h1 className="text-4xl font-extrabold text-[#163530] dark:text-white mb-3">الأدوات الذكية</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              اختر الأداة المناسبة وابدأ العمل مباشرة. هذه الصفحة تعرض الوصول السريع لأهم الأدوات الفعلية داخل المنصة.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 font-bold text-green-700 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للوحة التحكم
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {tools.map((tool, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#152B26]"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-white/10 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-[#196956]" />
                </div>

                <h3 className="text-xl font-extrabold text-[#163530] dark:text-white mb-3">
                  {tool.title}
                </h3>

                <p className="text-sm leading-7 text-gray-600 dark:text-gray-300 mb-6">
                  {tool.desc}
                </p>

                <div className="inline-flex items-center rounded-xl bg-[#196956] px-4 py-2 text-white font-bold group-hover:bg-[#15705a]">
                  فتح الأداة
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
