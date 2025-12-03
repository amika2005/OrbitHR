"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { bulkImportEmployees } from "@/actions/employee-actions";
import { toast } from "sonner";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BulkImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    email: string;
    success: boolean;
    error?: string;
  }> | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please select a CSV file");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setResults(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);
    try {
      const csvText = await file.text();
      const result = await bulkImportEmployees(csvText);

      if (result.success) {
        setResults(result.results);
        toast.success(result.message || "Import completed");
        onSuccess();
      } else {
        toast.error(result.error || "Import failed");
      }
    } catch (error) {
      toast.error("An error occurred during import");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = "email,firstName,lastName,department,position,password,BadgeNumber,EmergencyContact,ParkingSpot\njohn.doe@company.com,John,Doe,Engineering,Software Engineer,SecurePass123,EMP001,555-1234,A-15\njane.smith@company.com,Jane,Smith,Marketing,Marketing Manager,SecurePass456,EMP002,555-5678,B-22";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setFile(null);
    setResults(null);
    onOpenChange(false);
  };

  const successCount = results?.filter((r) => r.success).length || 0;
  const failureCount = results?.filter((r) => !r.success).length || 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Employees</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple employees. Any extra columns will be automatically stored as custom fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Download CSV Template
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Use this template to format your employee data correctly
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  💡 <strong>Tip:</strong> You can add ANY extra columns (e.g., BadgeNumber, ParkingSpot, EmergencyContact) and they'll be automatically stored as custom fields!
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="ml-4"
              >
                <Download className="w-4 h-4 mr-2" />
                Template
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload CSV File
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-olive-500 dark:hover:border-olive-400 transition-colors">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    {file ? (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-olive-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          CSV files only (max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Import Results */}
          {results && results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Import Results
                </h4>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>{successCount} succeeded</span>
                  </div>
                  {failureCount > 0 && (
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span>{failureCount} failed</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                        Error
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {results.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-2">
                          {result.success ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                          {result.email}
                        </td>
                        <td className="px-4 py-2 text-red-600 dark:text-red-400">
                          {result.error || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              {results ? "Close" : "Cancel"}
            </Button>
            {!results && (
              <Button
                onClick={handleImport}
                disabled={!file || loading}
                className="bg-olive-600 hover:bg-olive-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Employees
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
