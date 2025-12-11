"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Feature 1: Global Payroll */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          <div className="lg:w-1/2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100"
              >
                <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                  Global Payroll
                </span>
              </motion.div>
              
              <motion.h3 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight"
              >
                Pay your team in <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-900">
                  Any Currency, Anywhere.
                </span>
              </motion.h3>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-lg text-zinc-500 mb-8 leading-relaxed"
              >
                Handle multi-currency payroll compliant with local tax laws in over 50 countries. 
                OrbitHR automatically calculates deductions, taxes, and benefits.
              </motion.p>
              
              <motion.ul 
                className="space-y-4 mb-8"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                {["Automatic Tax Calculation", "Direct Deposit in LKR, USD, JPY", "Compliance Handling"].map((item, i) => (
                  <motion.li 
                    key={i} 
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    className="flex items-center gap-3 text-zinc-600"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 relative perspective-1000">
            <motion.div 
              style={{ y }} 
              className="relative z-10 transform-style-3d transition-transform duration-700 hover:rotate-y-12"
            >
               {/* Abstract representation of a payroll card with Glassmorphism */}
               <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl overflow-hidden">
                 {/* Animated Gradient Background */}
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-50" />
                 
                 <div className="relative z-20">
                   <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                         HR
                       </div>
                       <div>
                         <div className="h-4 w-32 bg-zinc-200 rounded-full mb-2 animate-pulse" />
                         <div className="h-3 w-20 bg-zinc-100 rounded-full" />
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="h-8 px-4 rounded-full bg-green-100 text-green-700 flex items-center text-sm font-bold">
                         Active
                       </div>
                     </div>
                   </div>

                   {/* Animated Progress Lines */}
                   <div className="space-y-6 mb-8">
                     {[85, 65, 90].map((width, i) => (
                       <div key={i} className="space-y-2">
                         <div className="flex justify-between text-xs text-zinc-400">
                           <span>Processing Batch #{202400 + i}</span>
                           <span>{width}%</span>
                         </div>
                         <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${width}%` }}
                             transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                             className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full relative"
                           >
                             <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                           </motion.div>
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   {/* Total Amount */}
                   <div className="flex items-end justify-between pt-6 border-t border-zinc-100">
                     <div className="text-zinc-500 text-sm">Total Disbursed</div>
                     <div className="text-3xl font-bold text-zinc-900 tracking-tight">$142,850.00</div>
                   </div>
                 </div>

                 {/* Floating Currency Orbits */}
                 <motion.div 
                    animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white shadow-lg border border-zinc-100 flex items-center justify-center text-xl z-30"
                 >
                   🇺🇸
                 </motion.div>
                 <motion.div 
                    animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-10 w-10 h-10 rounded-full bg-white shadow-lg border border-zinc-100 flex items-center justify-center text-lg z-30"
                 >
                   🇯🇵
                 </motion.div>
                 <motion.div 
                    animate={{ x: [-5, 5, -5], y: [-5, 5, -5] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 right-4 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-100 flex items-center justify-center text-sm z-30"
                 >
                   🇱🇰
                 </motion.div>
               </div>
               
               {/* Success Notification Pop-up */}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="absolute -right-8 top-12 bg-zinc-900 text-white p-4 rounded-xl shadow-2xl z-40 border border-zinc-700"
               >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Transfer Complete</div>
                      <div className="text-zinc-400 text-xs">Just now</div>
                    </div>
                  </div>
               </motion.div>
            </motion.div>
            
            {/* Enhanced Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl -z-10 rounded-full animate-pulse-slow" />
          </div>
        </div>

        {/* Feature 2: Japanese Culture Fit */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-red-50 border border-red-100">
                <span className="text-sm font-semibold text-red-600 tracking-wide uppercase">
                  AI Recruitment
                </span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                Hire for Skills & <br/>
                <span className="text-zinc-500">
                  Culture Fit.
                </span>
              </h3>
              
              <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
                Our specialized AI analyzes candidates not just for technical skills, but for compatibility 
                with Japanese work culture and your specific team dynamics.
              </p>
              
              <Button className="relative bg-zinc-900 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
                <span className="relative flex items-center z-10">
                  See How It Works
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </div>
          
           <div className="lg:w-1/2 relative perspective-1000">
             <motion.div 
                className="relative z-10 transform-style-3d transition-transform duration-700 hover:rotate-y-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
             >
                <div className="relative bg-white border border-zinc-200 rounded-2xl p-1 overflow-hidden shadow-2xl">
                   {/* Scanning Overlay Effect */}
                   <motion.div 
                     animate={{ top: ["-10%", "110%"] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-red-500/10 to-transparent z-30 pointer-events-none"
                   >
                     <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                   </motion.div>

                   <div className="bg-white rounded-xl p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-red-50/30 to-transparent pointer-events-none" />
                      
                      {/* Candidate Header */}
                      <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-full bg-zinc-100 border-2 border-white shadow-md overflow-hidden relative">
                             <img src="https://avatar.vercel.sh/jen?size=150" alt="Candidate" className="w-full h-full object-cover" />
                             {/* Online Status */}
                             <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="h-5 w-32 bg-zinc-800 rounded mb-2" />
                            <div className="h-3 w-20 bg-zinc-400 rounded" />
                          </div>
                        </div>
                        <motion.div 
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.5, bounce: 0.5 }}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-lg font-bold shadow-lg shadow-green-500/20"
                        >
                          98% Match
                        </motion.div>
                      </div>
                      
                      {/* Animated Skill Tags */}
                      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                        {["React", "TypeScript", "Node.js", "Japanese N2"].map((skill, i) => (
                           <motion.div
                             key={skill}
                             initial={{ opacity: 0, scale: 0.5 }}
                             whileInView={{ opacity: 1, scale: 1 }}
                             transition={{ delay: 0.8 + (i * 0.1) }}
                             className="px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-600"
                           >
                             {skill}
                           </motion.div>
                        ))}
                      </div>
                      
                      {/* Analysis Grid */}
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="bg-red-50/50 p-4 rounded-xl border border-red-100"
                        >
                          <div className="text-red-500 text-sm mb-1 font-medium">Culture Fit</div>
                          <div className="flex items-end gap-2">
                             <div className="text-3xl font-bold text-zinc-900">9.2</div>
                             <div className="text-zinc-400 text-xs mb-1">/ 10</div>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full h-1 bg-red-100 rounded-full mt-2 overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: "92%" }}
                               transition={{ duration: 1, delay: 1 }}
                               className="h-full bg-red-500 rounded-full"
                             />
                          </div>
                        </motion.div>
                        <motion.div 
                           whileHover={{ scale: 1.02 }}
                           className="bg-blue-50/50 p-4 rounded-xl border border-blue-100"
                        >
                          <div className="text-blue-500 text-sm mb-1 font-medium">Technical</div>
                          <div className="flex items-end gap-2">
                             <div className="text-3xl font-bold text-zinc-900">Snr</div>
                             <div className="text-zinc-400 text-xs mb-1">Level</div>
                          </div>
                          {/* Mini Progress Bar */}
                           <div className="w-full h-1 bg-blue-100 rounded-full mt-2 overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: "85%" }}
                               transition={{ duration: 1, delay: 1.2 }}
                               className="h-full bg-blue-500 rounded-full"
                             />
                          </div>
                        </motion.div>
                      </div>
                   </div>
                </div>
                
                {/* Floating Elements - "Verified" Badge */}
                <motion.div
                   animate={{ y: [0, -8, 0] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
                   className="absolute -right-6 top-20 bg-white p-3 rounded-lg shadow-xl border border-zinc-100 flex items-center gap-2 z-20"
                >
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-xs font-bold text-zinc-700">References Verified</span>
                </motion.div>
             </motion.div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
