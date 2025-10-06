// DONE

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import {
  Archive,
  Search,
  NotebookIcon,
  ArrowLeft,
  Filter,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NotesList from "./NotesList";
import NotePreview from "./NotePreview";
import { api } from "../../convex/_generated/api";
// Add missing cn utility import
import { cn } from "@/lib/utils";

export default function ArchiveView() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notes = useQuery(
    api.notes.getNotes,
    user ? { userId: user.id, isArchived: true } : "skip"
  );

  const filteredNotes = notes?.filter((note) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const selectedNote = filteredNotes?.find(
    (note) => note._id === selectedNoteId
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Auto-select first note if none selected and notes available
    if (filteredNotes?.length && !selectedNoteId && !isMobile) {
      setSelectedNoteId(filteredNotes[0]._id);
    }
  }, [filteredNotes, selectedNoteId, isMobile]);

  const handleNoteSelect = (noteId) => {
    if (isMobile) {
      navigate(`/note/${noteId}`);
    } else {
      setSelectedNoteId(noteId);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Notes List Panel */}
      <div className="w-full md:w-96 flex flex-col border-r border-gray-200/50 bg-white/70 backdrop-blur-sm relative z-10 shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white to-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-xl hover:bg-gray-100 transition-all duration-300 group"
            >
              <ArrowLeft className="size-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-1 transition-transform duration-300" />
            </Button>

            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                  <Archive className="size-5 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Archive
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {filteredNotes?.length || 0} archived notes
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative group">
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-xl transition-opacity duration-300",
                isSearchFocused
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-50"
              )}
            />

            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4 text-gray-400 transition-colors duration-300 group-hover:text-blue-500 z-10" />

            <Input
              placeholder="Search archived notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-11 pr-4 py-3 border-2 border-gray-200/80 bg-white/80 backdrop-blur-sm rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 shadow-sm group-hover:border-gray-300 group-hover:shadow-md"
            />

            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 size-7 rounded-lg hover:bg-gray-200/50 transition-all duration-300"
              >
                <div className="size-3.5 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">×</span>
                </div>
              </Button>
            )}
          </div>

          {/* Stats */}
          {notes && (
            <div className="flex items-center gap-4 mt-4 px-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{notes.length} total</span>
              </div>

              {searchTerm && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">
                    {filteredNotes?.length} results
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto bg-transparent">
          <NotesList
            notes={filteredNotes || []}
            selectedNoteId={selectedNoteId}
            onNoteSelect={handleNoteSelect}
            loading={!filteredNotes}
          />
        </div>
      </div>

      {/* Note Preview Panel - Desktop Only */}
      {!isMobile && (
        <div className="flex-1 min-w-0 bg-transparent relative z-10">
          {selectedNote ? (
            <div className="h-full animate-in fade-in duration-500">
              <NotePreview
                note={selectedNote}
                onEdit={() => navigate(`/note/${selectedNote._id}`)}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 p-8">
              {filteredNotes?.length === 0 ? (
                <div className="text-center max-w-md mx-auto">
                  <div className="size-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Archive className="size-10 text-gray-400" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-600 mb-3">
                    {searchTerm ? "No matching notes" : "Archive is empty"}
                  </h3>

                  <p className="text-gray-500 leading-relaxed mb-6">
                    {searchTerm
                      ? "No archived notes match your search. Try different keywords."
                      : "Notes you archive will appear here. Keep your workspace organized by moving completed notes to archive."}
                  </p>

                  {searchTerm ? (
                    <Button
                      onClick={() => setSearchTerm("")}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg transition-all duration-300"
                    >
                      Clear Search
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg transition-all duration-300 group"
                    >
                      <NotebookIcon className="size-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Back to Notes
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center max-w-sm mx-auto">
                  <div className="size-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Archive className="size-8 text-blue-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Select a Note
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Choose an archived note from the list to view its contents
                    here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
