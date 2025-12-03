"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ApplicationStatus } from "@prisma/client";
import { Calendar, TrendingUp, Users, AlertCircle } from "lucide-react";

interface CandidateCardProps {
  application: {
    id: string;
    status: ApplicationStatus;
    aiScore: number | null;
    culturalFitScore: number | null;
    candidate: {
      firstName: string;
      lastName: string;
      email: string;
    };
    job: {
      title: string;
    };
    createdAt: Date;
    interviewDate: Date | null;
  };
  onClick?: () => void;
}

export function CandidateCard({ application, onClick }: CandidateCardProps) {
  const { candidate, job, aiScore, culturalFitScore, interviewDate, createdAt } = application;

  // Score color coding
  const getScoreColor = (score: number | null) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number | null) => {
    if (!score) return "bg-gray-100";
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  const initials = `${candidate.firstName[0]}${candidate.lastName[0]}`.toUpperCase();

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-blue-500 bg-white"
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10 border-2 border-gray-200">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 truncate">
              {candidate.firstName} {candidate.lastName}
            </h4>
            <p className="text-xs text-gray-500 truncate">{candidate.email}</p>
          </div>
        </div>

        {/* Job Title */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 truncate">Applied for:</p>
          <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
        </div>

        {/* AI Scores */}
        {aiScore !== null && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Technical Score */}
            <div
              className={`
              flex items-center gap-2 p-2 rounded-lg
              ${getScoreBg(aiScore)}
            `}
            >
              <TrendingUp className={`h-4 w-4 ${getScoreColor(aiScore)}`} />
              <div>
                <p className="text-xs text-gray-600">Technical</p>
                <p className={`text-lg font-bold ${getScoreColor(aiScore)}`}>
                  {aiScore}
                </p>
              </div>
            </div>

            {/* Cultural Fit Score */}
            <div
              className={`
              flex items-center gap-2 p-2 rounded-lg
              ${getScoreBg(culturalFitScore)}
            `}
            >
              <Users className={`h-4 w-4 ${getScoreColor(culturalFitScore)}`} />
              <div>
                <p className="text-xs text-gray-600">Culture</p>
                <p className={`text-lg font-bold ${getScoreColor(culturalFitScore)}`}>
                  {culturalFitScore}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No AI Score Yet */}
        {aiScore === null && (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg mb-3">
            <AlertCircle className="h-4 w-4 text-gray-400" />
            <p className="text-xs text-gray-600">Awaiting AI screening</p>
          </div>
        )}

        {/* Interview Date */}
        {interviewDate && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg mb-3">
            <Calendar className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-xs text-gray-600">Interview</p>
              <p className="text-xs font-medium text-amber-900">
                {new Date(interviewDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Applied{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
          <Badge
            variant="secondary"
            className="text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Review →
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
