"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { 
  Users, 
  Target, 
  DollarSign, 
  Award, 
  Calendar, 
  TrendingUp,
  Brain,
  Globe,
  LucideIcon
} from "lucide-react";
import { MouseEvent } from "react";

const bentoItems = [
  {
    title: "Global Payroll Engine",
    description: "Run payroll in 50+ countries with automated tax compliance and local currency support.",
    icon: Globe,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "AI Recruitment",
    description: "Smart candidate screening using advanced NLP.",
    icon: Brain,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "HRIS Core",
    description: "Centralized employee database and org charts.",
    icon: Users,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Performance Management",
    description: "360° reviews, OKRs, and continuous feedback loops.",
    icon: Target,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Smart Leave",
    description: "Automated leave tracking.",
    icon: Calendar,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time insights into metrics.",
    icon: TrendingUp,
    className: "md:col-span-1 md:row-span-1",
  }
];

function FeatureCard({ item, index }: { item: typeof bentoItems[0], index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 50,
        damping: 20
      }}
      onMouseMove={handleMouseMove}
      className={`group relative border border-zinc-200 bg-white overflow-hidden rounded-3xl ${item.className}`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Inner Content */}
      <div className="relative h-full p-8 flex flex-col justify-between z-10">
        <div>
          <motion.div 
            className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <item.icon className="w-6 h-6" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:translate-x-1 transition-transform duration-300">
            {item.title}
          </h3>
          
          <p className="text-zinc-500 group-hover:text-zinc-700 transition-colors duration-300 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Decorative Watermark Icon */}
        <div className="absolute -bottom-6 -right-6 opacity-0 group-hover:opacity-5 transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
          <item.icon className="w-32 h-32 text-zinc-900" />
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesGrid() {
  return (
    <section className="py-32 bg-gray-50 relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.7, ease: "easeOut" }}
           className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
            Everything You Need, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 animate-gradient-x">
              In One Place
            </span>
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            A complete suite of tools designed to help you manage your entire employee lifecycle from hiring to retiring.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
          {bentoItems.map((item, index) => (
            <FeatureCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
