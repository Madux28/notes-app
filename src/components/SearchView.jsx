// DONE

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Search, ArrowLeft, NotebookIcon, Sparkles, Filter, Zap, X, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotesList from "./NotesList";
import NotePreview from "./NotePreview";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";

export default function SearchView() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = useQuery(
    api.notes.searchNotes,
    user && searchTerm.trim()
      ? { userId: user.id, searchTerm: searchTerm.trim() }
      : "skip"
  );

  const selectedNote = searchResults?.find(
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
    if (searchResults?.length && !selectedNoteId && !isMobile) {
      setSelectedNoteId(searchResults[0]._id);
    }
  }, [searchResults, selectedNoteId, isMobile]);

  const handleNoteSelect = (noteId) => {
    if (isMobile) {
      navigate(`/note/${noteId}`);
    } else {
      setSelectedNoteId(noteId);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedNoteId(null);
  };

  const getSearchStats = () => {
    if (!searchResults) return null;
    
    const totalWords = searchResults.reduce((acc, note) => {
      return acc + (note.content?.split(' ').length || 0);
    }, 0);
    
    const totalTags = searchResults.reduce((acc, note) => {
      return acc + (note.tags?.length || 0);
    }, 0);

    return { totalWords, totalTags };
  };

  const stats = getSearchStats();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Search Panel */}
      <div className="w-full md:w-96 flex flex-col border-r border-gray-200/50 bg-white/70 backdrop-blur-sm relative z-10 shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white to-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/")}
                className="rounded-xl hover:bg-gray-100/80 transition-all duration-300 group"
              >
                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </Button>
            )}
            
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Search className="size-5 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Search
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Find anything in your notes
                </p>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative group">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl transition-opacity duration-300",
              isSearchFocused ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            )} />
            
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4 text-gray-400 transition-colors duration-300 group-hover:text-purple-500 z-10" />
            
            <Input
              placeholder="Search by title, content, tags, or phrases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-11 pr-12 py-3 border-2 border-gray-200/80 bg-white/80 backdrop-blur-sm rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200/50 transition-all duration-300 shadow-sm group-hover:border-gray-300 group-hover:shadow-md"
              autoFocus
            />
            
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 size-7 rounded-lg hover:bg-gray-200/50 transition-all duration-300"
              >
                <X className="size-4 text-gray-400" />
              </Button>
            )}
          </div>

          {/* Search Stats */}
          {searchTerm.trim() && searchResults && (
            <div className="flex items-center justify-between mt-4 px-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{searchResults.length} results</span>
                </div>
                
                {stats && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Filter className="size-3" />
                      <span>{stats.totalWords} words</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="size-3" />
                      <span>{stats.totalTags} tags</span>
                    </div>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="text-xs text-gray-500 hover:text-gray-700 h-6 px-2 rounded-lg transition-colors duration-300"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto bg-transparent">
          {searchTerm.trim() ? (
            <NotesList
              notes={searchResults || []}
              selectedNoteId={selectedNoteId}
              onNoteSelect={handleNoteSelect}
              loading={searchTerm.trim() && !searchResults}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
              <div className="size-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Search className="size-10 text-gray-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-600 mb-3">
                Discover Your Notes
              </h3>
              
              <p className="text-gray-500 leading-relaxed max-w-sm mb-6">
                Search through all your notes by title, content, tags, or any keywords to find exactly what you're looking for.
              </p>

              <div className="space-y-3 text-sm text-gray-500 text-left max-w-sm">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200/50">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <NotebookIcon className="size-3.5 text-blue-600" />
                  </div>
                  <span>Search by note titles</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200/50">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Zap className="size-3.5 text-green-600" />
                  </div>
                  <span>Find text within note content</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200/50">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <TrendingUp className="size-3.5 text-purple-600" />
                  </div>
                  <span>Filter by tags and categories</span>
                </div>
              </div>
            </div>
          )}
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
              {searchTerm.trim() ? (
                <div className="text-center max-w-md mx-auto">
                  <div className="size-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Search className="size-8 text-purple-400" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Select a Result
                  </h3>
                  
                  <p className="text-gray-500 text-sm">
                    Choose a search result from the list to view the full note content here
                  </p>
                </div>
              ) : (
                <div className="text-center max-w-sm mx-auto">
                  <div className="size-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Sparkles className="size-8 text-blue-400" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Ready to Search
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-4">
                    Enter your search terms to find relevant notes across your entire collection
                  </p>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Zap className="size-3" />
                    <span>Tip: Use Ctrl+3 to quickly open search</span>
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