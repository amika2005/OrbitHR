"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { 
    name: "Services", 
    href: "#",
    submenu: [
      { name: "HRIS System", href: "/hris" },
      { name: "ATS Platform", href: "/ats" }
    ]
  },
  { 
    name: "Tools", 
    href: "#",
    submenu: [
      { name: "Tax Calculator", href: "#" },
      { name: "ETF/EPF Calculator", href: "#" },
      { name: "Gratuity Calculator", href: "#" },
      { name: "Payslip Generator", href: "#" }
    ]
  },
  { name: "Contact Us", href: "/contact" }
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { scrollY } = useScroll();
  
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.95)"]
  );
  
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0, 0, 0, 0)", "0 1px 3px rgba(0, 0, 0, 0.1)"]
  );

  return (
    <motion.nav
      style={{
        backgroundColor: headerBackground,
        boxShadow: headerShadow,
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.submenu ? (
                  <>
                    <motion.button
                      className="px-2 py-2 text-sm font-semibold text-gray-800 hover:text-black transition-colors flex items-center gap-1 relative group"
                      whileHover={{ y: -1 }}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
                    </motion.button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden"
                      >
                        <div className="py-2">
                          {item.submenu.map((subItem, index) => (
                            <motion.div
                              key={subItem.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <Link
                                href={subItem.href}
                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={item.href}
                    className="text-sm font-semibold text-gray-800 hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hidden sm:block">
              <Button variant="outline" className="relative overflow-hidden rounded-full border-2 border-transparent text-gray-700 hover:text-white group transition-all duration-300">
                <span className="absolute inset-0 bg-[#ff7308] transform -translate-y-full transition-transform duration-500 group-hover:translate-y-0"></span>
                <span className="relative z-10 px-6">Sign In</span>
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button className="relative overflow-hidden bg-[#3ba156] hover:bg-[#3ba156] text-white font-bold px-6 rounded-full shadow-none border-2 border-transparent hover:border-[#ff7308] transition-all duration-300 group">
                <span className="absolute inset-0 bg-[#ff7308] transform translate-y-full transition-transform duration-500 group-hover:translate-y-0"></span>
                <span className="relative z-10">Get Started</span>
              </Button>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-gray-200 bg-white"
        >
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                      className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-800 hover:text-black transition-colors"
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pl-4 space-y-2 mt-2"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block py-2 text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={item.href}
                    className="block py-2 text-sm font-semibold text-gray-800 hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <Link href="/sign-in" className="block py-2 text-sm font-semibold text-gray-800 hover:text-black transition-colors">
              Sign In
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
