import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../contexts/AnalysisContext";
import { Zap, CheckCircle2, ArrowRight, Award, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";

export default function QuizPage() {
  const navigate = useNavigate();
  const { quizQuestions, jobRole, isQuizLoading, submitQuizAnswers } = useAnalysis();

  const [answers, setAnswers] = useState({});

  if (isQuizLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <LoadingSpinner message={`Generating 25 customized technical questions for ${jobRole || "your role"}...`} />
      </div>
    );
  }

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="glass-card p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-400 mb-4" />
          <h2 className="text-2xl font-bold text-white">No Questions Available</h2>
          <p className="mt-2 text-sm text-slate-400">
            Please start an advanced analysis from the Analyzer page to generate your role assessment.
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

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / quizQuestions.length) * 100);

  const handleOptionSelect = (qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  const handleSubmit = () => {
    if (answeredCount < quizQuestions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${quizQuestions.length} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    const result = submitQuizAnswers(answers);
    if (result) {
      navigate("/analysis");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Quiz Header */}
      <div className="glass-card p-6 mb-8 border-purple-500/30 bg-gradient-to-r from-purple-950/30 to-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 mb-2">
              <Zap className="h-3.5 w-3.5" />
              <span>Advanced Technical Assessment</span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {jobRole || "Job Role"} Assessment
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Answer the 25 technical questions below to measure your practical knowledge.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Progress
            </span>
            <span className="text-xl font-extrabold text-purple-400">
              {answeredCount} / {quizQuestions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-[#0077B6]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {quizQuestions.map((q, qIndex) => {
          const selectedOpt = answers[qIndex];

          return (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(qIndex * 0.03, 0.5) }}
              className={`glass-card p-6 transition-all ${
                selectedOpt ? "border-purple-500/40 bg-slate-900/90" : "border-slate-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-950/80 font-bold text-xs text-purple-300 border border-purple-800/40">
                  {qIndex + 1}
                </span>
                <h3 className="text-base font-semibold text-white leading-relaxed">
                  {q.question}
                </h3>
              </div>

              {/* Options */}
              <div className="mt-4 grid grid-cols-1 gap-2.5 pl-10">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOpt === opt;
                  return (
                    <label
                      key={optIdx}
                      onClick={() => handleOptionSelect(qIndex, opt)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm font-medium cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "border-purple-500 bg-purple-950/60 text-white shadow-md shadow-purple-900/20"
                          : "border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-700 bg-slate-900"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Submit Sticky / Bottom Container */}
      <div className="mt-10 mb-12 text-center">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-[#0077B6] px-10 py-4 text-base font-bold text-white shadow-xl shadow-purple-900/30 transition-all hover:scale-105 active:scale-95"
        >
          <Award className="h-5 w-5" />
          <span>Submit Assessment Answers</span>
        </button>
      </div>

    </div>
  );
}
