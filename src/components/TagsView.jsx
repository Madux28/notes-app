import { useNavigate, useLocation } from "react-router-dom";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { NotebookIcon, Archive, Tag, LogOut, Settings, Search, Sparkles, User, Zap, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  // eslint-disable-next-line no-unused-vars
  const [activeHover, setActiveHover] = useState(null);

  const tags = useQuery(
    api.notes.getUserTags,
    user ? { userId: user.id } : "skip"
  );

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { 
      path: "/", 
      icon: NotebookIcon, 
      label: "All Notes", 
      shortcut: "Ctrl+1",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      path: "/archived", 
      icon: Archive, 
      label: "Archive", 
      shortcut: "Ctrl+2",
      color: "from-amber-500 to-orange-500"
    },
    { 
      path: "/search", 
      icon: Search, 
      label: "Search", 
      shortcut: "Ctrl+3",
      color: "from-purple-500 to-pink-500"
    },
    { 
      path: "/settings", 
      icon: Settings, 
      label: "Settings", 
      shortcut: "Ctrl+4",
      color: "from-gray-600 to-gray-700"
    },
  ];

  return (
    <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800/50 flex flex-col h-screen relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-gray-800/50 relative z-10">
        <div 
          className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity duration-300" 
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <div className="size-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <NotebookIcon className="size-6 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-400" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              Notes.io
            </span>
            <p className="text-xs text-gray-500 mt-0.5">Organize your thoughts</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 overflow-auto pb-24 relative z-10">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 h-12 relative transition-all duration-300 rounded-lg border",
                  active
                    ? "bg-blue-500/10 text-white border-blue-500/30 shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50 border-transparent hover:border-gray-700"
                )}
                onMouseEnter={() => setActiveHover(item.path)}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => navigate(item.path)}
                title={`${item.label} (${item.shortcut})`}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  active 
                    ? "bg-gradient-to-br text-white" + " " + item.color
                    : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
                )}>
                  <Icon className="size-4" />
                </div>
                
                <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                
                <span className={cn(
                  "text-xs px-2 py-1 rounded font-mono transition-colors duration-300",
                  active 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-800 text-gray-500"
                )}>
                  {item.shortcut}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Tags section */}
        {tags && tags.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Folder className="size-4" />
                Tags
              </h3>
              <Badge variant="outline" className="ml-auto bg-gray-800 text-gray-500 text-xs">
                {tags.length}
              </Badge>
            </div>

            <div className="space-y-1">
              {tags.map((tag) => {
                const tagActive = location.pathname === `/tags/${tag}`;
                
                return (
                  <Button
                    key={tag}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-9 text-sm transition-all duration-300 rounded-lg",
                      tagActive
                        ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30 border border-transparent"
                    )}
                    onClick={() => navigate(`/tags/${tag}`)}
                  >
                    <Tag className={cn(
                      "size-3.5 transition-colors duration-300",
                      tagActive ? "text-blue-400" : "text-gray-500"
                    )} />
                    
                    <span className="truncate flex-1 text-left">{tag}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="size-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-300">Quick Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-gray-800/50 rounded-lg">
              <div className="text-gray-100 font-semibold">{tags?.length || 0}</div>
              <div className="text-gray-500">Tags</div>
            </div>
            <div className="text-center p-2 bg-gray-800/50 rounded-lg">
              <div className="text-gray-100 font-semibold">4</div>
              <div className="text-gray-500">Views</div>
            </div>
          </div>
        </div>
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 z-20 w-full border-t border-gray-800/50 bg-gray-900">
        <div className="p-4">
          {/* User info */}
          <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
            <div className="relative">
              <div className="size-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="size-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.fullName || user?.username}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <SignOutButton>
            <Button 
              variant="outline" 
              className="w-full cursor-pointer border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-300 rounded-lg group"
              size="sm"
            >
              <LogOut className="size-4 mr-2" />
              Sign Out
              <kbd className="ml-auto text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-400">
                ⌘Q
              </kbd>
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}