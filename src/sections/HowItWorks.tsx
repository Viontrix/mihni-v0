"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, FileText, Share2, BarChart3, Check, ArrowLeft, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'أنشئ حسابك',
    description: 'سجل بخطوات بسيطة واختر الباقة المناسبة لاحتياجاتك',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    number: '02',
    icon: FileText,
    title: 'اختر قالب أو أداة',
    description: 'اختر من مكتبة القوالب والأدوات الذكية الاحترافية',
    color: 'from-green-primary to-green-teal',
  },
  {
    number: '03',
    icon: Share2,
    title: 'خصص وأنشئ',
    description: 'خصص القالب أو استخدم الأداة الذكية لإنشاء محتواك',
    color: 'from-purple-500 to-pink-400',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'صدّر وشارك',
    description: 'صدّر بصيغ متعددة وشارك مع فريقك أو عملائك',
    color: 'from-orange-500 to-amber-400',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progress through steps
  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#0D1B1A] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            رحلتك تبدأ من هنا
          </motion.span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-dark dark:text-white mb-3">
            أربع خطوات
            <span className="bg-gradient-to-r from-green-primary to-green-teal bg-clip-text text-transparent"> للبدء</span>
          </h2>
          
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            رحلة بسيطة لإنجاز عملك باحترافية
          </p>
        </motion.div>

        {/* Steps Container */}
        <div ref={ref} className="relative">
          {/* Connection line - Desktop horizontal */}
          <div className="hidden lg:block absolute top-16 left-[6%] right-[6%] h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-primary via-green-teal to-green-light rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: isInView ? `${(activeStep / (steps.length - 1)) * 100}%` : '0%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              const isCurrent = index === activeStep;
              
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { 
                    opacity: 1,
                    y: 0,
                  } : {}}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.5,
                  }}
                  className="relative flex flex-col h-full"
                >
                  {/* Step Number - Top positioned */}
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { 
                      opacity: 1,
                      x: 0
                    } : {}}
                    transition={{ 
                      delay: index * 0.15 + 0.1,
                      duration: 0.4,
                    }}
                  >
                    <span className="text-xs font-bold tracking-wider text-green-primary dark:text-green-light/80 uppercase">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Card */}
                  <motion.div 
                    className="flex-1 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1B2D2B]/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                    whileHover={{ 
                      y: -6,
                      boxShadow: isActive 
                        ? '0 20px 25px -5px rgba(45, 106, 79, 0.1)' 
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    animate={{
                      borderColor: isActive ? 'rgb(45, 106, 79)' : 'rgb(229, 231, 235)',
                      backgroundColor: isActive 
                        ? 'rgb(255, 255, 255)' 
                        : 'rgba(255, 255, 255, 0.5)',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Icon with animation */}
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-md`}
                      initial={{ scale: 0 }}
                      animate={isInView ? { 
                        scale: 1,
                      } : {}}
                      transition={{ 
                        delay: index * 0.15 + 0.15,
                        type: 'spring',
                        stiffness: 150,
                        damping: 15
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: isCurrent ? 10 : 0
                      }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-green-dark dark:text-white mb-2">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Desktop: Connector circle at top */}
                  <motion.div 
                    className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-8 h-8 rounded-full border-4 border-white dark:border-[#0D1B1A] flex items-center justify-center flex-shrink-0 z-20"
                    animate={{
                      backgroundColor: isActive ? 'rgb(45, 106, 79)' : 'rgb(229, 231, 235)',
                      boxShadow: isActive ? '0 0 0 4px rgba(45, 106, 79, 0.1)' : 'none'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 lg:mt-16"
        >
          <div className="bg-gradient-to-r from-green-primary to-green-teal rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                جاهز للبدء؟
              </h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto text-sm sm:text-base">
                انضم لآلاف المستخدمين من الأفراد والشركات والجهات
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-green-primary rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                ابدأ مجاناً
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
