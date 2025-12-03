"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Briefcase,
  Mail,
  Linkedin,
  MoreHorizontal,
  Filter,
  RefreshCw,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HiringFunnelWidget } from "./HiringFunnelWidget";
import { CandidateDrawer } from "./CandidateDrawer";

// --- Types ---

type StageId = "inbox" | "screening" | "interview" | "offer" | "hired";

interface Candidate {
  id: string;
  name: string;
  role: string;
  exp: string;
  aiScore: number;
  source: "mail" | "linkedin";
  sourceBy: string;
  stage: StageId;
  department: "IT" | "Marketing" | "Finance";
}

// --- Mock Data ---

const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    exp: "5y Exp • React Native",
    aiScore: 92,
    source: "linkedin",
    sourceBy: "hr.manager@orbithr.com",
    stage: "inbox",
    department: "IT",
  },
  {
    id: "2",
    name: "Michael Ross",
    role: "Senior Frontend Engineer",
    exp: "7y Exp • Full Stack",
    aiScore: 88,
    source: "mail",
    sourceBy: "careers@orbithr.com",
    stage: "screening",
    department: "IT",
  },
  {
    id: "3",
    name: "Jessica Wu",
    role: "Product Manager",
    exp: "4y Exp • SaaS",
    aiScore: 95,
    source: "linkedin",
    sourceBy: "hr.manager@orbithr.com",
    stage: "interview",
    department: "Marketing",
  },
  {
    id: "4",
    name: "David Miller",
    role: "Financial Analyst",
    exp: "6y Exp • CPA",
    aiScore: 82,
    source: "mail",
    sourceBy: "careers@orbithr.com",
    stage: "offer",
    department: "Finance",
  },
  {
    id: "5",
    name: "Emily Davis",
    role: "UX Designer",
    exp: "3y Exp • Figma",
    aiScore: 78,
    source: "linkedin",
    sourceBy: "hr.manager@orbithr.com",
    stage: "inbox",
    department: "IT",
  },
];

const stages: { id: StageId; title: string }[] = [
  { id: "inbox", title: "Inbox" },
  { id: "screening", title: "Screening" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
  { id: "hired", title: "Hired" },
];

// --- Components ---

function CandidateCard({ candidate, onClick }: { candidate: Candidate; onClick?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-lg p-3 mb-3 cursor-move hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors group"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
          {candidate.name}
        </h3>
        <Badge className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold px-1.5 py-0 rounded h-5">
          AI: {candidate.aiScore}
        </Badge>
      </div>

      {/* Middle Row */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-medium">
        {candidate.exp}
      </p>

      {/* Footer */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2 flex items-center justify-between">
        <div className="flex items-center text-[10px] text-zinc-400 dark:text-zinc-500">
          {candidate.source === "linkedin" ? (
            <Linkedin className="h-3 w-3 mr-1.5" />
          ) : (
            <Mail className="h-3 w-3 mr-1.5" />
          )}
          <span className="truncate max-w-[120px]">Via: {candidate.sourceBy}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function PipelineColumn({
  stage,
  candidates,
  onCandidateClick,
}: {
  stage: { id: StageId; title: string };
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
}) {
  return (
    <div className="flex-1 min-w-[260px] flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
          {stage.title}
        </h3>
        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold px-2 py-0.5 rounded-full">
          {candidates.length}
        </span>
      </div>

      {/* Column Track */}
      <div className="flex-1 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-lg p-2 border border-transparent transition-colors">
        <SortableContext
          items={candidates.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {candidates.map((candidate) => (
            <CandidateCard 
              key={candidate.id} 
              candidate={candidate}
              onClick={() => onCandidateClick(candidate)}
            />
          ))}
        </SortableContext>
        {candidates.length === 0 && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            <span className="text-xs text-zinc-400">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function RecruitmentPipeline() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState("Senior Frontend Engineer");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeCandidate = candidates.find((c) => c.id === active.id);
    if (!activeCandidate) {
      setActiveId(null);
      return;
    }

    // Find the stage we dropped over
    // It could be a container (stage id) or another item (candidate id)
    let overStageId: StageId | undefined;

    if (stages.some((s) => s.id === over.id)) {
      overStageId = over.id as StageId;
    } else {
      const overCandidate = candidates.find((c) => c.id === over.id);
      if (overCandidate) {
        overStageId = overCandidate.stage;
      }
    }

    if (overStageId && activeCandidate.stage !== overStageId) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === activeCandidate.id ? { ...c, stage: overStageId! } : c
        )
      );
    }

    setActiveId(null);
  };

  const activeCandidate = activeId
    ? candidates.find((c) => c.id === activeId)
    : null;

  // Filter Logic
  const filteredCandidates = candidates.filter((c) => {
    const jobMatch =
      selectedJob === "All Roles" || c.role === selectedJob; // Simplified for demo
    const deptMatch = selectedDept === "All" || c.department === selectedDept;
    return jobMatch && deptMatch;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* --- Control Bar (Sticky Header) --- */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Job Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hidden md:inline-block">
              Viewing Pipeline for:
            </span>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-[280px] h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100 focus:ring-zinc-500">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                <SelectItem value="Senior Frontend Engineer">
                  Senior Frontend Engineer
                </SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Financial Analyst">Financial Analyst</SelectItem>
                <SelectItem value="UX Designer">UX Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Center: Dept Filters */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
            {["All", "IT", "Marketing", "Finance"].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedDept === dept
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Right: Sync Status */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                Live Sync: careers@ & hr@orbithr.com
              </span>
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 border-zinc-200 dark:border-zinc-800">
               <Search className="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- Kanban Board --- */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full min-w-[1200px]">
            {stages.map((stage) => (
              <PipelineColumn
                key={stage.id}
                stage={stage}
                candidates={filteredCandidates.filter((c) => c.stage === stage.id)}
                onCandidateClick={setSelectedCandidate}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCandidate ? (
              <CandidateCard candidate={activeCandidate} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Hiring Funnel Widget */}
      <HiringFunnelWidget />

      {/* Candidate Drawer */}
      <CandidateDrawer 
        candidate={selectedCandidate} 
        onClose={() => setSelectedCandidate(null)} 
      />
    </div>
  );
}
