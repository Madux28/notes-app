// DONE

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import {
  Plus,
  Search,
  Settings,
  NotebookIcon,
  Sparkles,
  Filter,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import NotesList from "./NotesList";
import NotePreview from "./NotePreview";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";

export default function NotesView() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notes = useQuery(
    api.notes.getNotes,
    user ? { userId: user.id, isArchived: false } : "skip"
  );

  const searchResults = useQuery(
    api.notes.searchNotes,
    user && searchTerm.trim()
      ? { userId: user.id, searchTerm: searchTerm.trim() }
      : "skip"
  );

  const displayNotes = searchTerm.trim() ? searchResults : notes;
  const selectedNote = displayNotes?.find(
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
    if (displayNotes?.length && !selectedNoteId && !isMobile) {
      setSelectedNoteId(displayNotes[0]._id);
    }
  }, [displayNotes, selectedNoteId, isMobile]);

  const handleCreateNew = () => {
    navigate("/new");
  };

  const handleNoteSelect = (noteId) => {
    if (isMobile) {
      navigate(`/note/${noteId}`);
    } else {
      setSelectedNoteId(noteId);
    }
  };

  const handleSearchFocus = () => {
    if (isMobile) {
      navigate("/search");
    }
  };

  const totalNotes = notes?.length || 0;
  const searchResultsCount = searchResults?.length || 0;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Notes List Panel */}
      <div className="w-full md:w-96 flex flex-col border-r border-gray-200/50 bg-white/70 backdrop-blur-sm relative z-10 shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white to-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-start justify-between mb-6">
            <div className="flex items-center gap-3 mb-4 w-full">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <NotebookIcon className="size-5 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-400 animate-pulse" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  All Notes
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {totalNotes} notes • Organized thoughts
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                size="sm"
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300 transform hover:scale-105 gap-2"
              >
                <Plus className="size-4" />
                New Note
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/settings")}
                className="border-gray-300 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-300 group"
                title="Settings"
              >
                <Settings className="size-4 group-hover:rotate-90 transition-transform duration-500" />
              </Button>
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
              placeholder="Search by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                setIsSearchFocused(true);
                handleSearchFocus();
              }}
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

          {/* Search stats */}
          {searchTerm && (
            <div className="flex items-center gap-4 mt-3 px-1">
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {searchResultsCount} results
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="text-xs text-gray-500 hover:text-gray-700 h-6 px-2 rounded-lg"
              >
                Clear search
              </Button>
            </div>
          )}

          {/* Quick stats */}
          {!searchTerm && notes && (
            <div className="flex items-center gap-4 mt-3 px-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">{totalNotes} total</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="size-3" />
                <span>Active notes</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto bg-transparent">
          <NotesList
            notes={displayNotes || []}
            selectedNoteId={selectedNoteId}
            onNoteSelect={handleNoteSelect}
            loading={!displayNotes}
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
              {displayNotes?.length === 0 ? (
                <div className="text-center max-w-md mx-auto">
                  <div className="size-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <NotebookIcon className="size-10 text-gray-400" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-600 mb-3">
                    {searchTerm ? "No matching notes" : "No notes yet"}
                  </h3>

                  <p className="text-gray-500 leading-relaxed mb-6">
                    {searchTerm
                      ? "No notes match your search. Try different keywords or check your archived notes."
                      : "Welcome to your digital notebook! Create your first note to capture your thoughts and ideas."}
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
                      onClick={handleCreateNew}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg transition-all duration-300 group"
                    >
                      <Plus className="size-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Create First Note
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center max-w-sm mx-auto">
                  <div className="size-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <NotebookIcon className="size-8 text-blue-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Select a Note
                  </h3>

                  <p className="text-gray-500 text-sm mb-4">
                    Choose a note from the list to view its contents here
                  </p>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Zap className="size-3" />
                    <span>Tip: Use Ctrl+1 to quickly navigate here</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
