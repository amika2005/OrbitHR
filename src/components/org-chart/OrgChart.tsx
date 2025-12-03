"use client";

import { useState } from "react";
import { OrgNode, BulkUploadData } from "@/types/org-chart-types";
import { buildTreeFromFlatData } from "@/lib/org-chart-utils";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { BulkUploadDialog } from "./BulkUploadDialog";
import OrgChartFlow from "./OrgChartFlow";

interface OrgChartProps {
  initialData?: OrgNode;
}

export function OrgChart({ initialData }: OrgChartProps) {
  const [orgData, setOrgData] = useState<OrgNode | null>(initialData || null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleBulkUpload = (data: BulkUploadData[]) => {
    const tree = buildTreeFromFlatData(data);
    if (tree) {
      setOrgData(tree);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Upload Button - Positioned over the canvas */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          size="sm"
          onClick={() => setUploadDialogOpen(true)}
          className="shadow-lg bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
        >
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          Bulk Upload
        </Button>
      </div>

      {/* Chart Container */}
      {orgData ? (
        <OrgChartFlow orgData={orgData} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Upload className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Organization Chart Data
          </h3>
          <p className="text-sm text-gray-500 mb-8 max-w-md text-center">
            Upload an Excel or CSV file with employee data to generate your interactive organization chart
          </p>
          <Button onClick={() => setUploadDialogOpen(true)} size="lg" className="shadow-lg">
            <Upload className="h-5 w-5 mr-2" />
            Upload Employee Data
          </Button>
        </div>
      )}

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onDataUploaded={handleBulkUpload}
      />
    </div>
  );
}
