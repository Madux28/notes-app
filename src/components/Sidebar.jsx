// DONE

import { useNavigate, useLocation } from "react-router-dom";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import {
  NotebookIcon,
  Archive,
  Tag,
  LogOut,
  Settings,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
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
    { path: "/", icon: NotebookIcon, label: "All Notes", shortcut: "Ctrl+1" },
    {
      path: "/archived",
      icon: Archive,
      label: "Archived Notes",
      shortcut: "Ctrl+2",
    },
    {
      path: "/search",
      icon: Search,
      label: "Search Notes",
      shortcut: "Ctrl+3",
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Settings",
      shortcut: "Ctrl+4",
    },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800/50 flex flex-col h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-gray-800/50 relative z-10">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="size-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-teal-500/25 transition-all duration-300 group-hover:scale-105">
              <NotebookIcon className="size-5 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              Notes
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              Organize your thoughts
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-auto pb-24 relative z-10">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 relative overflow-hidden group transition-all duration-300",
                  active
                    ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-white border-l-2 border-teal-500 shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50 border-l-2 border-transparent"
                )}
                onMouseEnter={() => setActiveHover(item.path)}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => navigate(item.path)}
                title={`${item.label} (${item.shortcut})`}
              >
                {/* Hover effect */}
                {activeHover === item.path && !active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-transparent animate-pulse" />
                )}

                {/* Icon with animation */}
                <div
                  className={cn(
                    "transition-transform duration-300",
                    active ? "scale-110 text-teal-400" : "group-hover:scale-105"
                  )}
                >
                  <Icon className="size-4" />
                </div>

                <span className="font-medium">{item.label}</span>

                {/* Shortcut badge */}
                <span
                  className={cn(
                    "ml-auto text-xs px-2 py-1 rounded transition-all duration-300",
                    active
                      ? "bg-teal-500/20 text-teal-300"
                      : "bg-gray-800/50 text-gray-500 group-hover:bg-gray-700/50 group-hover:text-gray-300"
                  )}
                >
                  {item.shortcut}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Tags section */}
        {tags && tags.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 px-3 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-teal-500 to-blue-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Tags
              </h3>
              <span className="ml-auto text-xs bg-gray-800/50 text-gray-500 px-2 py-1 rounded-full">
                {tags.length}
              </span>
            </div>

            <div className="space-y-1">
              {tags.map((tag) => {
                const tagActive = location.pathname === `/tags/${tag}`;

                return (
                  <Button
                    key={tag}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 h-9 text-xs relative overflow-hidden group transition-all duration-300",
                      tagActive
                        ? "bg-teal-500/20 text-teal-300 border-l-2 border-teal-500"
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30 border-l-2 border-transparent"
                    )}
                    onClick={() => navigate(`/tags/${tag}`)}
                  >
                    {/* Animated tag icon */}
                    <Tag
                      className={cn(
                        "size-3 transition-all duration-300",
                        tagActive
                          ? "text-teal-400 scale-110"
                          : "group-hover:scale-105"
                      )}
                    />

                    <span className="truncate flex-1 text-left">{tag}</span>

                    {/* Hover effect */}
                    {!tagActive && (
                      <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-1 h-1 bg-teal-400 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 z-20 w-full border-t border-gray-800/50 bg-gradient-to-t from-gray-900 to-gray-900/95 backdrop-blur-sm">
        <div className="p-4">
          {/* User info */}
          <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="relative">
              <div className="size-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="size-4 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
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
              className="w-full cursor-pointer border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 group"
              size="sm"
            >
              <LogOut className="size-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
