"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  DollarSign, 
  Award, 
  Calendar, 
  TrendingUp 
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Users,
    title: "HRIS System",
    description: "Complete employee management with profiles, organizational charts, and role management. Everything you need in one place.",
    link: "/hris",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Target,
    title: "ATS Platform",
    description: "Streamline your recruitment with applicant tracking, interview scheduling, and candidate management tools.",
    link: "/ats",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: DollarSign,
    title: "Payroll Management",
    description: "Automated payroll processing with tax calculations, direct deposits, and compliance management built-in.",
    link: "#",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Award,
    title: "Performance Reviews",
    description: "360° feedback system with goal setting, performance metrics, and development plans for your team.",
    link: "#",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description: "Track and approve leave requests, manage holiday calendars, and monitor absence patterns effortlessly.",
    link: "#",
    gradient: "from-pink-500 to-pink-600"
  },
  {
    icon: TrendingUp,
    title: "Analytics & Reports",
    description: "Data-driven insights with HR dashboards, workforce analytics, and custom reports to make better decisions.",
    link: "#",
    gradient: "from-indigo-500 to-indigo-600"
  }
];

export function ServicesGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Workforce
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From hiring to retiring, OrbitHR provides all the tools you need to build and manage a world-class team.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={service.link}>
                <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl hover:border-transparent transition-all duration-300 h-full cursor-pointer">
                  {/* Gradient border on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`}></div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-6 flex items-center text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
