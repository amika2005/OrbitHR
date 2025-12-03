"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Send, 
  Mail, 
  Copy,
  X,
  Trash2,
  GripVertical,
  MessageSquare,
  TrendingUp,
  Users,
  Building2,
  User,
  Smile,
  ThumbsUp,
  BarChartHorizontal,
  Loader2,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  createSurvey,
  updateSurvey,
  launchSurvey,
  getSurveys,
  getSurveyAnalytics,
} from "@/actions/survey-actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Template data with icons
const TEMPLATES = [
  {
    id: "weekly",
    name: "Weekly Pulse",
    icon: "📅",
    description: "Quick weekly check-in",
    questions: [
      { id: "q1", text: "How was your workload this week?", type: "text" as const },
      { id: "q2", text: "Any blockers?", type: "text" as const },
      { id: "q3", text: "Rate your energy (1-10)", type: "rating" as const }
    ]
  },
  {
    id: "manager",
    name: "Manager Feedback",
    icon: "❤️",
    description: "1-on-1 effectiveness",
    questions: [
      { id: "q1", text: "Does your manager support your goals?", type: "emoji" as const },
      { id: "q2", text: "How often do you have 1:1s?", type: "multiple" as const },
      { id: "q3", text: "What could be improved?", type: "text" as const }
    ]
  },
  {
    id: "enps",
    name: "Quarterly eNPS",
    icon: "⭐",
    description: "Employee satisfaction",
    questions: [
      { id: "q1", text: "How likely are you to recommend OrbitHR to a friend?", type: "rating" as const },
      { id: "q2", text: "What do you value most about working here?", type: "text" as const },
      { id: "q3", text: "What would make this a better place to work?", type: "text" as const }
    ]
  }
];

// Mock Departments
const DEPARTMENTS = ["Engineering", "Product", "Sales", "Marketing", "HR", "Finance"];

// Mock Employees
const EMPLOYEES = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
  { id: "4", name: "Alice Williams" },
];

interface Question {
  id: string;
  text: string;
  type: "text" | "rating" | "multiple" | "emoji" | "thumbs" | "likert";
}

interface SortableQuestionProps {
  question: Question;
  index: number;
  onUpdate: (id: string, text: string) => void;
  onUpdateType: (id: string, type: Question["type"]) => void;
  onDelete: (id: string) => void;
}

