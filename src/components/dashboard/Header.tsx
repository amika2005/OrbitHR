"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Command,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { signOut } = useClerk();
  const { user } = useUser();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (systemTheme) {
      setTheme('dark');
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <Input
            type="text"
            placeholder="Search..."
            className="h-8 pl-9 pr-16 text-sm bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 ml-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {theme === 'light' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-zinc-900" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">New application received</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Sarah Chen applied for Senior Frontend Developer</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">2 minutes ago</p>
              </div>
              <div className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Interview scheduled</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Tomorrow at 2:00 PM with Emma Watson</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">1 hour ago</p>
              </div>
              <div className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Payroll processed</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Monthly payroll completed successfully</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">3 hours ago</p>
              </div>
            </div>
            <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
              <Button variant="ghost" size="sm" className="w-full h-8 text-xs font-medium">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 px-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-2"
            >
              <div className="h-6 w-6 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 text-xs font-medium">
                {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
              </div>
              <span className="hidden md:inline text-sm font-medium">
                {user?.firstName || "User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 text-xs font-medium">
                  {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="dark:bg-zinc-800" />
            <DropdownMenuItem className="dark:text-zinc-300 dark:focus:bg-zinc-800">
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="dark:text-zinc-300 dark:focus:bg-zinc-800">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-zinc-800" />
            <DropdownMenuItem 
              className="text-red-600 dark:text-red-400 dark:focus:bg-zinc-800"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}