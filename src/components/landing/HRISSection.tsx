"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Users, 
  Clock, 
  DollarSign, 
  Calendar, 
  TrendingUp
} from "lucide-react";

const hrisServices = [
  {
    number: "00-1",
    title: "Employee Management",
    icon: Users,
    features: [
      "Employee Profiles",
      "Organizational Charts",
      "Role Management",
      "Team Directory",
      "Custom Fields",
      "Document Storage"
    ]
  },
  {
    number: "00-2",
    title: "Time & Attendance",
    icon: Clock,
    features: [
      "Time Tracking",
      "Shift Scheduling",
      "Leave Management",
      "Overtime Calculation",
      "Attendance Reports",
      "Clock In/Out"
    ]
  },
  {
    number: "00-3",
    title: "Payroll Processing",
    icon: DollarSign,
    features: [
      "Salary Calculation",
      "Tax Management",
      "Benefits Admin",
      "Direct Deposits",
      "Payslip Generation",
      "Compliance"
    ]
  },
  {
    number: "00-4",
    title: "Leave Management",
    icon: Calendar,
    features: [
      "Leave Requests",
      "Approval Workflows",
      "Leave Balance",
      "Holiday Calendar",
      "Absence Tracking",
      "Policy Management"
    ]
  },
  {
    number: "00-5",
    title: "Analytics & Insights",
    icon: TrendingUp,
    features: [
      "HR Dashboards",
      "Workforce Analytics",
      "Turnover Reports",
      "Cost Analysis",
      "Predictive Insights",
      "Custom Reports"
    ]
  }
];

