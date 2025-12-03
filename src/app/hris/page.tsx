"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  FileText, 
  Calendar, 
  Award,
  TrendingUp,
  Shield,
  CheckCircle,
  ChevronDown
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Employee Profiles",
    description: "Comprehensive employee database with custom fields, documents, and organizational hierarchy."
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Centralized storage for contracts, policies, and employee documents with version control."
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description: "Automated leave tracking, approval workflows, and holiday calendar management."
  },
  {
    icon: Award,
    title: "Performance Management",
    description: "360° reviews, goal setting, and continuous feedback for employee development."
  },
  {
    icon: TrendingUp,
    title: "HR Analytics",
    description: "Real-time dashboards and reports for data-driven HR decision making."
  },
  {
    icon: Shield,
    title: "Compliance & Security",
    description: "GDPR compliant with role-based access control and audit trails."
  }
];

const benefits = [
  "Reduce HR admin time by 70%",
  "Improve employee satisfaction",
  "Ensure compliance automatically",
  "Scale with your business",
  "Mobile-first employee experience",
  "Seamless integrations"
];

export default function HRISPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      {/* SimpleBooks Style Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 bg-black rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">O</span>
            </motion.div>
            <span className="text-2xl font-bold text-black tracking-tight">
              OrbitHR
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-black">
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-black cursor-pointer py-2">
                Services <ChevronDown className="w-4 h-4" />
              </div>
              <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-lg rounded-lg overflow-hidden hidden group-hover:block">
                <Link href="/hris" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                  HRIS System
                </Link>
                <Link href="/ats" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                  ATS Platform
                </Link>
              </div>
            </div>

            {/* Tools Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-black cursor-pointer py-2">
                Tools <ChevronDown className="w-4 h-4" />
              </div>
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-lg rounded-lg overflow-hidden hidden group-hover:block">
                <Link href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                  Tax Calculator
                </Link>
                <Link href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                  ETF/EPF Calculator
                </Link>
                <Link href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                  Gratuity Calculator
                </Link>
                <Link href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                  Payslip Generator
                </Link>
              </div>
            </div>

            <Link href="/contact" className="text-sm font-semibold text-[#3ba156]">
              Contact Us
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hidden sm:block">
              <Button variant="outline" className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-6 font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-[#3ba156] hover:bg-[#3ba156] text-white font-bold px-6 rounded-full shadow-none relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#2e8044] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Complete HRIS for Modern Businesses
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your HR operations with our all-in-one Human Resource Information System. From onboarding to offboarding, manage your entire employee lifecycle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-lg">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful HRIS Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your workforce efficiently and effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your HR?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Start your 14-day free trial today. No credit card required.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 bg-white text-purple-600 hover:bg-gray-100 text-lg font-medium">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
