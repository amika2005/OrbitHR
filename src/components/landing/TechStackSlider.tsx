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
    <section className="py-32 bg-gray-50 border-y border-zinc-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">
          Integrate your favourite tools
        </h2>
        <p className="text-zinc-500">
          Seamlessly connect with the apps you use every day.
        </p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

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
              className="flex-shrink-0 w-24 h-24 relative flex items-center justify-center hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 cursor-pointer bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="w-full h-full object-contain filter brightness-100" // Keep original colors as they usually look okay on dark, or distinct
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
