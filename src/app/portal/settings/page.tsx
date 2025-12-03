import { Suspense } from "react";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, Lock, Globe } from "lucide-react";
import { PasswordChangeForm } from "@/components/portal/PasswordChangeForm";

async function SettingsContent() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-portal-light flex items-center justify-center">
                <Lock className="h-5 w-5 text-portal-primary" />
              </div>
              <CardTitle>Password & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-portal-light flex items-center justify-center">
                <Bell className="h-5 w-5 text-portal-primary" />
              </div>
              <CardTitle>Notification Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive email updates for leave approvals
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-portal-primary border-gray-300 rounded focus:ring-portal-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Payslip Notifications</p>
                <p className="text-sm text-gray-500">
                  Get notified when new payslips are available
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-portal-primary border-gray-300 rounded focus:ring-portal-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Leave Reminders</p>
                <p className="text-sm text-gray-500">
                  Reminders for upcoming leaves
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-portal-primary border-gray-300 rounded focus:ring-portal-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-portal-light flex items-center justify-center">
                <Globe className="h-5 w-5 text-portal-primary" />
              </div>
              <CardTitle>Language & Region</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-primary focus:border-transparent">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-primary focus:border-transparent">
                <option>UTC</option>
                <option>EST (UTC-5)</option>
                <option>PST (UTC-8)</option>
                <option>IST (UTC+5:30)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-portal-light flex items-center justify-center">
                <Settings className="h-5 w-5 text-portal-primary" />
              </div>
              <CardTitle>Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-primary focus:border-transparent">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar />
      <div className="flex-1 lg:ml-64">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-portal-primary"></div>
            </div>
          }
        >
          <SettingsContent />
        </Suspense>
      </div>
    </div>
  );
}
