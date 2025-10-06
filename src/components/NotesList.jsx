// DONE

import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { FileText, Clock, Tag, MoreHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";

export default function NotesList({
  notes,
  selectedNoteId,
  onNoteSelect,
  loading,
}) {
  const [hoveredNote, setHoveredNote] = useState(null);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm space-y-3 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-lg mt-0.5" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2 ml-8">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="size-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="size-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No notes found
        </h3>
        <p className="text-gray-500 text-sm max-w-sm">
          Create your first note to get started with your organized digital
          workspace
        </p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>/g, "").trim();
    return plainText.length > maxLength
      ? plainText.slice(0, maxLength) + "..."
      : plainText;
  };

  return (
    <div className="p-4 space-y-3">
      {notes.map((note) => {
        const isSelected = selectedNoteId === note._id;
        const isHovered = hoveredNote === note._id;

        return (
          <button
            key={note._id}
            onClick={() => onNoteSelect(note._id)}
            onMouseEnter={() => setHoveredNote(note._id)}
            onMouseLeave={() => setHoveredNote(null)}
            className={cn(
              "w-full text-left transition-all duration-300 group relative overflow-hidden",
              "rounded-2xl border-2 backdrop-blur-sm",
              isSelected
                ? "bg-gradient-to-br from-blue-50 to-teal-50/50 border-blue-200/80 shadow-lg shadow-blue-500/10 scale-[1.02]"
                : "bg-white/70 border-gray-200/50 hover:border-blue-100/80 hover:shadow-lg hover:shadow-blue-500/5 hover:scale-[1.01]"
            )}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-4 left-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" />
            )}

            {/* Hover gradient overlay */}
            {isHovered && !isSelected && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-transparent animate-pulse" />
            )}

            <div className="p-5 space-y-3 relative z-10">
              {/* Header with title and icon */}
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300 shrink-0",
                    isSelected
                      ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                  )}
                >
                  <FileText className="size-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-semibold text-base leading-tight transition-colors duration-300 line-clamp-1",
                      isSelected
                        ? "text-gray-900"
                        : "text-gray-800 group-hover:text-gray-900"
                    )}
                  >
                    {note.title || "Untitled Note"}
                  </h3>

                  {/* Content preview */}
                  {note.content && (
                    <p
                      className={cn(
                        "text-sm leading-relaxed mt-2 line-clamp-2 transition-colors duration-300",
                        isSelected
                          ? "text-gray-600"
                          : "text-gray-500 group-hover:text-gray-600"
                      )}
                    >
                      {truncateContent(note.content)}
                    </p>
                  )}
                </div>

                {/* More options button */}
                <button
                  className={cn(
                    "p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-200/50",
                    isSelected && "opacity-100"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle more options
                  }}
                >
                  <MoreHorizontal className="size-4 text-gray-400" />
                </button>
              </div>

              {/* Tags and metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 ml-11">
                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
                  {note.tags?.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-full border transition-all duration-300 font-medium",
                        isSelected
                          ? "bg-gradient-to-r from-blue-500/15 to-teal-500/15 text-blue-700 border-blue-200/50 shadow-sm"
                          : "bg-gray-100/80 text-gray-600 border-gray-200/50 group-hover:bg-blue-100/50 group-hover:text-blue-700 group-hover:border-blue-200/50"
                      )}
                    >
                      <Tag className="size-2.5 mr-1" />
                      {tag}
                    </Badge>
                  ))}

                  {note.tags?.length > 3 && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-full border transition-all duration-300 font-medium",
                        isSelected
                          ? "border-blue-300 text-blue-600 bg-blue-50/50"
                          : "border-gray-300 text-gray-500 group-hover:border-blue-300 group-hover:text-blue-600"
                      )}
                    >
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Timestamp */}
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors duration-300 font-medium px-2.5 py-1 rounded-full",
                    isSelected
                      ? "bg-white/80 text-gray-600 shadow-sm"
                      : "text-gray-500 group-hover:text-gray-600"
                  )}
                >
                  <Clock className="size-3" />
                  {formatDate(note.updatedAt)}
                </div>
              </div>

              {/* Progress indicator for selected note */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 animate-pulse" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
