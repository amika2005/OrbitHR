"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCompanyEmailSettings, updateCompanyEmailSettings } from "@/actions/settings-actions";
import { Loader2, Save, Mail, Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface PayslipEmailSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PayslipEmailSettings({ isOpen, onClose }: PayslipEmailSettingsProps) {
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const result = await getCompanyEmailSettings();
      if (result.success && result.ccEmails) {
        setCcEmails(result.ccEmails.filter(e => e)); // Filter empty
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load email settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateCompanyEmailSettings(ccEmails);
      
      if (result.success) {
        toast.success("Email configuration saved successfully");
        onClose();
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const addEmail = () => {
    if (!newEmail) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("Invalid email format");
      return;
    }

    if (ccEmails.includes(newEmail)) {
      toast.error("Email already added");
      return;
    }

    if (ccEmails.length >= 5) {
      toast.error("Maximum 5 CC recipients allowed");
      return;
    }

    setCcEmails([...ccEmails, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (index: number) => {
    const newEmails = [...ccEmails];
    newEmails.splice(index, 1);
    setCcEmails(newEmails);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            Payslip Email Configuration
          </DialogTitle>
          <DialogDescription>
            Configure the CC recipients who will receive a copy of every automated payslip email.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add New Email */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address (e.g. finance@orbithr.com)"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                  className="flex-1"
                />
                <Button onClick={addEmail} variant="secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Email List */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Active Recipients ({ccEmails.length}/5)
                </Label>
                
                {ccEmails.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-500">No recipients configured</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {ccEmails.map((email, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800 group"
                      >
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {email}
                        </span>
                        <button
                          onClick={() => removeEmail(index)}
                          className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
