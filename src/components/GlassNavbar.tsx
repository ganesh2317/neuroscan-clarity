import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Upload", path: "/upload" },
  { label: "Results", path: "/results" },
  { label: "Architecture", path: "/architecture" },
  { label: "Dataset", path: "/dataset" },
  { label: "About", path: "/about" },
];

export function GlassNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center group-hover:glow-primary transition-shadow duration-300">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground">
              Neuro<span className="text-primary">Scan</span> AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link to="/upload" className="btn-glass-primary text-sm">
              Get Started
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/upload" onClick={() => setMobileOpen(false)} className="block btn-glass-primary text-sm text-center mt-2">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
