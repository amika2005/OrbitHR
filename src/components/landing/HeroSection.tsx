"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white">
      
      {/* Light Theme Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-50/50 blur-[120px]" />
        
        {/* Grid Pattern - darker grid for light mode */}
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
          <span className="text-sm font-medium text-zinc-600">New: AI Recruitment Engine 2.0</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
           The Future of Work is <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900">
            Intelligent & Unified
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Manage your entire workforce from a single, beautiful dashboard. 
          Payroll, ATS, and HRIS — reimagined for the modern era.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/dashboard">
            <Button size="lg" className="relative h-14 px-8 bg-zinc-900 text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
              <span className="relative flex items-center z-10">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </motion.div>

        {/* 3D Dashboard Preview */}
        <motion.div
           style={{ rotateX, scale }}
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.4 }}
           className="relative mx-auto max-w-5xl perspective-1000"
        >
            <div className="relative rounded-2xl p-0 bg-transparent border-none shadow-none">
                {/* Laptop Mockup Image */}
                <img
                    src="/assets/laptop-dashboard.png"
                    alt="OrbitHR Dashboard on Laptop"
                    className="w-full h-auto drop-shadow-2xl"
                />
            </div>
            
            {/* Reflection Effect */}
            <div className="absolute -bottom-20 left-[5%] right-[5%] h-20 bg-gradient-to-b from-zinc-200/50 to-transparent blur-2xl opacity-50" />
        </motion.div>

      </div>
    </section>
  );
}
