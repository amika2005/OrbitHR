"use client";

import { useState } from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  const [error, setError] = useState(false);

  return (
    <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Resume.pdf</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open(url, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const link = document.createElement("a");
              link.href = url;
              link.download = "resume.pdf";
              link.click();
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Embed */}
      <div className="flex-1 overflow-hidden">
        {!error ? (
          <iframe
            src={`${url}#toolbar=0&navpanes=0`}
            className="w-full h-full"
            title="Resume Preview"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Unable to preview PDF in browser
            </p>
            <Button
              size="sm"
              onClick={() => window.open(url, "_blank")}
              className="mt-2"
            >
              Open in New Tab
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
