"use client";

import { useState } from "react";
import { Upload, X, FileText, File, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DocumentUploadProps {
  onUploadSuccess?: () => void;
}

export function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("OTHER");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", category);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Document uploaded successfully!");
        setSelectedFile(null);
        setCategory("OTHER");
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        toast.error(result.error || "Failed to upload document");
      }
    } catch (error) {
      toast.error("An error occurred while uploading");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <FileText className="h-8 w-8 text-gray-400" />;
    
    const type = selectedFile.type;
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-portal-primary" />;
    }
    return <File className="h-8 w-8 text-portal-primary" />;
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-portal-primary transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-2">
            {selectedFile ? (
              <>
                {getFileIcon()}
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG (max 10MB)
                </p>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Category Selection */}
      {selectedFile && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-primary focus:border-transparent"
          >
            <option value="ID_PROOF">ID Proof</option>
            <option value="CONTRACT">Contract</option>
            <option value="CERTIFICATE">Certificate</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setSelectedFile(null)}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 bg-portal-primary hover:bg-portal-500 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      )}
    </div>
  );
}
