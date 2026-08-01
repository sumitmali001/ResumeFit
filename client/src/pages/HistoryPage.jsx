import React, { useState } from "react";
import { useAnalysis } from "../contexts/AnalysisContext";
import { History, Calendar, Trash2, ExternalLink, Zap, Award, Sparkles, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SkillTag from "../components/SkillTag";
import { deleteAnalysisApi } from "../services/api";
import { toast } from "sonner";

export default function HistoryPage() {
  const { history, fetchHistory, setFinalResult } = useAnalysis();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteAnalysisApi(id);
      toast.success("Analysis deleted from history.");
      fetchHistory();
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      toast.error("Failed to delete analysis.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/30 bg-[#0077B6]/10 px-3 py-1 text-xs font-semibold text-[#0077B6] mb-2">
              <History className="h-3.5 w-3.5" />
              <span>MongoDB Analysis History</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Past Resume Analyses
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Review saved reports, match scores, and skill gap insights over time.
            </p>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white">No Saved History Yet</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
              Run your first resume analysis or technical quiz to see saved reports stored here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {history.map((item, idx) => {
              const score = item.score;
              let scoreBadgeColor = "bg-[#0077B6]/20 text-[#0077B6] border-[#0077B6]/30";
              if (score < 50) scoreBadgeColor = "bg-rose-950/60 text-rose-400 border-rose-800/60";
              else if (score < 70) scoreBadgeColor = "bg-amber-950/60 text-amber-400 border-amber-800/60";
              else if (score >= 85) scoreBadgeColor = "bg-emerald-950/60 text-emerald-400 border-emerald-800/60";

              return (
                <motion.div
                  key={item._id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => setSelectedItem(item)}
                  className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:border-[#0077B6]/40 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${scoreBadgeColor} font-extrabold text-base`}>
                      {score}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-[#0077B6] transition-colors">
                          {item.jobRole}
                        </h3>
                        {item.isAdvanced && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                            <Zap className="h-3 w-3" />
                            Quiz Mode
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-400 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-slate-500" />
                          {item.resumeFileName || "Resume.pdf"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs text-slate-400 font-medium">
                      {item.compatibility}
                    </span>

                    <button
                      onClick={(e) => handleDelete(item._id, e)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border-slate-700"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedItem.jobRole} Analysis Report
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Saved on {new Date(selectedItem.createdAt || Date.now()).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-[#0077B6]">
                    {selectedItem.score}%
                  </span>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="ml-4 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <strong className="text-white block mb-1">Compatibility Status:</strong>
                  <p className="text-slate-400">{selectedItem.compatibility}</p>
                </div>

                <div>
                  <strong className="text-white block mb-1">Detected Resume Skills:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.resumeSkills?.map((s, idx) => (
                      <SkillTag key={idx} name={s} variant="detected" />
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="text-white block mb-1">Missing Skill Gaps:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.missingSkills?.length > 0 ? (
                      selectedItem.missingSkills.map((s, idx) => (
                        <SkillTag key={idx} name={s} variant="missing" />
                      ))
                    ) : (
                      <span className="text-xs text-emerald-400">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <strong className="text-white block mb-1">AI Recommendation:</strong>
                  <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {selectedItem.suggestion}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
