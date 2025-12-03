"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function StickyFooter() {
  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative md:sticky md:bottom-0 w-full bg-white text-gray-900 border-t border-gray-200 z-0 py-12 md:py-16"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* About Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-black">About OrbitHR</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Complete HRIS and ATS platform built for modern businesses. Streamline your HR operations from recruitment to retirement.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-gray-100 hover:bg-[#3ba156] rounded-none flex items-center justify-center transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-[#3ba156] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Icon className="w-5 h-5 relative z-10 text-gray-700 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-black">Products</h4>
            <ul className="space-y-3">
              {[
                "HRIS System",
                "ATS Platform",
                "Payroll Management",
                "Performance Reviews",
                "Leave Management",
                "Analytics",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-[#3ba156] transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-black">Resources</h4>
            <ul className="space-y-3">
              {[
                "Blog",
                "Documentation",
                "API Reference",
                "Help Center",
                "Case Studies",
                "Webinars",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-[#3ba156] transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-black">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#3ba156] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href="mailto:hello@orbithr.com" className="text-gray-900 hover:text-[#3ba156] transition-colors">
                    hello@orbithr.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#3ba156] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href="tel:+1234567890" className="text-gray-900 hover:text-[#3ba156] transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#3ba156] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900">
                    123 Business St, Suite 100<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2025 OrbitHR Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Cookie Policy",
            ].map((item) => (
              <Link key={item} href="#" className="text-gray-600 hover:text-[#3ba156] transition-colors text-sm">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
