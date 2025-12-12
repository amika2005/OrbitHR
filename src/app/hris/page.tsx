"use client";

import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
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
  TrendingUp,
  MousePointer2
} from "lucide-react";
import { Header } from "@/components/landing/Header";
import { StickyFooter } from "@/components/landing/StickyFooter";
import { CTASection } from "@/components/landing/CTASection";
import { useRef, MouseEvent } from "react";

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

  const rotateXScroll = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateXMouse = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateYMouse = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
           style={{ x: useTransform(mouseX, [-0.5, 0.5], [20, -20]), y: useTransform(mouseY, [-0.5, 0.5], [20, -20]) }}
           className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-50/50 blur-[120px]" 
        />
        <motion.div 
           style={{ x: useTransform(mouseX, [-0.5, 0.5], [-20, 20]), y: useTransform(mouseY, [-0.5, 0.5], [-20, 20]) }}
           className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] [mask-image:linear-gradient(180deg,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 mb-8 shadow-sm backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-sm font-medium text-zinc-600">Unified Employee Database</span>
        </motion.div>

        <div className="mb-6 overflow-hidden">
           <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-tight"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
             {/* Staggered Text Reveal */}
             {["Modern", "HRIS", "for"].map((word, i) => (
                <span key={i} className="inline-block mr-4">
                  <motion.span 
                    className="inline-block"
                    variants={{
                       hidden: { y: "100%", opacity: 0, skewY: 10 },
                       visible: { y: 0, opacity: 1, skewY: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
             ))}
             <br className="hidden md:block" />
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 inline-block"
              variants={{
                hidden: { y: "100%", opacity: 0, scale: 0.9 },
                visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.3, ease: [0.2, 0.65, 0.3, 0.9] } }
              }}
            >
               People-First Companies
            </motion.span>
          </motion.h1>
        </div>

        <motion.p 
          className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Centralize your employee data, automate leave requests, and ensure compliance with a scalable, secure HRIS platform.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/dashboard">
            <Button size="lg" className="relative h-14 px-8 bg-zinc-900 text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
              <span className="relative flex items-center z-10">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </motion.div>

         {/* 3D Preview with Mouse Interaction */}
        <motion.div
           style={{ 
             rotateX: rotateXMouse, 
             rotateY: rotateYMouse,
             scale 
           }}
           initial={{ opacity: 0, y: 100, rotateX: 20 }}
           animate={{ opacity: 1, y: 0, rotateX: 0 }}
           transition={{ duration: 1.2, delay: 0.6, type: "spring" }}
           className="relative mx-auto max-w-5xl perspective-1000"
        >
            <motion.div
               style={{ opacity }} 
               className="relative rounded-2xl p-2 bg-gradient-to-b from-zinc-100 to-white border border-zinc-200 shadow-2xl ring-1 ring-zinc-900/5 transform-gpu"
            >
                <img
                    src="/assets/laptop-dashboard.png" 
                    alt="HRIS Dashboard"
                    className="w-full h-auto rounded-xl shadow-inner"
                />
                
                {/* Floating Elements specific to HRIS */}
                <motion.div
                    animate={{ 
                      y: [-15, 15, -15],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-8 top-1/4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-zinc-100 max-w-[200px] z-20"
                >
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                       <Calendar className="w-5 h-5" />
                     </div>
                     <div>
                       <span className="block text-sm font-bold text-zinc-900">Leave Approved</span>
                       <span className="text-xs text-green-600 font-medium">Automatic Approval</span>
                     </div>
                   </div>
                   <div className="text-xs text-zinc-500">Sarah's Annual Leave request for Dec 20-25</div>
                </motion.div>

                 <motion.div
                    animate={{ 
                      y: [15, -15, 15],
                      rotate: [0, -2, 2, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute -right-8 bottom-1/4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-zinc-100 z-20"
                >
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                       <Users className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-zinc-900">Onboarding Complete</div>
                       <div className="text-xs text-zinc-500">All documents signed</div>
                     </div>
                   </div>
                </motion.div>
            </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

function HRISFeatures() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <FeatureRow 
          index={0}
          title="Employee Management"
          headline="The Single Source of Truth"
          description="Keep all employee data in one secure place. From personal details to banking information and emergency contacts."
          items={["Digital employee files", "Custom fields", "Org chart visualization"]}
          icon={Users}
          color="purple"
        />
        <FeatureRow 
          index={1}
          title="Document Hub"
          headline="Paperless & Secure"
          description="Store, share, and sign documents electronically. Keep track of expired contracts, certifications, and policies."
          items={["E-signatures", "Document expiry alerts", "Version control"]}
          icon={FileText}
          color="blue"
        />
        <FeatureRow 
          index={2}
          title="Leave & Attendance"
          headline="Automated Time Tracking"
          description="Simplify leave management with custom policies, automated accruals, and one-click approvals."
          items={["Custom leave policies", "Calendar integration", "Absence reporting"]}
          icon={Calendar}
          color="indigo"
        />

      </div>
    </section>
  );
}

function FeatureRow({ index, title, headline, description, items, icon: Icon, color }: any) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

    // Spotlight Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <div 
        ref={ref}
        className={`flex flex-col lg:flex-row${index % 2 === 1 ? '-reverse' : ''} items-center gap-16 mb-40 last:mb-0`}
      >
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className={`inline-block px-4 py-1.5 mb-6 rounded-full bg-${color}-50 border border-${color}-100 cursor-default`}
            >
              <span className={`text-sm font-semibold text-${color}-600 tracking-wide uppercase`}>
                {title}
              </span>
            </motion.div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
              {headline}
            </h3>
            
            <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
              {description}
            </p>
            
            <ul className="space-y-4">
              {items.map((item: string, i: number) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  className="flex items-center gap-3 text-zinc-600"
                >
                   <div className={`w-6 h-6 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-600`}>
                     <Check className="w-3.5 h-3.5" />
                   </div>
                   {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="lg:w-1/2 perspective-1000">
           <motion.div
             style={{ y, opacity }}
             onMouseMove={handleMouseMove}
             className="group relative bg-zinc-50 rounded-2xl border border-zinc-100 p-8 shadow-2xl min-h-[400px] flex items-center justify-center overflow-hidden transform-gpu transition-transform duration-500 hover:rotate-2"
           >
              {/* Spotlight Gradient */}
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background: useMotionTemplate`
                    radial-gradient(
                      650px circle at ${mouseX}px ${mouseY}px,
                      rgba(139, 92, 246, 0.1),
                      transparent 80%
                    )
                  `,
                }}
              />
              
              {/* Abstract UI representation */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.2]" />
              <Icon className={`w-40 h-40 text-${color}-200/50 absolute z-0 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12`} />
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                 {/* 3D Floating Cards inside the container */}
                 <motion.div 
                    whileHover={{ z: 20, scale: 1.05 }}
                    className="bg-white p-6 rounded-xl shadow-xl w-3/4 max-w-sm border border-zinc-100/50 backdrop-blur-sm relative"
                 > 
                     {/* Glossy Effect */}
                     <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 to-transparent rounded-xl pointer-events-none" />
                     
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-4 w-1/3 bg-zinc-100 rounded animate-pulse" />
                        <div className={`h-2 w-2 rounded-full bg-${color}-500`} />
                    </div>
                    
                    <div className="space-y-3">
                       <div className="h-2 w-full bg-zinc-50 rounded" />
                       <div className="h-2 w-5/6 bg-zinc-50 rounded" />
                       <div className="h-2 w-4/6 bg-zinc-50 rounded" />
                    </div>
                    
                    <div className="mt-8 flex gap-3">
                      <motion.div 
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         className={`h-10 px-4 rounded-lg bg-gradient-to-r from-${color}-500 to-${color}-600 w-1/2 flex items-center justify-center cursor-pointer`} 
                      >
                          <MousePointer2 className="w-4 h-4 text-white" />
                      </motion.div>
                      <div className="h-10 w-10 rounded-lg bg-zinc-100" />
                    </div>
                 </motion.div>
              </div>
           </motion.div>
        </div>
      </div>
    );
}
