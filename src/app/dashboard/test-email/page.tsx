"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestEmailPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult("Testing...");

    try {
      const response = await fetch("/api/test-email-config", {
        method: "POST",
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? "Testing..." : "Test Email Config"}
          </Button>
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