function SortableQuestion({ question, index, onUpdate, onUpdateType, onDelete }: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderPreview = () => {
    switch (question.type) {
      case "emoji":
        return (
          <div className="flex gap-4 mt-3 justify-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">😡</span>
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🙁</span>
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">😐</span>
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🙂</span>
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">😃</span>
          </div>
        );
      case "thumbs":
        return (
          <div className="flex gap-8 mt-3 justify-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
            <button className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-full transition-colors">
              <span className="text-2xl">👎</span>
            </button>
            <button className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-full transition-colors">
              <span className="text-2xl">👍</span>
            </button>
          </div>
        );
      case "likert":
        return (
          <div className="flex justify-between mt-3 px-2 text-xs text-gray-500 dark:text-zinc-400">
            <span>Strongly Disagree</span>
            <span>Neutral</span>
            <span>Strongly Agree</span>
          </div>
        );
      case "rating":
        return (
          <div className="flex gap-1 mt-3 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div key={num} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm">
                {num}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 border-2 rounded-lg transition-all group",
        "bg-white dark:bg-zinc-900",
        "border-gray-200 dark:border-zinc-800",
        isDragging && "shadow-lg border-gray-400 dark:border-zinc-600 opacity-50"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-zinc-500">
              Question {index + 1}
            </span>
            <button
              onClick={() => onDelete(question.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 dark:text-zinc-600 dark:hover:text-red-400 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          {/* Question Text Input */}
          <Input
            value={question.text}
            onChange={(e) => onUpdate(question.id, e.target.value)}
            className="mb-3 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:placeholder-zinc-600"
            placeholder="Enter your question"
          />
          
          {/* Question Type Selector */}
          <div className="relative">
            <Select
              value={question.type}
              onValueChange={(value) => onUpdateType(question.id, value as Question["type"])}
            >
              <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-gray-300 dark:border-zinc-800">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Text Answer</span>
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Rating 1-10</span>
                  </div>
                </SelectItem>
                <SelectItem value="emoji">
                  <div className="flex items-center gap-2">
                    <Smile className="h-4 w-4" />
                    <span>Emoji Scale</span>
                  </div>
                </SelectItem>
                <SelectItem value="thumbs">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Thumbs Up/Down</span>
                  </div>
                </SelectItem>
                <SelectItem value="likert">
                  <div className="flex items-center gap-2">
                    <BarChartHorizontal className="h-4 w-4" />
                    <span>Likert Scale</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visual Preview */}
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}

// Mock Analytics Data
const RESPONSE_DATA = [
  { name: 'Week 1', responses: 65 },
  { name: 'Week 2', responses: 78 },
  { name: 'Week 3', responses: 72 },
  { name: 'Week 4', responses: 85 },
];

const SENTIMENT_DATA = [
  { text: "Supportive", value: 50, color: "#22c55e" },
  { text: "Workload", value: 40, color: "#eab308" },
  { text: "Growth", value: 35, color: "#3b82f6" },
  { text: "Communication", value: 30, color: "#a855f7" },
  { text: "Deadlines", value: 20, color: "#ef4444" },
];

const ENPS_DATA = [
  { name: 'Promoters', value: 60, color: '#22c55e' },
  { name: 'Passives', value: 30, color: '#eab308' },
  { name: 'Detractors', value: 10, color: '#ef4444' },
];

export default function PulseSurveysPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"design" | "results">("design");
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [surveyTitle, setSurveyTitle] = useState("Weekly Team Pulse");
  const [questions, setQuestions] = useState<Question[]>(TEMPLATES[0].questions);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(null);
  const [publicLink, setPublicLink] = useState<string>("");
  const [saving, setSaving] = useState(false);
  
  // Results tab state
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [surveyAnalytics, setSurveyAnalytics] = useState<any>(null);
  
  // Audience Targeting State
  const [targetAudience, setTargetAudience] = useState<"all" | "department" | "employees">("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load surveys when Results tab is opened
  useEffect(() => {
    if (activeTab === "results") {
      loadSurveys();
    }
  }, [activeTab]);

  const loadSurveys = async () => {
    setLoadingSurveys(true);
    const result = await getSurveys();
    if (result.success) {
      setSurveys(result.surveys || []);
    } else {
      toast.error(result.error || "Failed to load surveys");
    }
    setLoadingSurveys(false);
  };

  const handleSelectSurvey = async (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    const result = await getSurveyAnalytics(surveyId);
    if (result.success) {
      // Calculate eNPS if there are rating questions
      const ratingQuestions = result.analytics.questionAnalytics.filter(
        (qa: any) => qa.questionType === "rating"
      );
      let enpsScore = null;
      if (ratingQuestions.length > 0) {
        const allRatings = ratingQuestions.flatMap((qa: any) => qa.answers);
        if (allRatings.length > 0) {
          const promoters = allRatings.filter((r: number) => r >= 9).length;
          const detractors = allRatings.filter((r: number) => r <= 6).length;
          enpsScore = Math.round(((promoters - detractors) / allRatings.length) * 100);
        }
      }

      setSurveyAnalytics({
        ...result.analytics,
        responseRate: result.analytics.totalResponses > 0 ? 100 : 0,
        enpsScore,
      });
    } else {
      toast.error(result.error || "Failed to load analytics");
    }
  };

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setQuestions(template.questions);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      text: "New question",
      type: "text"
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const handleUpdateQuestionType = (id: string, type: Question["type"]) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, type } : q));
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    } else {
      toast.error("Survey must have at least one question");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveSurvey = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const surveyData = {
        title: surveyTitle,
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          required: false,
        })),
        targetType: targetAudience,
        targetValue: targetAudience === "department" ? selectedDepartment : undefined,
      };

      if (currentSurveyId) {
        const result = await updateSurvey(currentSurveyId, surveyData);
        if (result.success) {
          toast.success("Survey updated!");
        } else {
          toast.error(result.error || "Failed to update survey");
        }
      } else {
        const result = await createSurvey(surveyData);
        if (result.success) {
          setCurrentSurveyId(result.survey.id);
          toast.success("Survey saved!");
        } else {
          toast.error(result.error || "Failed to save survey");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleLaunchSurvey = async () => {
    if (!user) return;
    
    // Save first if not saved
    if (!currentSurveyId) {
      await handleSaveSurvey();
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (!currentSurveyId) {
      toast.error("Please save the survey first");
      return;
    }

    const result = await launchSurvey(currentSurveyId);
    if (result.success && result.publicLink) {
      setPublicLink(result.publicLink);
      setShowLaunchModal(true);
      toast.success("Survey launched!");
    } else {
      toast.error(result.error || "Failed to launch survey");
    }
  };

  const handleCopyLink = () => {
    if (publicLink) {
      navigator.clipboard.writeText(publicLink);
      toast.success("Survey link copied to clipboard!");
    }
  };

  const handleSendEmail = () => {
    if (publicLink) {
      const subject = encodeURIComponent(surveyTitle);
      const body = encodeURIComponent(`Please take a moment to complete this survey: ${publicLink}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      toast.success("Opening email client...");
    }
  };

  const handleShareTeams = () => {
    toast.success("Teams integration coming soon!");
  };

  return (
    <>
      {/* Premium Invisible Scrollbar Styles */}
      <style jsx global>{`
        .premium-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        /* Firefox */
        .premium-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
      `}</style>

      <div className="-m-6 h-[calc(100vh-3.5rem)] flex flex-col bg-slate-50 dark:bg-zinc-950 overflow-hidden">
        {/* Top Tab Switcher */}
        <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("design")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === "design"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-zinc-900"
                  : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
              )}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === "results"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-zinc-900"
                  : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
              )}
            >
              Results
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "design" ? (
              <motion.div
                key="design"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full flex"
              >
                {/* Sidebar - Templates */}
                <div className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4 overflow-y-auto premium-scrollbar">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                    Templates
                  </h3>
                  <div className="space-y-2">
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border-2 transition-all",
                          selectedTemplate.id === template.id
                            ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-zinc-800"
                            : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{template.icon}</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-white">{template.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Builder Area */}
                <div className="flex-1 overflow-y-auto premium-scrollbar p-8">
                  {/* The "Paper" Card */}
                  <div 
                    className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-lg"
                    style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.04)' }}
                  >
                    {/* Survey Title */}
                    <Input
                      value={surveyTitle}
                      onChange={(e) => setSurveyTitle(e.target.value)}
                      className="text-2xl font-bold border-none px-0 mb-6 focus-visible:ring-0 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                      placeholder="Survey Title"
                    />

                    {/* Audience Targeting */}
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Target Audience
                      </h4>
                      <div className="flex gap-4 mb-4">
                        <button
                          onClick={() => setTargetAudience("all")}
                          className={cn(
                            "flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-all",
                            targetAudience === "all"
                              ? "bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 shadow-sm text-gray-900 dark:text-white"
                              : "border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400"
                          )}
                        >
                          All Company
                        </button>
                        <button
                          onClick={() => setTargetAudience("department")}
                          className={cn(
                            "flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-all",
                            targetAudience === "department"
                              ? "bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 shadow-sm text-gray-900 dark:text-white"
                              : "border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400"
                          )}
                        >
                          Specific Department
                        </button>
                        <button
                          onClick={() => setTargetAudience("employees")}
                          className={cn(
                            "flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-all",
                            targetAudience === "employees"
                              ? "bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 shadow-sm text-gray-900 dark:text-white"
                              : "border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400"
                          )}
                        >
                          Specific Employees
                        </button>
                      </div>

                      {targetAudience === "department" && (
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                          <SelectTrigger className="w-full bg-white dark:bg-zinc-900">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {targetAudience === "employees" && (
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-700 text-sm text-gray-500 dark:text-zinc-400">
                          <p>Employee selection widget would go here (Multi-select)</p>
                        </div>
                      )}
                    </div>

                    {/* Draggable Questions */}
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={questions.map(q => q.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4 mb-6">
                          {questions.map((question, index) => (
                            <SortableQuestion
                              key={question.id}
                              question={question}
                              index={index}
                              onUpdate={handleUpdateQuestion}
                              onUpdateType={handleUpdateQuestionType}
                              onDelete={handleDeleteQuestion}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    {/* Add Question Button */}
                    <button 
                      onClick={handleAddQuestion}
                      className="w-full p-4 border-2 border-dashed rounded-lg transition-colors flex items-center justify-center gap-2
                        border-gray-300 dark:border-zinc-700
                        text-gray-500 dark:text-zinc-500
                        hover:border-gray-400 dark:hover:border-zinc-600
                        hover:text-gray-600 dark:hover:text-zinc-400"
                    >
                      <Plus className="h-4 w-4" />
                      Add Question
                    </button>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end gap-3">
                      <Button
                        onClick={handleSaveSurvey}
                        disabled={saving}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            {currentSurveyId ? "Update" : "Save"} Survey
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleLaunchSurvey}
                        className="flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Launch Survey
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full overflow-y-auto premium-scrollbar p-8"
              >
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Survey Selector */}
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Survey</h3>
                    {loadingSurveys ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : surveys.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-zinc-400">No surveys created yet. Create your first survey in the Design tab!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {surveys.map((survey: any) => (
                          <button
                            key={survey.id}
                            onClick={() => handleSelectSurvey(survey.id)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              selectedSurveyId === survey.id
                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                            }`}
                          >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{survey.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">
                              {survey._count?.responses || 0} responses
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                survey.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : survey.status === "closed"
                                  ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}>
                                {survey.status}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Analytics Dashboard */}
                  {selectedSurveyId && surveyAnalytics && (
                    <>
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-2">Response Rate</h3>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              {surveyAnalytics.responseRate}%
                            </span>
                            <span className="text-sm text-green-600 mb-1">
                              {surveyAnalytics.totalResponses > 0 ? "Active" : "No responses yet"}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-2">eNPS Score</h3>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              {surveyAnalytics.enpsScore !== null ? `+${surveyAnalytics.enpsScore}` : "N/A"}
                            </span>
                            <span className="text-sm text-green-600 mb-1">
                              {surveyAnalytics.enpsScore !== null && surveyAnalytics.enpsScore > 30 ? "Excellent" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-2">Total Responses</h3>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              {surveyAnalytics.totalResponses}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Question Analytics */}
                      <div className="space-y-6">
                        {surveyAnalytics.questionAnalytics.map((qa: any, index: number) => (
                          <div key={qa.questionId} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Q{index + 1}: {qa.questionText}
                            </h3>
                            
                            {qa.questionType === "rating" && qa.answers.length > 0 && (
                              <div>
                                <div className="flex items-center gap-4 mb-4">
                                  <span className="text-3xl font-bold text-indigo-600">
                                    {(qa.answers.reduce((sum: number, a: number) => sum + a, 0) / qa.answers.length).toFixed(1)}
                                  </span>
                                  <span className="text-sm text-gray-500">Average Rating</span>
                                </div>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                    const count = qa.answers.filter((a: number) => a === num).length;
                                    const percentage = (count / qa.totalAnswers) * 100;
                                    return (
                                      <div key={num} className="flex-1">
                                        <div className="h-24 bg-gray-100 dark:bg-zinc-800 rounded-t relative">
                                          <div
                                            className="absolute bottom-0 w-full bg-indigo-600 rounded-t"
                                            style={{ height: `${percentage}%` }}
                                          />
                                        </div>
                                        <div className="text-center text-xs text-gray-500 mt-1">{num}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {qa.questionType === "emoji" && qa.answers.length > 0 && (
                              <div className="flex gap-6 justify-center">
                                {["😡", "🙁", "😐", "🙂", "😃"].map((emoji, idx) => {
                                  const count = qa.answers.filter((a: number) => a === idx + 1).length;
                                  const percentage = (count / qa.totalAnswers) * 100;
                                  return (
                                    <div key={idx} className="text-center">
                                      <div className="text-4xl mb-2">{emoji}</div>
                                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                                      <div className="text-sm text-gray-500">{percentage.toFixed(0)}%</div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {qa.questionType === "thumbs" && qa.answers.length > 0 && (
                              <div className="flex gap-12 justify-center">
                                {["down", "up"].map((type) => {
                                  const count = qa.answers.filter((a: string) => a === type).length;
                                  const percentage = (count / qa.totalAnswers) * 100;
                                  return (
                                    <div key={type} className="text-center">
                                      <div className="text-5xl mb-2">{type === "up" ? "👍" : "👎"}</div>
                                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                                      <div className="text-sm text-gray-500">{percentage.toFixed(0)}%</div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {qa.questionType === "likert" && qa.answers.length > 0 && (
                              <div className="space-y-2">
                                {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((option, idx) => {
                                  const count = qa.answers.filter((a: number) => a === idx + 1).length;
                                  const percentage = (count / qa.totalAnswers) * 100;
                                  return (
                                    <div key={idx} className="flex items-center gap-4">
                                      <div className="w-32 text-sm text-gray-600 dark:text-zinc-400">{option}</div>
                                      <div className="flex-1 bg-gray-100 dark:bg-zinc-800 rounded-full h-8 relative">
                                        <div
                                          className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full flex items-center justify-end pr-2"
                                          style={{ width: `${percentage}%` }}
                                        >
                                          {percentage > 10 && (
                                            <span className="text-xs text-white font-medium">{count}</span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="w-12 text-sm text-gray-600 dark:text-zinc-400 text-right">
                                        {percentage.toFixed(0)}%
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {qa.questionType === "text" && qa.answers.length > 0 && (
                              <div className="space-y-3 max-h-96 overflow-y-auto">
                                {qa.answers.map((answer: string, idx: number) => (
                                  <div key={idx} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-zinc-300">{answer}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {qa.totalAnswers === 0 && (
                              <p className="text-gray-500 dark:text-zinc-400 text-center py-4">No responses yet</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {!selectedSurveyId && surveys.length > 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-zinc-400">Select a survey above to view analytics</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Launch Modal */}
        <AnimatePresence>
          {showLaunchModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowLaunchModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ready to gather feedback?</h3>
                  <button
                    onClick={() => setShowLaunchModal(false)}
                    className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-gray-600 dark:text-zinc-400 mb-4">Choose how you'd like to share this survey with your team.</p>

                {publicLink && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">Public Survey Link:</p>
                    <code className="text-sm text-indigo-600 dark:text-indigo-400 break-all">{publicLink}</code>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                  >
                    <Copy className="h-5 w-5" />
                    <span>Copy Public Link</span>
                  </Button>

                  <Button
                    onClick={handleSendEmail}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Send via Gmail</span>
                  </Button>

                  <Button
                    onClick={handleShareTeams}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Share to Teams</span>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
