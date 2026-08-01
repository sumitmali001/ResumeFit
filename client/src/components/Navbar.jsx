import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, Menu, X, FileSearch, Sparkles, HelpCircle, Info, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Home", icon: Sparkles },
    { path: "/analyzer", label: "Analyzer", icon: FileSearch },
    { path: "/history", label: "History", icon: History },
    { path: "/help", label: "Help", icon: HelpCircle },
    { path: "/about", label: "About", icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] p-0.5 shadow-lg shadow-[#0077B6]/20 transition-transform group-hover:scale-105">
            <img
              src="/WebsiteLogo.png"
              alt="ResumeFit Logo"
              className="h-full w-full rounded-[10px] object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="text-xl font-bold tracking-tight text-white brand-text">
            Resume<span className="text-[#0077B6]">Fit</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/60 p-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-white font-semibold active-nav-link"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 inactive-nav-link"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 rounded-full bg-[#0077B6]/20 border border-[#0077B6]/40 active-nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-4 w-4 relative z-10 ${active ? "text-[#0077B6]" : ""}`} />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-colors hover:border-slate-700 hover:text-white theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
          </button>

          <button
            onClick={() => navigate("/analyzer")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0077B6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0077B6]/25 transition-all hover:bg-[#0096C7] hover:shadow-[#0077B6]/40 active:scale-95 btn-primary"
          >
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white">Get Started</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 theme-toggle-btn"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white theme-toggle-btn"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur-xl mobile-drawer"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      active
                        ? "bg-[#0077B6]/20 text-white font-semibold border border-[#0077B6]/30 active-mobile-link"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white inactive-mobile-link"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-[#0077B6]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/analyzer");
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0077B6] py-3 font-semibold text-white shadow-lg shadow-[#0077B6]/30 btn-primary"
              >
                <Sparkles className="h-5 w-5 text-white" />
                <span className="text-white">Launch Resume Analyzer</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
