"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowRight, 
  Target, 
  Users, 
  Zap,
  Check
} from "lucide-react";
import { Header } from "@/components/landing/Header";
import { StickyFooter } from "@/components/landing/StickyFooter";
import { CTASection } from "@/components/landing/CTASection";
import { useRef } from "react";

export default function ATSPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 overflow-x-hidden">
       {/* Content Wrapper for Sticky Footer Effect */}
       <div className="relative z-10 bg-white shadow-2xl rounded-b-3xl mb-0 lg:mb-[500px]">
          <Header />
          <ATSHero />
          <ATSFeatures />
          <CTASection />
       </div>
       <StickyFooter />
    </div>
  );
}

function ATSHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Exact animations from Landing Page HeroSection
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white">
      
      {/* Light Theme Background Effects (Same as Landing Page) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-50/50 blur-[120px]" />
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium text-zinc-600">Smart Recruitment Pipeline</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
           Hire Top Talent <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Faster & Smarter
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Automate your hiring workflow, track candidates seamlessly, and use AI to identify the perfect fit for your team.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/dashboard">
            <Button size="lg" className="relative h-14 px-8 bg-zinc-900 text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
              <span className="relative flex items-center z-10">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </motion.div>

        {/* 3D Dashboard Preview (Scroll based, no mouse) */}
        <motion.div
           style={{ rotateX, scale, opacity }}
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.4 }}
           className="relative mx-auto max-w-5xl perspective-1000"
        >
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-zinc-100 to-white border border-zinc-200 shadow-2xl ring-1 ring-zinc-900/5">
                <img
                    src="/assets/dashboard-light.png" 
                    alt="ATS Dashboard"
                    className="w-full h-auto rounded-xl shadow-inner"
                />
                
                {/* Floating Elements (Simple floating, no mouse interaction) */}
                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 top-1/4 bg-white p-4 rounded-xl shadow-xl border border-zinc-100 max-w-[200px]"
                >
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                       <Target className="w-4 h-4" />
                     </div>
                     <span className="text-sm font-bold text-zinc-900">New Candidate</span>
                   </div>
                   <div className="text-xs text-zinc-500">Top match for Design Role found via LinkedIn</div>
                </motion.div>

                 <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-8 bottom-1/4 bg-white p-4 rounded-xl shadow-xl border border-zinc-100"
                >
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                       <Check className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-zinc-900">Offer Accepted</div>
                       <div className="text-xs text-zinc-500">Frontend Dev position</div>
                     </div>
                   </div>
                </motion.div>
            </div>
        </motion.div>

      </div>
    </section>
  );
}

function ATSFeatures() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FeatureRow 
          index={0}
          title="Job Distribution"
          headline="Post Everywhere in One Click"
          description="Create your job post once and distribute it to LinkedIn, Indeed, Glassdoor, and 50+ other job boards instantly."
          items={["Multi-channel posting", "Social media integration", "Custom careers page"]}
          icon={Target}
          color="blue"
        />
        <FeatureRow 
          index={1}
          title="Candidate Management"
          headline="Visual Pipeline for your Team"
          description="Drag-and-drop candidates through your custom hiring pipeline. Collaborate with your team with comments and scorecards."
          items={["Kanban board view", "Automated stage actions", "Team collaboration tools"]}
          icon={Users}
          color="purple"
        />
        <FeatureRow 
          index={2}
          title="AI Screening"
          headline="Find the Best Match Instantly"
          description="Our AI analyzes resumes against job descriptions to score and rank candidates, highlighting top talent automatically."
          items={["Resume parsing", "Match scoring", "Cultural fit analysis"]}
          icon={Zap}
          color="indigo"
        />
      </div>
    </section>
  );
}

function FeatureRow({ index, title, headline, description, items, icon: Icon, color }: any) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]); // Parallax Y for image

    return (
      <div 
        ref={ref}
        className={`flex flex-col lg:flex-row${index % 2 === 1 ? '-reverse' : ''} items-center gap-16 mb-32 last:mb-0`}
      >
        <div className="lg:w-1/2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            <motion.div 
               variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
               className={`inline-block px-4 py-1.5 mb-6 rounded-full bg-${color}-50 border border-${color}-100`}
            >
              <span className={`text-sm font-semibold text-${color}-600 tracking-wide uppercase`}>
                {title}
              </span>
            </motion.div>
            
            <motion.h3 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight"
            >
              {headline}
            </motion.h3>
            
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-lg text-zinc-500 mb-8 leading-relaxed"
            >
              {description}
            </motion.p>
            
            <motion.ul 
              className="space-y-4"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              {items.map((item: string, i: number) => (
                <motion.li 
                  key={i} 
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  className="flex items-center gap-3 text-zinc-600"
                >
                   <div className={`w-6 h-6 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-600`}>
                     <Check className="w-3.5 h-3.5" />
                   </div>
                   {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
        
        <div className="lg:w-1/2 perspective-1000">
           <motion.div
             style={{ y }}
             className="bg-zinc-50 rounded-2xl border border-zinc-100 p-8 shadow-lg min-h-[400px] flex items-center justify-center relative overflow-hidden transition-transform duration-700 hover:rotate-y-6"
           >
              {/* Feature Image with Landing Page style simplicity */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
              <Icon className={`w-32 h-32 text-${color}-100 relative z-10 opacity-50`} />
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                 <div className="bg-white p-6 rounded-xl shadow-xl w-3/4 max-w-sm border border-zinc-100/50">
                    <div className="h-4 w-1/3 bg-zinc-100 rounded mb-4" />
                    <div className="space-y-3">
                       <div className="h-2 w-full bg-zinc-50 rounded" />
                       <div className="h-2 w-5/6 bg-zinc-50 rounded" />
                       <div className="h-2 w-4/6 bg-zinc-50 rounded" />
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    );
}
