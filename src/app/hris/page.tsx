"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  FileText, 
  Calendar, 
  Award,
  Shield,
  Check,
  TrendingUp
} from "lucide-react";
import { Header } from "@/components/landing/Header";
import { StickyFooter } from "@/components/landing/StickyFooter";
import { CTASection } from "@/components/landing/CTASection";
import { useRef } from "react";

export default function HRISPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 overflow-x-hidden">
       {/* Content Wrapper for Sticky Footer Effect */}
       <div className="relative z-10 bg-white shadow-2xl rounded-b-3xl mb-0 lg:mb-[500px]">
          <Header />
          <HRISHero />
          <HRISFeatures />
          <CTASection />
       </div>
       <StickyFooter />
    </div>
  );
}

function HRISHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-50/50 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] [mask-image:linear-gradient(180deg,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-sm font-medium text-zinc-600">Unified Employee Database</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
           Modern HRIS for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
             People-First Companies
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Centralize your employee data, automate leave requests, and ensure compliance with a scalable, secure HRIS platform.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/dashboard">
            <Button size="lg" className="relative h-14 px-8 bg-zinc-900 text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
              <span className="relative flex items-center z-10">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </motion.div>

        {/* 3D Preview */}
        <motion.div
           style={{ rotateX, scale }}
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.4 }}
           className="relative mx-auto max-w-5xl perspective-1000"
        >
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-zinc-100 to-white border border-zinc-200 shadow-2xl ring-1 ring-zinc-900/5">
                <img
                    src="/assets/laptop-dashboard.png" 
                    alt="HRIS Dashboard"
                    className="w-full h-auto rounded-xl shadow-inner"
                />
                
                {/* Floating Elements specific to HRIS */}
                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-8 top-1/4 bg-white p-4 rounded-xl shadow-xl border border-zinc-100 max-w-[200px]"
                >
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                       <Calendar className="w-4 h-4" />
                     </div>
                     <span className="text-sm font-bold text-zinc-900">Leave Approved</span>
                   </div>
                   <div className="text-xs text-zinc-500">Sarah's Annual Leave</div>
                </motion.div>

                 <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-xl shadow-xl border border-zinc-100"
                >
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                       <Users className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-zinc-900">Employee Onboarded</div>
                       <div className="text-xs text-zinc-500">All documents signed</div>
                     </div>
                   </div>
                </motion.div>
            </div>
        </motion.div>

      </div>
    </section>
  );
}

function HRISFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const features = [
    {
      title: "Employee Management",
      headline: "The Single Source of Truth",
      description: "Keep all employee data in one secure place. From personal details to banking information and emergency contacts.",
      items: ["Digital employee files", "Custom fields", "Org chart visualization"],
      icon: Users,
      color: "purple"
    },
    {
      title: "Document Hub",
      headline: "Paperless & Secure",
      description: "Store, share, and sign documents electronically. Keep track of expired contracts, certifications, and policies.",
      items: ["E-signatures", "Document expiry alerts", "Version control"],
      icon: FileText,
      color: "blue"
    },
    {
      title: "Leave & Attendance",
      headline: "Automated Time Tracking",
      description: "Simplify leave management with custom policies, automated accruals, and one-click approvals.",
      items: ["Custom leave policies", "Calendar integration", "Absence reporting"],
      icon: Calendar,
      color: "indigo"
    }
  ];

  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {features.map((feature, index) => (
           <div key={index} className={`flex flex-col lg:flex-row${index % 2 === 1 ? '-reverse' : ''} items-center gap-16 mb-32`}>
             <div className="lg:w-1/2">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6 }}
               >
                 <div className={`inline-block px-4 py-1.5 mb-6 rounded-full bg-${feature.color}-50 border border-${feature.color}-100`}>
                   <span className={`text-sm font-semibold text-${feature.color}-600 tracking-wide uppercase`}>
                     {feature.title}
                   </span>
                 </div>
                 
                 <h3 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                   {feature.headline}
                 </h3>
                 
                 <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
                   {feature.description}
                 </p>
                 
                 <ul className="space-y-4">
                   {feature.items.map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-zinc-600">
                        <div className={`w-6 h-6 rounded-full bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-600`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        {item}
                     </li>
                   ))}
                 </ul>
               </motion.div>
             </div>
             
             {/* Visual representation placeholder */}
             <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-zinc-50 rounded-2xl border border-zinc-100 p-8 shadow-lg min-h-[400px] flex items-center justify-center relative overflow-hidden"
                >
                   {/* Abstract UI representation */}
                   <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
                   <feature.icon className={`w-32 h-32 text-${feature.color}-100 relative z-10 opacity-50`} />
                   
                   <div className="absolute inset-0 flex items-center justify-center z-20">
                      {/* Simple UI Mockup Card */}
                      <div className="bg-white p-6 rounded-xl shadow-xl w-3/4 max-w-sm">
                         <div className="h-4 w-1/3 bg-zinc-100 rounded mb-4" />
                         <div className="space-y-3">
                            <div className="h-2 w-full bg-zinc-50 rounded" />
                            <div className="h-2 w-5/6 bg-zinc-50 rounded" />
                            <div className="h-2 w-4/6 bg-zinc-50 rounded" />
                         </div>
                         <div className="mt-6 flex gap-2">
                           <div className={`h-8 w-20 rounded-lg bg-${feature.color}-500`} />
                           <div className="h-8 w-8 rounded-lg bg-zinc-100" />
                         </div>
                      </div>
                   </div>
                </motion.div>
             </div>
           </div>
        ))}

      </div>
    </section>
  );
}
