"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  ArrowRight,
  ChevronDown
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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
      <section className="pt-32 pb-20 bg-[#0B132A] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-[#3ba156]/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Let's Start a <span className="text-[#3ba156]">Conversation</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-400"
            >
              Have questions about OrbitHR? We're here to help. Our team is ready to answer your questions and help you find the right solution.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-[#3ba156]/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#3ba156]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                    <p className="text-gray-400 text-sm mb-2">For general inquiries</p>
                    <a href="mailto:hello@orbithr.com" className="text-[#3ba156] hover:text-[#2e8044] font-medium">
                      hello@orbithr.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-[#3ba156]/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#3ba156]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Call Us</h3>
                    <p className="text-gray-400 text-sm mb-2">Mon-Fri from 8am to 5pm</p>
                    <a href="tel:+94112345678" className="text-[#3ba156] hover:text-[#2e8044] font-medium">
                      +94 11 234 5678
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-[#3ba156]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#3ba156]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Visit Us</h3>
                    <p className="text-gray-400 text-sm mb-2">Come say hello at our office</p>
                    <p className="text-gray-300">
                      123 Tech Park, Lotus Road<br />
                      Colombo 01, Sri Lanka
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white border-none shadow-2xl">
                <CardContent className="p-8 md:p-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <Input placeholder="John" className="h-12 bg-gray-50 border-gray-200 focus:border-[#3ba156] focus:ring-[#3ba156]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <Input placeholder="Doe" className="h-12 bg-gray-50 border-gray-200 focus:border-[#3ba156] focus:ring-[#3ba156]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input type="email" placeholder="john@company.com" className="h-12 bg-gray-50 border-gray-200 focus:border-[#3ba156] focus:ring-[#3ba156]" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <Input placeholder="How can we help?" className="h-12 bg-gray-50 border-gray-200 focus:border-[#3ba156] focus:ring-[#3ba156]" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <Textarea placeholder="Tell us about your project..." className="min-h-[150px] bg-gray-50 border-gray-200 focus:border-[#3ba156] focus:ring-[#3ba156]" />
                    </div>

                    <Button className="w-full h-14 bg-[#3ba156] hover:bg-[#2e8044] text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Can't find the answer you're looking for? Reach out to our customer support team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How does the free trial work?",
                a: "You get full access to all features for 14 days. No credit card required to start."
              },
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time from your dashboard."
              },
              {
                q: "Is my data secure?",
                a: "We use bank-level encryption and comply with all major data protection regulations."
              },
              {
                q: "Do you offer custom enterprise plans?",
                a: "Yes! Contact our sales team for a custom quote tailored to your organization's needs."
              }
            ].map((faq, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                    <MessageSquare className="w-5 h-5 text-[#3ba156] mt-1 flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 pl-7">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of companies that trust OrbitHR for their HR needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button 
                size="lg"
                className="h-14 px-8 bg-[#3ba156] hover:bg-[#2e8044] text-white text-lg font-bold rounded-lg shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg"
                variant="outline"
                className="h-14 px-8 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-lg font-medium rounded-lg"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
