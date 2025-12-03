"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationStatus } from "@prisma/client";
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { PDFViewer } from "./PDFViewer";

interface CandidateModalProps {
  application: {
    id: string;
    resumeUrl: string;
    aiScore: number | null;
    culturalFitScore: number | null;
    aiSummary: string | null;
    missingSkills: string[];
    candidate: {
      firstName: string;
      lastName: string;
      email: string;
    };
    job: {
      title: string;
      description: string;
    };
    status: ApplicationStatus;
    interviewDate: Date | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onApprove: (notes?: string) => Promise<void>;
  onReject: (notes?: string) => Promise<void>;
  onScheduleInterview: (date: Date, notes?: string) => Promise<void>;
}

export function CandidateModal({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onScheduleInterview,
}: CandidateModalProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");

  const { candidate, job, aiScore, culturalFitScore, aiSummary, missingSkills } =
    application;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(notes);
      onClose();
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(notes);
      onClose();
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewDate) return;
    setLoading(true);
    try {
      await onScheduleInterview(new Date(interviewDate), notes);
      onClose();
    } catch (error) {
      console.error("Failed to schedule interview:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden p-0">
        <div className="grid grid-cols-2 h-full">
          {/* LEFT: PDF Viewer */}
          <div className="bg-gray-100 p-6 overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-semibold">
                Resume Preview
              </DialogTitle>
            </DialogHeader>
            <PDFViewer url={application.resumeUrl} />
          </div>

          {/* RIGHT: AI Analysis & Actions */}
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Candidate Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {candidate.firstName} {candidate.lastName}
                </h2>
                <p className="text-sm text-gray-600">{candidate.email}</p>
                <Badge variant="outline" className="mt-2">
                  {job.title}
                </Badge>
              </div>

              <Separator />

              {/* AI Scores */}
              {aiScore !== null && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-lg">AI Analysis</h3>
                  </div>

                  {/* Score Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-medium text-gray-600">
                          Technical Fit
                        </p>
                      </div>
                      <p
                        className={`text-3xl font-bold ${getScoreColor(aiScore)}`}
                      >
                        {aiScore}
                        <span className="text-lg text-gray-400">/100</span>
                      </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <p className="text-xs font-medium text-gray-600">
                          Cultural Fit
                        </p>
                      </div>
                      <p
                        className={`text-3xl font-bold ${getScoreColor(culturalFitScore)}`}
                      >
                        {culturalFitScore}
                        <span className="text-lg text-gray-400">/100</span>
                      </p>
                    </div>
                  </div>

                  {/* AI Summary */}
                  {aiSummary && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                        <h4 className="font-medium text-sm">Summary</h4>
                      </div>
                      <div className="prose prose-sm text-gray-700 whitespace-pre-line">
                        {aiSummary}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {missingSkills.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <h4 className="font-medium text-sm text-amber-900">
                          Missing Skills
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {missingSkills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-amber-100 text-amber-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interview Scheduling */}
              {application.status === ApplicationStatus.HR_APPROVED && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">Schedule Interview</h3>
                  </div>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Notes Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700">
                  Add Review Notes (Optional)
                </h3>
                <Textarea
                  placeholder="Add your thoughts about this candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Action Buttons (Sticky) */}
            <div className="border-t bg-white p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={loading}
                  className="h-14 text-base font-semibold"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Reject
                </Button>

                {application.status === ApplicationStatus.HR_APPROVED &&
                interviewDate ? (
                  <Button
                    size="lg"
                    onClick={handleScheduleInterview}
                    disabled={loading}
                    className="h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Interview
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleApprove}
                    disabled={loading}
                    className="h-14 text-base font-semibold bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Approve for Interview
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
