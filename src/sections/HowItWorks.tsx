"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { UserPlus, FileText, Share2, BarChart3, Check, ArrowLeft, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'أنشئ حسابك',
    description: 'سجل بخطوات بسيطة واختر الباقة المناسبة لاحتياجاتك',
    color: 'from-cyan-400 to-blue-500',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    bgGlow: 'bg-cyan-400/20',
  },
  {
    number: '02',
    icon: FileText,
    title: 'اختر قالب أو أداة',
    description: 'اختر من مكتبة القوالب والأدوات الذكية الاحترافية',
    color: 'from-green-400 to-emerald-600',
    glowColor: 'rgba(45, 106, 79, 0.4)',
    bgGlow: 'bg-green-400/20',
  },
  {
    number: '03',
    icon: Share2,
    title: 'خصص وأنشئ',
    description: 'خصص القالب أو استخدم الأداة الذكية لإنشاء محتواك',
    color: 'from-fuchsia-500 to-purple-600',
    glowColor: 'rgba(192, 38, 211, 0.4)',
    bgGlow: 'bg-fuchsia-400/20',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'صدّر وشارك',
    description: 'صدّر بصيغ متعددة وشارك مع فريقك أو عملائك',
    color: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    bgGlow: 'bg-amber-400/20',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = useState(-1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Staggered animation for steps
  useEffect(() => {
    if (isInView && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isInView, activeStep]);

  return (
    <section id="how-it-works" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#0D1B1A] dark:via-[#0F1F1D] dark:to-[#0D1B1A] relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-green-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-400/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-green-primary/3 to-cyan-400/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-primary/10 to-cyan-400/10 border border-green-primary/20 text-green-primary dark:text-green-light text-sm font-semibold backdrop-blur-sm"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(45, 106, 79, 0.15)' }}
              animate={{ 
                boxShadow: ['0 0 0 rgba(45, 106, 79, 0)', '0 0 30px rgba(45, 106, 79, 0.1)', '0 0 0 rgba(45, 106, 79, 0)']
              }}
              transition={{ boxShadow: { duration: 3, repeat: Infinity } }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.span>
              رحلتك تبدأ من هنا
            </motion.span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-dark dark:text-white mb-4">
            أربع خطوات
            <span className="bg-gradient-to-r from-green-primary via-green-teal to-cyan-400 bg-clip-text text-transparent"> للبدء</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            رحلة بسيطة لإنجاز عملك باحترافية
          </p>
        </motion.div>

        {/* Steps Container */}
        <div ref={ref} className="relative pt-16 lg:pt-20">
          {/* Timeline - Desktop */}
          <div className="hidden lg:block absolute top-0 left-[12%] right-[12%]">
            {/* Background line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700/50 rounded-full" />
            
            {/* Animated progress line - RTL (right to left) */}
            <motion.div 
              className="absolute top-4 right-0 h-0.5 bg-gradient-to-l from-green-primary via-green-teal to-cyan-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: isInView ? `${Math.max(0, ((activeStep + 1) / steps.length) * 100)}%` : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* Step indicators on timeline */}
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const isActive = index <= activeStep;
                const isCurrent = index === activeStep;
                
                return (
                  <motion.div
                    key={`indicator-${index}`}
                    className="relative flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Connector circle */}
                    <motion.div 
                      className="relative"
                      animate={{ scale: isCurrent ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Glow effect for active */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 w-11 h-11 -top-1 -left-1 rounded-full bg-green-primary/30 blur-md"
                          />
                        )}
                      </AnimatePresence>
                      
                      <motion.div 
                        className="relative w-10 h-10 rounded-full border-[3px] border-white dark:border-[#0F1F1D] flex items-center justify-center z-10"
                        animate={{
                          backgroundColor: isActive ? 'rgb(45, 106, 79)' : 'rgb(229, 231, 235)',
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        <AnimatePresence mode="wait">
                          {isActive ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              <Check className="w-5 h-5 text-white" strokeWidth={3} />
                            </motion.div>
                          ) : (
                            <motion.span
                              key="number"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-3xl font-bold text-gray-500"
                            >
                              {step.number}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>

                    {/* Step number label - Larger size */}
                    <motion.span
                      className="mt-4 text-xl font-bold tracking-wider text-gray-500 dark:text-gray-400"
                      animate={{ 
                        color: isActive ? 'rgb(45, 106, 79)' : 'rgb(107, 114, 128)',
                      }}
                    >
                      {step.number}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Steps Grid - RTL: step 01 on the right, 04 on the left */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 lg:pt-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              const isCurrent = index === activeStep;
              const isHovered = hoveredStep === index;
              
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={isInView ? { 
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  } : {}}
                  transition={{ 
                    delay: index * 0.15 + 0.3, 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className="relative"
                >
                  {/* Card */}
                  <motion.div 
                    className="relative p-6 sm:p-7 rounded-3xl border border-gray-200/80 dark:border-gray-700/50 bg-white/80 dark:bg-[#1B2D2B]/60 backdrop-blur-xl shadow-sm overflow-hidden h-full"
                    animate={{
                      borderColor: isActive || isHovered ? 'rgba(45, 106, 79, 0.5)' : 'rgba(229, 231, 235, 0.8)',
                      y: isHovered ? -10 : 0,
                      boxShadow: isHovered 
                        ? `0 25px 50px -12px ${step.glowColor}` 
                        : isActive 
                          ? '0 10px 40px -15px rgba(45, 106, 79, 0.15)'
                          : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    {/* Background glow on hover */}
                    <motion.div 
                      className={`absolute -top-20 -right-20 w-40 h-40 ${step.bgGlow} rounded-full blur-3xl`}
                      animate={{ 
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1.2 : 1
                      }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with floating animation */}
                      <motion.div 
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg`}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={isInView ? { 
                          scale: 1,
                          rotate: 0,
                        } : {}}
                        transition={{ 
                          delay: index * 0.15 + 0.4,
                          type: 'spring',
                          stiffness: 200,
                          damping: 15
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                        }}
                      >
                        <motion.div
                          animate={isCurrent ? { 
                            y: [0, -3, 0],
                          } : {}}
                          transition={{ 
                            duration: 1.5, 
                            repeat: isCurrent ? Infinity : 0,
                            ease: 'easeInOut'
                          }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                      </motion.div>
                      
                      {/* Title with reveal animation */}
                      <motion.h3 
                        className="text-lg sm:text-xl font-bold text-green-dark dark:text-white mb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.15 + 0.5 }}
                      >
                        {step.title}
                      </motion.h3>
                      
                      {/* Description */}
                      <motion.p 
                        className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: index * 0.15 + 0.6 }}
                      >
                        {step.description}
                      </motion.p>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
                      <motion.div 
                        className={`absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} opacity-10`}
                        animate={{ scale: isHovered ? 1.5 : 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </motion.div>

                  {/* Mobile step indicator */}
                  <div className="lg:hidden absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-green-primary to-green-teal text-white text-xs font-bold">
                    {step.number}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 lg:mt-24"
        >
          <div className="relative bg-gradient-to-br from-green-primary via-green-teal to-emerald-600 rounded-[2rem] p-8 sm:p-10 lg:p-14 text-white text-center overflow-hidden">
            {/* Animated background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                animate={{ 
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                animate={{ 
                  x: [0, -30, 0],
                  y: [0, 20, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            
            <div className="relative z-10">
              <motion.h3 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                جاهز للبدء؟
              </motion.h3>
              <motion.p 
                className="text-white/80 mb-8 max-w-md mx-auto text-base sm:text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                انضم لآلاف المستخدمين من الأفراد والشركات والجهات
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-white text-green-primary rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all text-base sm:text-lg"
              >
                ابدأ مجاناً
                <motion.span
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
