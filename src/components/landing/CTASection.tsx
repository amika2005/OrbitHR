"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-32 bg-gray-50 relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-50/50 blur-[100px]" />
        <div className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[80%] rounded-full bg-purple-50/50 blur-[100px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 mb-8 leading-tight"
        >
          Ready to Transform Your <br/>
          <span className="text-zinc-900">
            HR Operations?
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Join hundreds of companies already using OrbitHR to streamline their workforce management and boost productivity.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/dashboard">
            <Button 
              size="lg"
              className="relative h-16 px-10 bg-zinc-900 text-white text-xl font-bold rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
              <span className="relative flex items-center z-10">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
          
        </motion.div>
      </div>
    </section>
  );
}
