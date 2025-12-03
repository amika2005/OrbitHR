"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Gmail", url: "/assets/Gmail_Logo.svg" },
  { name: "Google Calendar", url: "/assets/Google_Calendar_Logo.svg" },
  { name: "Google Meet", url: "/assets/Google_Meet_Logo.svg" },
  { name: "Google Sheets", url: "/assets/Google_Sheets_Logo.svg" },
  { name: "Excel", url: "/assets/Microsoft_Office_Excel_Logo.svg" },
  { name: "Outlook", url: "/assets/Microsoft_Office_Outlook_Logo.svg" },
  { name: "Teams", url: "/assets/Microsoft_Office_Teams_Logo.svg" },
];

export function TechStackSlider() {
  return (
    <section className="py-32 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Integrate your favourite tools
        </h2>
      </div>
      
      <div className="relative flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-20 items-center whitespace-nowrap px-8"
        >
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.15, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-16 h-16 relative flex items-center justify-center hover:drop-shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="w-full h-full object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
