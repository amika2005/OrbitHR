"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Home,
  User,
  Calendar,
  FileText,
  FolderOpen,
  Clock,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "./NotificationBell";

const navigation = [
  {
    name: "Dashboard",
    href: "/portal/dashboard",
    icon: Home,
  },
  {
    name: "My Profile",
    href: "/portal/profile",
    icon: User,
  },
  {
    name: "Leave Requests",
    href: "/portal/leave",
    icon: Calendar,
  },
  {
    name: "My Payslips",
    href: "/portal/payslips",
    icon: FileText,
  },
  {
    name: "Documents",
    href: "/portal/documents",
    icon: FolderOpen,
  },
  {
    name: "Time Tracking",
    href: "/portal/time",
    icon: Clock,
  },
  {
    name: "Settings",
    href: "/portal/settings",
    icon: Settings,
  },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-portal-primary">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-portal-primary font-bold text-lg">O</span>
            </div>
            <span className="text-lg font-bold text-white">OrbitHR</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-portal-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-portal-primary text-white font-semibold">
                  {user?.firstName?.[0] || "E"}
                  {user?.lastName?.[0] || "E"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || "Employee"}
                </p>
                <p className="text-xs text-gray-600 truncate">Employee Portal</p>
              </div>
            </div>
            <NotificationBell />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-portal-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-portal-light hover:text-portal-primary"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 mr-3",
                    isActive ? "text-white" : "text-gray-500"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 text-sm font-medium text-gray-700 hover:bg-portal-light hover:text-portal-primary"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
