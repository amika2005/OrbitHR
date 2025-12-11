"use client";

import { motion } from "framer-motion";

const companies = [
  "TechCorp", "InnovateLabs", "FutureScale", "GlobalHR", "DataFlow", "CloudNine"
];

export function TrustedBy() {
  return (
    <section className="py-10 bg-gray-50 border-y border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
          Trusted by modern teams worldwide
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...companies, ...companies, ...companies].map((company, i) => (
            <div key={i} className="mx-12 text-2xl font-bold text-zinc-300 hover:text-zinc-900 transition-colors cursor-default">
              {company}
            </div>
          ))}
        </div>
        
        <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap">
           {[...companies, ...companies, ...companies].map((company, i) => (
            <div key={i} className="mx-12 text-2xl font-bold text-zinc-300 hover:text-zinc-900 transition-colors cursor-default">
              {company}
            </div>
          ))}
        </div>

        {/* Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
      </div>
    </section>
  );
}
