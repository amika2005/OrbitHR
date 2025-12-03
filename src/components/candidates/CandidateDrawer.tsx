"use client";

import { useState } from "react";
import {
  X,
  Mail,
  MessageSquare,
  User,
  Calendar,
  Phone,
  MapPin,
  Linkedin,
  Send,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Candidate {
  id: string;
  name: string;
  role: string;
  exp: string;
  aiScore: number;
  source: "mail" | "linkedin";
  sourceBy: string;
  stage: string;
  department: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface ChatMessage {
  id: string;
  type: "comment" | "system";
  author?: TeamMember;
  content: string;
  timestamp: string;
}

interface CandidateDrawerProps {
  candidate: Candidate | null;
  onClose: () => void;
}

const emailTemplates = {
  "interview-invite": {
    subject: "Interview Invitation - {{role}} Position at OrbitHR",
    body: `Dear {{name}},

Thank you for your application for the {{role}} position at OrbitHR. We were impressed by your background and would like to invite you for an interview.

Interview Details:
- Date: [To be scheduled]
- Duration: 45 minutes
- Format: Virtual/In-person

Please let us know your availability for the coming week.

Best regards,
The OrbitHR Team`,
  },
  rejection: {
    subject: "Update on Your Application - {{role}} Position",
    body: `Dear {{name}},

Thank you for taking the time to apply for the {{role}} position at OrbitHR and for your interest in joining our team.

After careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current needs.

We appreciate your interest in OrbitHR and wish you the best in your job search.

Best regards,
The OrbitHR Team`,
  },
  "offer-letter": {
    subject: "Job Offer - {{role}} Position at OrbitHR",
    body: `Dear {{name}},

We are delighted to extend an offer for the {{role}} position at OrbitHR.

Offer Details:
- Position: {{role}}
- Start Date: [To be confirmed]
- Compensation: [Details to follow]

Please review the attached formal offer letter. We look forward to welcoming you to the team!

Best regards,
The OrbitHR Team`,
  },
};

export function CandidateDrawer({ candidate, onClose }: CandidateDrawerProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "email">("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [emailTemplate, setEmailTemplate] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Mock data
  const hiringTeam: TeamMember[] = [
    { id: "1", name: "Crystal Welch", avatar: "CW", role: "Hiring Manager" },
    { id: "2", name: "James Chen", avatar: "JC", role: "Interviewer" },
    { id: "3", name: "Sarah Kim", avatar: "SK", role: "Interviewer" },
  ];

  const chatHistory: ChatMessage[] = [
    {
      id: "1",
      type: "system",
      content: "Amika moved candidate to Interview stage",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "comment",
      author: hiringTeam[0],
      content: "Strong technical background. Let's schedule a technical interview.",
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      type: "comment",
      author: hiringTeam[1],
      content: "@Crystal I can do Thursday afternoon. What time works?",
      timestamp: "45 min ago",
    },
  ];

  const handleTemplateChange = (template: string) => {
    setEmailTemplate(template);
    if (template && candidate) {
      const tmpl = emailTemplates[template as keyof typeof emailTemplates];
      setEmailSubject(
        tmpl.subject
          .replace("{{role}}", candidate.role)
          .replace("{{name}}", candidate.name)
      );
      setEmailBody(
        tmpl.body
          .replace(/{{role}}/g, candidate.role)
          .replace(/{{name}}/g, candidate.name)
      );
    } else {
      setEmailSubject("");
      setEmailBody("");
    }
  };

  if (!candidate) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex-none px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold border-2 border-zinc-200 dark:border-zinc-700">
                <AvatarFallback className="text-lg">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {candidate.name}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {candidate.role}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-black text-white dark:bg-white dark:text-black text-xs font-bold">
                    AI: {candidate.aiScore}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {candidate.stage}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Mail className="h-3.5 w-3.5" />
              <span>{candidate.email || "sarah.chen@example.com"}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Phone className="h-3.5 w-3.5" />
              <span>{candidate.phone || "+94 77 123 4567"}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5" />
              <span>{candidate.location || "Colombo, Sri Lanka"}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Linkedin className="h-3.5 w-3.5" />
              <span>linkedin.com/in/{candidate.name.toLowerCase().replace(" ", "")}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-none px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("chat")}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "chat"
                  ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Team Chat
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "email"
                  ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Email
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-6">
              {activeTab === "chat" && (
                <div className="space-y-4">
                  {/* Chat History */}
                  <div className="space-y-3">
                    {chatHistory.map((msg) => (
                      <div key={msg.id}>
                        {msg.type === "system" ? (
                          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 py-2">
                            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                            <span>{msg.content}</span>
                            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold border border-zinc-200 dark:border-zinc-700">
                              <AvatarFallback className="text-xs">
                                {msg.author?.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                  {msg.author?.name}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  {msg.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="sticky bottom-0 pt-4 bg-white dark:bg-zinc-900">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a note or @mention someone..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      />
                      <Button size="sm" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "email" && (
                <div className="space-y-4">
                  {/* Template Selector */}
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                      Email Template
                    </label>
                    <Select value={emailTemplate} onValueChange={handleTemplateChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a template..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interview-invite">Interview Invitation</SelectItem>
                        <SelectItem value="rejection">Rejection</SelectItem>
                        <SelectItem value="offer-letter">Offer Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject..."
                      className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                      Message
                    </label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Write your message..."
                      rows={12}
                      className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none font-mono"
                    />
                  </div>

                  <Button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              )}
            </div>

            {/* Right Sidebar - Interview Panel */}
            <div className="w-64 border-l border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
                Hiring Team
              </h3>
              <div className="space-y-3">
                {hiringTeam.map((member, index) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold border border-zinc-200 dark:border-zinc-700">
                      <AvatarFallback className="text-xs">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Interviewer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
