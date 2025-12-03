"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ApplicationStatus } from "@prisma/client";
import { CandidateCard } from "./CandidateCard";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

interface Application {
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
}

interface PipelineBoardProps {
  applications: Application[];
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => Promise<void>;
}

const COLUMNS = [
  {
    id: ApplicationStatus.NEW,
    title: "New Applications",
    color: "border-l-gray-400",
    bgColor: "bg-gray-50",
  },
  {
    id: ApplicationStatus.AI_SCREENED,
    title: "AI Rated",
    color: "border-l-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: ApplicationStatus.HR_APPROVED,
    title: "HR Approved",
    color: "border-l-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: ApplicationStatus.INTERVIEW_SCHEDULED,
    title: "Interview",
    color: "border-l-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    id: ApplicationStatus.HIRED,
    title: "Hired",
    color: "border-l-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: ApplicationStatus.REJECTED,
    title: "Rejected",
    color: "border-l-red-500",
    bgColor: "bg-red-50",
  },
];

export function PipelineBoard({ applications, onStatusChange }: PipelineBoardProps) {
  const router = useRouter();
  const [columns, setColumns] = useState<Record<ApplicationStatus, Application[]>>({
    NEW: [],
    AI_SCREENED: [],
    HR_APPROVED: [],
    INTERVIEW_SCHEDULED: [],
    HIRED: [],
    REJECTED: [],
  });

  // Group applications by status
  useEffect(() => {
    const grouped = applications.reduce((acc, app) => {
      if (!acc[app.status]) {
        acc[app.status] = [];
      }
      acc[app.status].push(app);
      return acc;
    }, {} as Record<ApplicationStatus, Application[]>);

    // Ensure all statuses exist
    COLUMNS.forEach((col) => {
      if (!grouped[col.id]) {
        grouped[col.id] = [];
      }
    });

    setColumns(grouped);
  }, [applications]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside
    if (!destination) return;

    // Dropped in same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as ApplicationStatus;
    const destStatus = destination.droppableId as ApplicationStatus;

    // Update local state optimistically
    const newColumns = { ...columns };
    const sourceColumn = Array.from(newColumns[sourceStatus]);
    const destColumn =
      sourceStatus === destStatus
        ? sourceColumn
        : Array.from(newColumns[destStatus]);

    const [movedItem] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, { ...movedItem, status: destStatus });

    if (sourceStatus === destStatus) {
      newColumns[sourceStatus] = destColumn;
    } else {
      newColumns[sourceStatus] = sourceColumn;
      newColumns[destStatus] = destColumn;
    }

    setColumns(newColumns);

    // Update backend
    try {
      await onStatusChange(draggableId, destStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert on error
      setColumns(columns);
    }
  };

  return (
    <div className="h-full overflow-x-auto pb-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 min-h-[calc(100vh-12rem)]">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="mb-4">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wider">
                  {column.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {columns[column.id]?.length || 0} candidate
                  {columns[column.id]?.length !== 1 ? "s" : ""}
                </p>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-[200px] rounded-lg p-3 transition-colors
                      ${snapshot.isDraggingOver ? column.bgColor : "bg-gray-50/50"}
                      border-2 border-dashed
                      ${snapshot.isDraggingOver ? "border-gray-400" : "border-gray-200"}
                    `}
                  >
                    <div className="space-y-3">
                      {columns[column.id]?.map((application, index) => (
                        <Draggable
                          key={application.id}
                          draggableId={application.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                transition-shadow
                                ${snapshot.isDragging ? "shadow-2xl rotate-2" : ""}
                              `}
                            >
                              <CandidateCard
                                application={application}
                                onClick={() => router.push(`/dashboard/candidates/${application.id}`)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
