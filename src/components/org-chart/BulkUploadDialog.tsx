"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { BulkUploadData } from "@/types/org-chart-types";
import { buildTreeFromFlatData, validateHierarchy } from "@/lib/org-chart-utils";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataUploaded: (data: BulkUploadData[]) => void;
}

export function BulkUploadDialog({ open, onOpenChange, onDataUploaded }: BulkUploadDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setValidationError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      // Transform to BulkUploadData format
      const uploadData: BulkUploadData[] = jsonData.map((row) => ({
        name: row.Name || row.name || "",
        role: row.Role || row.role || row.Position || row.position || "",
        email: row.Email || row.email || "",
        managerEmail: row["Manager Email"] || row.managerEmail || row["Manager"] || undefined,
        department: row.Department || row.department || undefined,
        avatar: row.Avatar || row.avatar || undefined,
      }));

      // Validate data
      if (uploadData.length === 0) {
        setValidationError("No data found in the file");
        setUploading(false);
        return;
      }

      // Check required fields
      const missingFields = uploadData.filter((emp) => !emp.name || !emp.email || !emp.role);
      if (missingFields.length > 0) {
        setValidationError(`${missingFields.length} row(s) missing required fields (Name, Email, Role)`);
        setUploading(false);
        return;
      }

      // Validate hierarchy
      const validation = validateHierarchy(uploadData);
      if (!validation.valid) {
        setValidationError(validation.error || "Invalid hierarchy");
        setUploading(false);
        return;
      }

      // Success!
      onDataUploaded(uploadData);
      toast.success(`Successfully uploaded ${uploadData.length} employees`);
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
      setValidationError("Failed to parse file. Please ensure it's a valid Excel or CSV file.");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        Name: "John Doe",
        Role: "CEO",
        Email: "john@company.com",
        "Manager Email": "",
        Department: "Executive",
        Avatar: "",
      },
      {
        Name: "Jane Smith",
        Role: "CTO",
        Email: "jane@company.com",
        "Manager Email": "john@company.com",
        Department: "Technology",
        Avatar: "",
      },
      {
        Name: "Bob Johnson",
        Role: "Engineering Manager",
        Email: "bob@company.com",
        "Manager Email": "jane@company.com",
        Department: "Engineering",
        Avatar: "",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Org Chart Template");
    XLSX.writeFile(wb, "org_chart_template.xlsx");
    toast.success("Template downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Organization Chart</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file with employee data to automatically generate the org chart
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Required Columns
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>Name</strong> - Employee full name</li>
              <li>• <strong>Role</strong> - Job title/position</li>
              <li>• <strong>Email</strong> - Unique email address</li>
              <li>• <strong>Manager Email</strong> - Email of direct manager (leave empty for CEO)</li>
              <li>• <strong>Department</strong> - Department name (optional)</li>
              <li>• <strong>Avatar</strong> - Photo URL (optional - leave empty for default initials)</li>
            </ul>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-3 italic">
              💡 Tip: Upload photos to a cloud service (e.g., Imgur, Cloudinary) and paste the URLs in the Avatar column
            </p>
          </div>

          {/* Download Template */}
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="w-full"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Download Template
          </Button>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center hover:border-olive-500 dark:hover:border-olive-500 transition-colors">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-olive-100 dark:bg-olive-900/30 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-olive-600 dark:text-olive-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {uploading ? "Processing..." : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Excel (.xlsx, .xls) or CSV files
                </p>
              </div>
            </label>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                  Validation Error
                </h4>
                <p className="text-sm text-red-800 dark:text-red-200">
                  {validationError}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
