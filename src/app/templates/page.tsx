"use client";

import Link from "next/link";
import { LayoutTemplate, GraduationCap, Briefcase, FolderKanban, ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "قوالب تعليمية",
    desc: "تحاضير، اختبارات، سجلات وخطط قابلة للتخصيص.",
  },
  {
    title: "قوالب إدارية",
    desc: "تقارير، نماذج، خطابات ومستندات عملية جاهزة.",
  },
  {
    title: "قوالب مشاريع",
    desc: "نماذج تنظيم ومتابعة وإدارة المشاريع والمهام.",
  },
];

const icons = [GraduationCap, Briefcase, FolderKanban];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FBF9] to-[#EEF8F5] dark:from-[#0D1B1A] dark:to-[#122422]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between flex-row-reverse">
          <div className="text-right">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 px-4 py-2 mb-4 text-green-700 dark:text-green-300">
              <LayoutTemplate className="w-4 h-4" />
              مكتبة القوالب
            </div>
            <h1 className="text-4xl font-extrabold text-[#163530] dark:text-white mb-3">القوالب الجاهزة</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              صفحة القوالب الرئيسية داخل مهني. اختر المجال المناسب ثم سنربط كل قسم لاحقًا بالقوالب الكاملة الموجودة في المنصة.
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

        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((section, i) => {
            const Icon = icons[i];
            return (
              <div
                key={section.title}
                className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#152B26]"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-white/10 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-[#196956]" />
                </div>

                <h3 className="text-xl font-extrabold text-[#163530] dark:text-white mb-3">
                  {section.title}
                </h3>

                <p className="text-sm leading-7 text-gray-600 dark:text-gray-300 mb-6">
                  {section.desc}
                </p>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center rounded-xl bg-[#196956] px-4 py-2 text-white font-bold hover:bg-[#15705a]"
                >
                  العودة للوحة التحكم
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
