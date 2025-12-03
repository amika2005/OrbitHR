"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CancelLeaveButtonProps {
  requestId: string;
}

export function CancelLeaveButton({ requestId }: CancelLeaveButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this leave request?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/leave/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Leave request cancelled successfully");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to cancel leave request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCancel}
      disabled={loading}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <X className="h-4 w-4 mr-1" />
      {loading ? "Cancelling..." : "Cancel"}
    </Button>
  );
}
