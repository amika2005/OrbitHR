"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Clock, CheckCircle, XCircle, User, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: "ANNUAL_LEAVE" | "CASUAL_LEAVE" | "SICK_LEAVE" | "HALF_DAY";
  status: "PENDING" | "APPROVED" | "REJECTED";
  employeeName?: string; // Optional, derived from title usually
}

interface LeaveCalendarProps {
  events: CalendarEvent[];
}

export function LeaveCalendar({ events }: LeaveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventColor = (type: string, status: string) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    if (status === "REJECTED") return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    
    switch (type) {
      case "ANNUAL_LEAVE":
        return "bg-olive-100 text-olive-700 border-olive-200 dark:bg-olive-900/30 dark:text-olive-400 dark:border-olive-800";
      case "CASUAL_LEAVE":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
      case "SICK_LEAVE":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "HALF_DAY":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), day));
  };

  const handleDayClick = (day: Date) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setSelectedDate(day);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-olive-600" />
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-600 dark:text-zinc-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-600 dark:text-zinc-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 py-3 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr bg-zinc-200 dark:bg-zinc-800 gap-px">
        {calendarDays.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={`min-h-[120px] bg-white dark:bg-zinc-900 p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer relative group ${
                !isCurrentMonth ? "bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-400" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                    isCurrentDay
                      ? "bg-olive-600 text-white shadow-sm"
                      : "text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    className={`text-xs px-2 py-1 rounded-md border truncate font-medium transition-transform hover:scale-[1.02] cursor-pointer ${getEventColor(
                      event.type,
                      event.status
                    )}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 pl-1 font-medium hover:text-olive-600 transition-colors">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Details Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-zinc-900 dark:text-white">
              <Calendar className="w-5 h-5 text-olive-600" />
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 dark:text-zinc-400">
              Leave requests for this day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedDate &&
              getEventsForDay(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${getEventColor(event.type, event.status)} bg-opacity-10`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs opacity-80">
                        <Badge variant="outline" className="uppercase text-[10px] h-5">
                          {event.type.replace("_", " ")}
                        </Badge>
                        <span>•</span>
                        <span className="capitalize">{event.status.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-olive-600" />
              Leave Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-olive-100">
                  <AvatarFallback className="bg-olive-100 text-olive-700">
                    {selectedEvent.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedEvent.date), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 uppercase font-bold">Type</span>
                  <p className="font-medium text-sm mt-1">{selectedEvent.type.replace("_", " ")}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 uppercase font-bold">Status</span>
                  <div className="mt-1">
                    {selectedEvent.status === "APPROVED" && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Approved</Badge>
                    )}
                    {selectedEvent.status === "PENDING" && (
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Pending</Badge>
                    )}
                    {selectedEvent.status === "REJECTED" && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Rejected</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
