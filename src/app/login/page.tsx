"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // تسجيل الدخول (mock)
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero dark:bg-gradient-dark-hero relative overflow-hidden py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-50" />
      
      {/* Floating Shapes */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-green-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-green-teal/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
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

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-[#1B2D2B] rounded-2xl shadow-2xl border border-green-primary/10 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
              مرحباً بعودتك
            </h1>
            <p className="text-gray-medium dark:text-gray-light text-sm">
              سجّل دخولك للوصول إلى لوحة التحكم
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
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

            {/* Remember & Forgot */}
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

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl shadow-btn hover:shadow-card-hover transition-all hover:-translate-y-0.5"
            >
              تسجيل الدخول
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-green-primary/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-[#1B2D2B] text-gray-medium">أو</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-medium">
            ليس لديك حساب؟{' '}
            <Link href={ROUTES.REGISTER} className="text-green-primary hover:underline font-medium">
              إنشاء حساب جديد
            </Link>
          </p>
        </motion.div>

        {/* Back to Home */}
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
