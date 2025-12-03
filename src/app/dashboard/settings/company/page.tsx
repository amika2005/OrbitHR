"use client";

import { useState, useEffect } from "react";
import { Building2, Mail, Phone, MapPin, Upload, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CompanySettings {
  companyName: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  taxId: string;
  registrationNumber: string;
}

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>({
    companyName: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    taxId: "",
    registrationNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("company_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Save to localStorage
    localStorage.setItem("company_settings", JSON.stringify(settings));
    
    // Also save to the salary slip settings for backward compatibility
    localStorage.setItem("orbithr_company_settings", JSON.stringify({
      logo: settings.logo,
      companyName: settings.companyName,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      taxId: settings.taxId,
    }));

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Company Settings
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your company information and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Company Information Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Company Information</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Basic information about your company
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              {settings.logo ? (
                <div className="relative">
                  <img
                    src={settings.logo}
                    alt="Company Logo"
                    className="w-24 h-24 object-contain border-2 border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 p-2"
                  />
                  <button
                    onClick={() => setSettings({ ...settings, logo: "" })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
                  <Upload className="w-8 h-8 text-zinc-400" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-block px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg cursor-pointer transition-colors text-sm font-medium"
                >
                  Upload Logo
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Max file size: 2MB. Supported formats: JPG, PNG, SVG
                </p>
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="Enter company name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="company@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address
            </label>
            <textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="Enter company address"
              rows={3}
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Website
            </label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="https://www.example.com"
            />
          </div>
        </div>
      </div>

      {/* Legal Information Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Legal Information</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tax and registration details
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Tax ID */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Tax ID / EIN
            </label>
            <input
              type="text"
              value={settings.taxId}
              onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="Enter tax ID or EIN"
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Business Registration Number
            </label>
            <input
              type="text"
              value={settings.registrationNumber}
              onChange={(e) => setSettings({ ...settings, registrationNumber: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              placeholder="Enter registration number"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
