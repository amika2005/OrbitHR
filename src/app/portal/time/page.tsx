import { Suspense } from "react";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

async function TimeContent() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
        <p className="text-gray-600 mt-2">
          Clock in/out and view your attendance
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Clock className="h-16 w-16 text-portal-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Time Tracking Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              Clock in/out, track attendance, and view your work hours
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-portal-light text-portal-primary rounded-lg">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Feature in Development</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TimePage() {
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
          <TimeContent />
        </Suspense>
      </div>
    </div>
  );
}
