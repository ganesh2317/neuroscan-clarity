import { Link, useLocation } from "react-router-dom";
import { Brain, Upload, Cpu, BarChart3, Layers, Database, Info, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: Cpu, label: "Processing", path: "/processing" },
  { icon: BarChart3, label: "Results", path: "/results" },
  { icon: Layers, label: "Architecture", path: "/architecture" },
  { icon: Database, label: "Dataset", path: "/dataset" },
  { icon: Info, label: "About", path: "/about" },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen glass-sidebar z-40 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-56"
    )}>
      <div className="h-16 flex items-center px-4 gap-2 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && <span className="font-heading font-bold text-sm">NeuroScan AI</span>}
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              location.pathname === item.path
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-white/10 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
