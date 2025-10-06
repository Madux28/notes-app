// DONE

import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Archive, Tag, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeHover, setActiveHover] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { key: "home", label: "Home", icon: Home, path: "/", color: "from-blue-500 to-cyan-500" },
    { key: "search", label: "Search", icon: Search, path: "/search", color: "from-purple-500 to-pink-500" },
    { key: "archived", label: "Archive", icon: Archive, path: "/archived", color: "from-amber-500 to-orange-500" },
    { key: "tags", label: "Tags", icon: Tag, path: "/tags", color: "from-green-500 to-teal-500" },
    { key: "settings", label: "Settings", icon: Settings, path: "/settings", color: "from-gray-600 to-gray-700" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl shadow-black/10 pb-safe">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-white/40 backdrop-blur-md" />
      
      <div className="grid grid-cols-5 gap-1 p-2 relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isHovered = activeHover === item.key;
          
          return (
            <Button
              key={item.key}
              variant="ghost"
              size="sm"
              className={cn(
                "flex-col gap-0.5 h-14 text-xs relative overflow-hidden transition-all duration-300 group",
                "hover:scale-105 active:scale-95",
                active 
                  ? "text-gray-900 font-semibold" 
                  : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setActiveHover(item.key)}
              onMouseLeave={() => setActiveHover(null)}
              onTouchStart={() => setActiveHover(item.key)}
              onTouchEnd={() => setActiveHover(null)}
            >
              {/* Active indicator bar */}
              {active && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              )}
              
              {/* Hover background effect */}
              {isHovered && !active && (
                <div className={cn(
                  "absolute inset-1 rounded-xl bg-gradient-to-br opacity-10 animate-pulse",
                  item.color
                )} />
              )}
              
              {/* Active background glow */}
              {active && (
                <div className={cn(
                  "absolute inset-0 rounded-xl bg-gradient-to-br opacity-5",
                  item.color
                )} />
              )}

              {/* Icon container with enhanced styling */}
              <div className={cn(
                "relative p-1.5 rounded-xl transition-all duration-300 group-active:scale-90",
                active 
                  ? cn("bg-gradient-to-br shadow-lg", item.color)
                  : "bg-transparent group-hover:bg-gray-100/80"
              )}>
                <Icon className={cn(
                  "w-4 h-4 transition-all duration-300",
                  active 
                    ? "text-white scale-110" 
                    : "text-gray-600 group-hover:scale-105 group-hover:text-gray-900"
                )} />
                
                {/* Sparkle effect for active state */}
                {active && mounted && (
                  <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-yellow-400 animate-ping" />
                )}
              </div>

              {/* Label with enhanced typography */}
              <span className={cn(
                "font-medium transition-all duration-300 relative",
                active && "bg-gradient-to-r bg-clip-text text-transparent",
                active && item.color.replace('from-', 'from-').replace('to-', 'to-')
              )}>
                {active ? item.label : item.label}
              </span>

              {/* Ripple effect on click */}
              <div className={cn(
                "absolute inset-0 rounded-xl bg-current opacity-0 transition-opacity duration-500",
                isHovered && "opacity-5"
              )} />
            </Button>
          );
        })}
      </div>

      {/* Subtle top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
    </div>
  );
}