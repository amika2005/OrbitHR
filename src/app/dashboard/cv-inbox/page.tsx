"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, CheckCircle, XCircle, Play, Pause } from "lucide-react";

export default function CVInboxPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [autoCheck, setAutoCheck] = useState(false);
  const [interval, setIntervalMinutes] = useState(5);
  const [nextCheck, setNextCheck] = useState<Date | null>(null);

  // Auto-check timer
  useEffect(() => {
    if (!autoCheck) return;

    const timer = setInterval(() => {
      checkEmails();
    }, interval * 60 * 1000); // Convert minutes to milliseconds

    // Set next check time
    setNextCheck(new Date(Date.now() + interval * 60 * 1000));

    return () => clearInterval(timer);
  }, [autoCheck, interval]);

  const checkEmails = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/cron/check-cv-inbox", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 4753183dfad8571c916b54648459e27e887de15e89c7f70d86cc76aa11a91507",
        },
      });

      const data = await response.json();
      setResult(data);
      
      // Update next check time if auto-check is on
      if (autoCheck) {
        setNextCheck(new Date(Date.now() + interval * 60 * 1000));
      }
    } catch (error) {
      setResult({ success: false, error: "Failed to check emails" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CV Inbox</h1>
        <p className="text-gray-600">Check for new CV submissions via email</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Monitoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-Check Controls */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Auto-Check Emails</h3>
                <p className="text-sm text-blue-700">
                  {autoCheck ? (
                    <>Running - Next check: {nextCheck?.toLocaleTimeString()}</>
                  ) : (
                    "Automatically check for new CVs"
                  )}
                </p>
              </div>
              <Button
                onClick={() => setAutoCheck(!autoCheck)}
                variant={autoCheck ? "destructive" : "default"}
                className={autoCheck ? "" : "bg-green-600 hover:bg-green-700"}
              >
                {autoCheck ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Stop Auto-Check
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Auto-Check
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-blue-900">
                Check every:
              </label>
              <select
                value={interval}
                onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                disabled={autoCheck}
                className="px-3 py-1 border rounded-md"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
          </div>

          {/* Manual Check Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={checkEmails}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Emails...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Check Emails Now
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500">
              Email: amikafernando123@gmail.com
            </p>
          </div>

          {result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {result.success ? "Success!" : "Error"}
                  </p>
                  {result.success ? (
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Emails checked: {result.emailsChecked || 0}</p>
                      <p>CVs processed: {result.cvsProcessed || 0}</p>
                      {result.results && result.results.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Results:</p>
                          {result.results.map((r: any, i: number) => (
                            <div key={i} className="ml-4 mt-1">
                              <p>• {r.filename}</p>
                              {r.score && <p className="text-xs">Score: {r.score}/100</p>}
                              {r.routed && <p className="text-xs text-green-600">✓ Added to Pipeline</p>}
                              {r.error && <p className="text-xs text-red-600">Error: {r.error}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">{result.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">How it works:</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Click "Check Emails Now" button</li>
              <li>System checks amikafernando123@gmail.com for new CVs</li>
              <li>AI analyzes each CV and gives a score (0-100)</li>
              <li>CVs with score ≥ 70 are automatically added to Pipeline</li>
              <li>All CVs are stored in database for review</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
