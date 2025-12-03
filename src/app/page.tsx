"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesGrid } from "@/components/landing/ServicesGrid";
import { TechStackSlider } from "@/components/landing/TechStackSlider";
import { StickyFooter } from "@/components/landing/StickyFooter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main content wrapper */}
      <div className="flex-1 relative z-10 bg-white">
        
        {/* Simplified Navigation */}
        {/* SimpleBooks Style Navigation */}
        {/* SimpleBooks Style Navigation */}
        <Header />

        <HeroSection />
        <TechStackSlider />
        <ServicesGrid />
        
        {/* CTA Section */}
        <section className="py-32 bg-[#0B132A] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] rounded-full bg-purple-600/10 blur-[100px]" />
            <div className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[100px]" />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
            >
              Ready to Transform Your <br/>
              <span className="text-[#3ba156]">HR Operations?</span>
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
                  className="h-16 px-10 bg-[#3ba156] hover:bg-[#3ba156] text-white text-xl font-bold rounded-xl shadow-2xl hover:shadow-green-500/20 transition-all duration-300 border-2 border-transparent hover:border-[#ff7308] relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-[#ff7308] transform -translate-y-full transition-transform duration-500 group-hover:translate-y-0"></span>
                  <span className="relative z-10 flex items-center">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </span>
                </Button>
              </Link>
              
            </motion.div>
          </div>
        </section>
      </div>

      <StickyFooter />
    </div>
  );
}
