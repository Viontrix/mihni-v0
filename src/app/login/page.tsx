"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Briefcase,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  // Show configuration message when Supabase is not set up
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero dark:bg-gradient-dark-hero relative overflow-hidden py-8">
        <div className="absolute inset-0 pattern-grid opacity-50" />
        <div className="relative z-10 w-full max-w-lg px-4">
          <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl shadow-2xl border border-green-primary/10 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-green-dark dark:text-white mb-3">
              إعداد قاعدة البيانات مطلوب
            </h1>
            <p className="text-gray-medium dark:text-gray-light mb-6">
              تسجيل الدخول غير متاح حالياً. يرجى إعداد متغيرات بيئة Supabase للمتابعة.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-primary hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email || !formData.password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (!data.session) {
        setErrorMessage('تم تسجيل الدخول لكن لم يتم إنشاء session.');
        return;
      }

      localStorage.setItem(
        'mihni-manual-session',
        JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
      );

      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero dark:bg-gradient-dark-hero relative overflow-hidden py-8">
      <div className="absolute inset-0 pattern-grid opacity-50" />

      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-green-primary/5 blur-3xl animate-float" />
      <div
        className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-green-teal/5 blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 w-full max-w-lg px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center shadow-btn">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-dark dark:text-white">مِهني</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-[#1B2D2B] rounded-2xl shadow-2xl border border-green-primary/10 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-gray-medium dark:text-gray-light text-sm">
              سجّل دخولك للوصول إلى لوحة التحكم ومشاريعك
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-dark dark:text-white">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pr-10 h-12 bg-cream dark:bg-[#152B26] border-green-primary/20 focus:border-green-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-dark dark:text-white">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10 pl-12 h-12 bg-cream dark:bg-[#152B26] border-green-primary/20 focus:border-green-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-green-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                  className="border-green-primary/30 data-[state=checked]:bg-green-primary data-[state=checked]:border-green-primary"
                />
                <Label htmlFor="remember" className="text-sm text-gray-medium cursor-pointer">
                  تذكرني
                </Label>
              </div>
              <Link href="#" className="text-sm text-green-primary hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl shadow-btn hover:shadow-card-hover transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  دخول
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-medium">
            ليس لديك حساب؟{' '}
            <Link href={ROUTES.REGISTER} className="text-green-primary hover:underline font-medium">
              إنشاء حساب جديد
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-6"
        >
          <Link href="/" className="text-gray-medium hover:text-green-primary transition-colors text-sm">
            العودة للصفحة الرئيسية
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
