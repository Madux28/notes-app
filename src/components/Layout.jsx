// DONE

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import { Keyboard, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

export default function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showShortcutHint, setShowShortcutHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const shortcuts = {
          "1": { path: "/", action: "All Notes" },
          "2": { path: "/archived", action: "Archive" },
          "3": { path: "/search", action: "Search" },
          "4": { path: "/settings", action: "Settings" },
          "m": { path: "/new", action: "New Note" },
          "k": { path: null, action: "Shortcut Help" }
        };

        const shortcut = shortcuts[e.key];
        if (shortcut) {
          e.preventDefault();
          
          if (e.key === "k") {
            setShowShortcutHint(true);
            setTimeout(() => setShowShortcutHint(false), 3000);
            return;
          }

          navigate(shortcut.path);
          
          // Show subtle toast notification for navigation
          toast.success(`Navigated to ${shortcut.action}`, {
            duration: 1000,
            position: "top-right",
            icon: <Zap className="size-4 text-yellow-500" />
          });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/20 relative overflow-hidden">
        {/* Mobile background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-10 right-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-teal-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <main className="pb-20 relative z-10">{children}</main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Sidebar with enhanced styling */}
      <div className="relative z-20 shadow-2xl shadow-blue-500/10">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1 min-w-0 relative z-10 overflow-hidden">
        {/* Floating shortcut helper */}
        {showShortcutHint && (
          <div className="absolute top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl p-6 max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <Keyboard className="size-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Keyboard Shortcuts</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">All Notes</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-mono text-gray-700">Ctrl+1</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Archive</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-mono text-gray-700">Ctrl+2</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Search</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-mono text-gray-700">Ctrl+3</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Settings</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-mono text-gray-700">Ctrl+4</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Note</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-mono text-gray-700">Ctrl+M</kbd>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Press Ctrl+K anytime to show this help
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content with enhanced styling */}
        <div className="h-full bg-transparent backdrop-blur-sm">
          {children}
        </div>

        {/* Floating helper indicator */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => setShowShortcutHint(!showShortcutHint)}
            className="group relative p-3 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            title="Keyboard Shortcuts (Ctrl+K)"
          >
            <Keyboard className="size-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </button>
        </div>
      </main>
    </div>
  );
}