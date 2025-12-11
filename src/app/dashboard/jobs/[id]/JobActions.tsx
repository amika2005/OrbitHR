"use client";

import { Button } from "@/components/ui/button";
import { publishJobAction, closeJobAction } from "@/actions/job-actions";
import { useTransition } from "react";

interface JobActionsProps {
  jobId: string;
  status: string;
}

export function JobActions({ jobId, status }: JobActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handlePublish = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("jobId", jobId);
      await publishJobAction(formData);
    });
  };

  const handleClose = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("jobId", jobId);
      await closeJobAction(formData);
    });
  };

  return (
    <>
      {status === "DRAFT" && (
        <Button onClick={handlePublish} disabled={isPending}>
          {isPending ? "Publishing..." : "Publish Job"}
        </Button>
      )}
      {status === "OPEN" && (
        <Button variant="outline" onClick={handleClose} disabled={isPending}>
          {isPending ? "Closing..." : "Close Job"}
        </Button>
      )}
    </>
  );
}
