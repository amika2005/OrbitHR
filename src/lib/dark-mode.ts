/**
 * Dark Mode Utility Classes
 * Reusable Tailwind class combinations for consistent dark mode across the app
 * 
 * THEME: ZINC (Premium Dark Mode)
 * Matches the main dashboard color palette
 */

export const darkModeClasses = {
  // Backgrounds
  bg: {
    primary: "bg-white dark:bg-zinc-950",      // Main page background
    secondary: "bg-gray-50 dark:bg-zinc-950",   // Secondary background (sidebar, etc)
    tertiary: "bg-slate-50 dark:bg-zinc-950",   // Tertiary background
    card: "bg-white dark:bg-zinc-900",          // Card background
    hover: "hover:bg-gray-50 dark:hover:bg-zinc-800", // Hover state
    selected: "bg-slate-50 dark:bg-zinc-800",  // Selected state
    input: "bg-gray-50 dark:bg-zinc-900",       // Input background
    modal: "bg-white dark:bg-zinc-900",         // Modal background
  },

  // Borders
  border: {
    default: "border-gray-200 dark:border-zinc-800",
    light: "border-gray-100 dark:border-zinc-800",
    input: "border-gray-300 dark:border-zinc-700",
    hover: "hover:border-gray-400 dark:hover:border-zinc-600",
  },

  // Text
  text: {
    primary: "text-gray-900 dark:text-zinc-100",
    secondary: "text-gray-600 dark:text-zinc-400",
    tertiary: "text-gray-500 dark:text-zinc-500",
    muted: "text-gray-400 dark:text-zinc-600",
    placeholder: "placeholder:text-gray-400 dark:placeholder:text-zinc-600",
  },

  // Buttons
  button: {
    primary: "bg-gray-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200",
    secondary: "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-zinc-800",
    outline: "border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
  },

  // Inputs
  input: {
    base: "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500",
    focus: "focus:ring-gray-900 dark:focus:ring-zinc-400",
  },

  // Premium Scrollbar (as CSS string for <style> tag)
  scrollbarCSS: `
    .premium-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .premium-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .premium-scrollbar::-webkit-scrollbar-thumb {
      background: #e5e7eb;
      border-radius: 3px;
    }
    .premium-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #d1d5db;
    }
    /* Dark mode scrollbar */
    .dark .premium-scrollbar::-webkit-scrollbar-thumb {
      background: #3f3f46; /* zinc-700 */
    }
    .dark .premium-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #52525b; /* zinc-600 */
    }
    .premium-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #e5e7eb transparent;
    }
    .dark .premium-scrollbar {
      scrollbar-color: #3f3f46 transparent;
    }
  `,
};

/**
 * Common component class combinations
 */
export const componentClasses = {
  // Page container
  pageContainer: "h-[calc(100vh-7rem)] flex flex-col bg-slate-50 dark:bg-zinc-950",
  
  // Sidebar
  sidebar: "bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800",
  
  // Card with shadow
  card: "bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800",
  
  // Paper card (elevated)
  paperCard: "bg-white dark:bg-zinc-900 rounded-lg",
  
  // Table header
  tableHeader: "bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400",
  
  // Table row
  tableRow: "border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900/50",
  
  // Modal backdrop
  modalBackdrop: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm",
  
  // Modal content
  modalContent: "bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800",
};

/**
 * Helper function to combine dark mode classes
 */
export function dm(...classes: string[]): string {
  return classes.join(" ");
}
