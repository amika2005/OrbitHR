import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentUpload } from "@/components/portal/DocumentUpload";
import { FolderOpen, FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

async function DocumentsContent() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Get user documents
  const documents = await db.document.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { uploadedAt: "desc" },
  });

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      ID_PROOF: "bg-blue-100 text-blue-800",
      CONTRACT: "bg-green-100 text-green-800",
      CERTIFICATE: "bg-purple-100 text-purple-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.OTHER;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
        <p className="text-gray-600 mt-2">
          Upload and manage your employment documents
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUpload />
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>My Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Documents Yet
              </h3>
              <p className="text-gray-500">
                Upload your first document using the form above
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-portal-light flex items-center justify-center">
                      <FileText className="h-6 w-6 text-portal-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{doc.fileName}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(
                            doc.category
                          )}`}
                        >
                          {doc.category.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(doc.fileSize)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.fileUrl, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar />
      <div className="flex-1 lg:ml-64">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-portal-primary"></div>
            </div>
          }
        >
          <DocumentsContent />
        </Suspense>
      </div>
    </div>
  );
}
