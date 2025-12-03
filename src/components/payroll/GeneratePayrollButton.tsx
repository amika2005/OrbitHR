"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Loader2 } from "lucide-react";
import { batchGeneratePayroll } from "@/actions/payroll-actions";
import { toast } from "sonner";

export function GeneratePayrollButton() {
  const [loading, setLoading] = useState(false);

  const handleGeneratePayroll = async () => {
    setLoading(true);
    
    // Get current month and year
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed
    const year = now.getFullYear();

    try {
      const result = await batchGeneratePayroll(month, year);
      
      if (result.success) {
        toast.success(
          `Payroll generated successfully! Processed: ${result.processed}, Failed: ${result.failed}`
        );
      } else {
        toast.error(result.error || "Failed to generate payroll");
      }
    } catch (error) {
      toast.error("An error occurred while generating payroll");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGeneratePayroll}
      disabled={loading}
      className="bg-olive-600 hover:bg-olive-700 text-white flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <DollarSign className="w-4 h-4" />
          Generate Payroll
        </>
      )}
    </Button>
  );
}
