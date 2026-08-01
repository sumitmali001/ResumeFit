import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/60 bg-slate-950/80 py-8 text-sm text-slate-400 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span>ResumeFit &copy; {new Date().getFullYear()}</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> by Sumit Mali
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/" className="hover:text-[#0077B6] transition-colors">Home</Link>
            <Link to="/analyzer" className="hover:text-[#0077B6] transition-colors">Analyzer</Link>
            <Link to="/help" className="hover:text-[#0077B6] transition-colors">Help Center</Link>
            <Link to="/about" className="hover:text-[#0077B6] transition-colors">Developer & Mission</Link>
          </div>
        </div>

        {/* Guidance disclaimer aligned left under brand name */}
        <div className="pt-2">
          <p className="text-[11px] text-slate-500 italic max-w-2xl text-left">
            AI analysis is provided as guidance only and may not always accurately extract all skills or details from every resume format.
          </p>
        </div>

      </div>
    </footer>
  );
}
