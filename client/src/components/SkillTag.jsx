import React from "react";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function SkillTag({ name, variant = "detected" }) {
  const styles = {
    detected: "skill-tag-detected",
    required: "skill-tag-required",
    missing: "skill-tag-missing",
  };

  const icons = {
    detected: <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 dark:text-cyan-400 skill-icon-detected" />,
    required: <Sparkles className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400 skill-icon-required" />,
    missing: <AlertCircle className="h-3.5 w-3.5 text-rose-400 dark:text-rose-400 skill-icon-missing" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 ${styles[variant]}`}
    >
      {icons[variant]}
      <span>{name}</span>
    </span>
  );
}