export function HRISSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [typedText, setTypedText] = useState("");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const fullText = "Powered by AI";

  // Typing effect
  React.useEffect(() => {
    if (!isInView) return;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [isInView]);

  const splitTitle = (title: string) => {
    return title.split('').map((letter, index) => ({
      letter: letter === ' ' ? '\u00A0' : letter,
      index
    }));
  };

  return (
    <section ref={sectionRef} className="relative bg-white py-32 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-light text-gray-500 uppercase tracking-[0.3em] mb-6 block">
            Complete HRIS Platform
          </span>
          <motion.h2 
            className="text-6xl md:text-7xl font-light text-black mb-6 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Everything you need
          </motion.h2>
        </motion.div>
      </div>

      {/* Services Grid */}
      <div 
        className="servicesGrid relative"
        style={{
          display: 'grid',
          gridTemplateColumns: hoveredIndex === 0 ? '2fr 0.8fr 0.8fr 0.8fr 0.8fr' :
                               hoveredIndex === 1 ? '0.8fr 2fr 0.8fr 0.8fr 0.8fr' :
                               hoveredIndex === 2 ? '0.8fr 0.8fr 2fr 0.8fr 0.8fr' :
                               hoveredIndex === 3 ? '0.8fr 0.8fr 0.8fr 2fr 0.8fr' :
                               hoveredIndex === 4 ? '0.8fr 0.8fr 0.8fr 0.8fr 2fr' :
                               '1fr 1fr 1fr 1fr 1fr',
          transition: 'grid-template-columns 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          gap: '0',
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw'
        }}
      >
        {hrisServices.map((service, index) => (
          <motion.div
            key={service.number}
            className="serviceColumn relative bg-white border-r border-gray-200 last:border-r-0 px-8 py-16 cursor-pointer"
            style={{
              opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.7 : 1,
              filter: hoveredIndex !== null && hoveredIndex !== index ? 'blur(1px)' : 'none',
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              transform: hoveredIndex === index ? 'translateY(-8px)' : 'translateY(0)',
              boxShadow: hoveredIndex === index ? '0 25px 50px rgba(0, 0, 0, 0.15)' : 'none',
              zIndex: hoveredIndex === index ? 2 : 1,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Header */}
            <div className="mb-12">
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <span className="text-sm font-light text-gray-400 tracking-wider">
                  {service.number}
                </span>
                <motion.span 
                  className="text-gray-300"
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 2, delay: index * 0.2, repeat: Infinity, repeatDelay: 3 }}
                >
                  //
                </motion.span>
              </motion.div>
              
              {/* Animated Title */}
              <h3 className="text-3xl font-normal tracking-tight text-black uppercase mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.02em' }}>
                {splitTitle(service.title).map((item, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: -20, rotate: -7 }}
                    animate={hoveredIndex === index ? {
                      opacity: 1,
                      y: 0,
                      rotate: 0
                    } : isInView ? {
                      opacity: 1,
                      y: 0,
                      rotate: 0
                    } : {}}
                    transition={{
                      duration: 0.55,
                      delay: hoveredIndex === index ? i * 0.06 : (index * 0.1 + i * 0.03),
                      ease: [0.23, 1, 0.32, 1]
                    }}
                  >
                    {item.letter}
                  </motion.span>
                ))}
              </h3>
            </div>

            {/* Features List */}
            <ul className="space-y-4 mb-12">
              {service.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  className="text-gray-600 font-light flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={hoveredIndex === index ? {
                    opacity: 1,
                    x: 0
                  } : isInView ? {
                    opacity: 1,
                    x: 0
                  } : {}}
                  transition={{
                    duration: 0.4,
                    delay: hoveredIndex === index ? i * 0.05 : (index * 0.15 + i * 0.05),
                    ease: [0.23, 1, 0.32, 1]
                  }}
                >
                  <motion.span 
                    className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0"
                    animate={hoveredIndex === index ? {
                      scale: [1, 1.5, 1],
                    } : {}}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1
                    }}
                  />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* Image Card */}
            <motion.div
              className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
              style={{
                height: '200px',
                transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
            >
              {/* Glassmorphic Header */}
              <div 
                className="absolute top-0 left-0 right-0 px-6 py-4 bg-white/80 border-b border-gray-200"
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    animate={hoveredIndex === index ? {
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <service.icon className="w-8 h-8 text-black" />
                  </motion.div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    {service.number}
                  </span>
                </div>
              </div>

              {/* Diagonal Stripe Pattern */}
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                <div className="absolute inset-0" style={{
                  background: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)'
                }} />
              </div>

              {/* Blue Accent with pulse */}
              <motion.div 
                className="absolute bottom-4 left-4 w-12 h-12 bg-blue-500/20 rounded-full"
                animate={hoveredIndex === index ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Cascade Text */}
      <div className="relative mt-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative h-40 flex items-center justify-center">
            {/* Main Cascade Text */}
            <div className="relative">
              {"Great HRIS Starts With Great Technology".split('').map((letter, i) => {
                const isLeft = i < 20;
                return (
                  <motion.span
                    key={i}
                    className="inline-block text-6xl md:text-8xl font-light text-black"
                    initial={{
                      opacity: 0,
                      y: -120,
                      x: isLeft ? -40 : 40,
                      rotate: isLeft ? -7 : 7
                    }}
                    animate={isInView ? {
                      opacity: letter === ' ' ? 0 : 1,
                      y: 0,
                      x: 0,
                      rotate: 0
                    } : {}}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.03,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                );
              })}
            </div>

            {/* Side Vertical Text with Typing Effect */}
            <motion.div
              className="absolute right-0 top-0 text-sm text-gray-400 uppercase tracking-widest"
              style={{ writingMode: 'vertical-rl' }}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1200px) {
          .servicesGrid {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
          .serviceColumn:nth-child(4),
          .serviceColumn:nth-child(5) {
            display: none;
          }
        }
        
        @media (max-width: 900px) {
          .servicesGrid {
            grid-template-columns: 1fr 1fr !important;
          }
          .serviceColumn:nth-child(3),
          .serviceColumn:nth-child(4),
          .serviceColumn:nth-child(5) {
            display: none;
          }
        }
        
        @media (max-width: 600px) {
          .servicesGrid {
            grid-template-columns: 1fr !important;
          }
          .serviceColumn:nth-child(2),
          .serviceColumn:nth-child(3),
          .serviceColumn:nth-child(4),
          .serviceColumn:nth-child(5) {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
