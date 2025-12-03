"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Send, 
  Copy, 
  MoreHorizontal, 
  Search, 
  Mail, 
  Link2,
  X,
  Check,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data
const surveyTemplates = [
  { id: "1", name: "Weekly Check-in", questions: 3 },
  { id: "2", name: "Stress Check", questions: 5 },
  { id: "3", name: "Project Feedback", questions: 4 },
];

const mockEmployees = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMeeting: "3 days ago",
  },
  {
    id: "2",
    name: "Michael Johnson",
    role: "Backend Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    lastMeeting: "1 week ago",
  },
  {
    id: "3",
    name: "Yuki Tanaka",
    role: "Product Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
    lastMeeting: "2 days ago",
  },
  {
    id: "4",
    name: "Alex Rivera",
    role: "UX Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    lastMeeting: "5 days ago",
  },
  {
    id: "5",
    name: "Emma Watson",
    role: "Senior Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMeeting: "1 day ago",
  },
];

type QuestionType = "rating" | "text" | "multiple";

interface Question {
  id: string;
  type: QuestionType;
  text: string;
}

// Survey Builder Component
function SurveyBuilder() {
  const [surveyTitle, setSurveyTitle] = useState("Untitled Survey");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", type: "rating", text: "How satisfied are you with your current role?" },
  ]);
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), type: "text", text: "" },
    ]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleLaunch = (method: "email" | "link") => {
    setShowLaunchModal(false);
    if (method === "email") {
      toast.success("Survey sent via email to 45 employees");
    } else {
      navigator.clipboard.writeText("https://surveys.orbithr.com/xyz123");
      toast.success("Survey link copied to clipboard");
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Left Sidebar - Templates */}
      <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Templates</h3>
        </div>
        <div className="p-2">
          {surveyTemplates.map((template) => (
            <button
              key={template.id}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
            >
              <div className="text-sm font-medium text-zinc-900 dark:text-white">
                {template.name}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {template.questions} questions
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Editor */}
      <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto p-8">
          {/* Header with Launch Button */}
          <div className="flex items-center justify-between mb-8">
            <Input
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              className="text-3xl font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0 bg-transparent"
              placeholder="Survey Title"
            />
            <Button onClick={() => setShowLaunchModal(true)} size="sm">
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Launch
            </Button>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* Question Type Dropdown */}
                    <select
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(question.id, "type", e.target.value as QuestionType)
                      }
                      className="text-xs px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                    >
                      <option value="rating">Rating (1-10)</option>
                      <option value="text">Text Area</option>
                      <option value="multiple">Multiple Choice</option>
                    </select>

                    {/* Question Text */}
                    <Input
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                      placeholder="Enter your question..."
                      className="border-none shadow-none px-0 focus-visible:ring-0"
                    />
                  </div>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-zinc-400 hover:text-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Question Button */}
            <button
              onClick={addQuestion}
              className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Launch Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-96 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Launch Survey
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => handleLaunch("email")}
                variant="outline"
                className="w-full justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send via Email
              </Button>
              <Button
                onClick={() => handleLaunch("link")}
                variant="outline"
                className="w-full justify-start"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
            <Button
              onClick={() => setShowLaunchModal(false)}
              variant="ghost"
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 1-on-1 Journal Component
function OneOnOneJournal() {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const filteredEmployees = mockEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-zinc-950">
      {/* Left Strip - Employee List */}
      <div className="w-72 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-900">
        {/* Search */}
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            />
          </div>
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmployees.map((employee) => (
            <button
              key={employee.id}
              onClick={() => {
                setSelectedEmployee(employee);
                setNotes("");
                setTodos([]);
              }}
              className={cn(
                "w-full p-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left relative",
                selectedEmployee.id === employee.id &&
                  "bg-zinc-100 dark:bg-zinc-800 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-zinc-900 dark:before:bg-white"
              )}
            >
              <img
                src={employee.avatar}
                alt={employee.name}
                className="h-10 w-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  {employee.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {employee.role}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Focus Mode Editor */}
      <div className="flex-1 flex">
        {/* Main Writing Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-12 py-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {selectedEmployee.name}
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Last meeting: {selectedEmployee.lastMeeting}
                  </p>
                </div>
              </div>
              <div className="text-base text-zinc-400 dark:text-zinc-500 mt-4">
                {currentDate}
              </div>
            </div>

            {/* The Zen Writing Area */}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Start writing your notes from today's meeting..."
              className="w-full min-h-[400px] resize-none outline-none border-none bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-lg leading-relaxed"
              style={{ fontFamily: "inherit" }}
            />
          </div>
        </div>

        {/* Right Sidebar - Action Items */}
        <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 overflow-y-auto">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">
            Action Items
          </h3>
          <div className="space-y-2 mb-4">
            {todos.map((todo, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Check className="h-4 w-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <span className="flex-1">{todo}</span>
              </div>
            ))}
          </div>

          {/* Add Todo */}
          <div className="space-y-2">
            <Input
              placeholder="Add action item..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                }
              }}
              className="h-9 text-sm"
            />
            <Button size="sm" onClick={addTodo} className="w-full">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main RetainSuite Component
export default function RetainSuite() {
  const [activeTab, setActiveTab] = useState<"surveys" | "oneOnOne">("surveys");

  return (
    <div className="h-full">
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-1 px-6 pt-4">
          <button
            onClick={() => setActiveTab("surveys")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-md transition-colors relative",
              activeTab === "surveys"
                ? "text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            Pulse Surveys
            {activeTab === "surveys" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("oneOnOne")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-md transition-colors relative",
              activeTab === "oneOnOne"
                ? "text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            1-on-1 Journal
            {activeTab === "oneOnOne" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white"
              />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "surveys" ? <SurveyBuilder /> : <OneOnOneJournal />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
