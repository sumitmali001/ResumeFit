import React from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../contexts/AnalysisContext";
import ScoreCircle from "../components/ScoreCircle";
import SkillTag from "../components/SkillTag";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileText,
  RotateCcw,
  History as HistoryIcon,
  Download,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { finalResult, fileName, jobRole, resumeSkills, requiredSkills } = useAnalysis();

  if (!finalResult) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="glass-card p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-400 mb-4" />
          <h2 className="text-2xl font-bold text-white">No Analysis Results Found</h2>
          <p className="mt-2 text-sm text-slate-400">
            Upload your resume and select a job role to generate your analysis.
          </p>
          <button
            onClick={() => navigate("/analyzer")}
            className="mt-6 rounded-xl bg-[#0077B6] px-6 py-2.5 font-bold text-white shadow-lg"
          >
            Go to Analyzer
          </button>
        </div>
      </div>
    );
  }

  const { score, compatibility, missingSkills = [], suggestion = "", isAdvanced, aiScore, quizScore } = finalResult;

  const detectedList = typeof resumeSkills === "string"
    ? resumeSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : Array.isArray(resumeSkills) ? resumeSkills : [];

  const requiredList = typeof requiredSkills === "string"
    ? requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : Array.isArray(requiredSkills) ? requiredSkills : [];

  const handleCopySummary = () => {
    const summaryText = `ResumeFit Analysis Report:
Target Job Role: ${jobRole}
Overall Match Score: ${score}%
Compatibility Level: ${compatibility}
Detected Skills: ${detectedList.join(", ")}
Missing Skills: ${missingSkills.join(", ")}
Suggestions: ${suggestion}`;

    navigator.clipboard.writeText(summaryText);
    toast.success("Analysis report summary copied to clipboard!");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/30 bg-[#0077B6]/10 px-3 py-1 text-xs font-semibold text-[#0077B6] mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isAdvanced ? "Advanced Holistic Analysis" : "Standard AI Resume Evaluation"}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Analysis Results for <span className="text-[#0077B6]">{jobRole || "Target Role"}</span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Document: {fileName} • Evaluated using Llama 3.1 LLM
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span>Copy Report</span>
            </button>

            <button
              onClick={() => navigate("/analyzer")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0077B6] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0096C7] transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* MAIN DASHBOARD LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Score & Breakdown */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Score Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 flex flex-col items-center justify-center text-center border-[#0077B6]/30 bg-gradient-to-b from-[#0077B6]/10 to-slate-900/90"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Compatibility Score
              </h3>

              <ScoreCircle score={score} size={190} strokeWidth={15} />

              <div className="mt-6 w-full pt-4 border-t border-slate-800">
                <p className="text-sm font-semibold text-white">
                  {compatibility}
                </p>

                {isAdvanced && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400">AI Match:</span>{" "}
                      <strong className="text-cyan-400">{aiScore}%</strong>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400">Tech Quiz:</span>{" "}
                      <strong className="text-purple-400">{quizScore}%</strong>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Required Skills Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4 w-4 text-[#0077B6]" />
                <span>Required Core Skills</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {requiredList.length > 0 ? (
                  requiredList.map((skill, idx) => (
                    <SkillTag key={idx} name={skill} variant="required" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No skills specified</span>
                )}
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Detected Skills, Missing Skills, Suggestions */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Detected Skills */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="glass-card p-6 border-cyan-950/60"
            >
              <h3 className="text-sm font-bold text-white flex items-center justify-between mb-4">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  Detected Resume Skills
                </span>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                  {detectedList.length} Found
                </span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {detectedList.length > 0 ? (
                  detectedList.map((skill, idx) => (
                    <SkillTag key={idx} name={skill} variant="detected" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No detected skills extracted</span>
                )}
              </div>
            </motion.div>

            {/* Missing Skills */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass-card p-6 border-rose-950/60"
            >
              <h3 className="text-sm font-bold text-white flex items-center justify-between mb-4">
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  Missing Skill Gaps
                </span>
                <span className="text-xs font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/40">
                  {missingSkills.length} Missing
                </span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill, idx) => (
                    <SkillTag key={idx} name={skill} variant="missing" />
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Great job! No major missing skills identified.
                  </span>
                )}
              </div>
            </motion.div>

            {/* AI Improvement Suggestions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="glass-card p-6 border-amber-950/40 bg-gradient-to-r from-slate-900 to-amber-950/10"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>AI Actionable Suggestions</span>
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {suggestion || "Tailor your project descriptions to emphasize core skills required for this job role."}
              </p>
            </motion.div>

          </div>

        </div>

      </div>
    </div>
  );
}
