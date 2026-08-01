import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, FileText, CheckCircle, Brain, ArrowRight, ShieldCheck, Target, Zap } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Intelligent ATS AI Engine",
      description: "Uses Llama 3.1 LLM prompt engineering to evaluate your resume against real-world recruiter expectations.",
    },
    {
      icon: Target,
      title: "Skill Gap Detection",
      description: "Identifies essential technical skills missing from your resume for specific job roles in seconds.",
    },
    {
      icon: Zap,
      title: "25-Q Technical Assessment",
      description: "Optionally test your practical domain knowledge with dynamically generated multiple-choice quizzes.",
    },
    {
      icon: ShieldCheck,
      title: "100% Privacy Protected",
      description: "Your document is processed securely in-memory. We respect user privacy and never share your data.",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-12 lg:py-20">
      
      {/* Background glow blobs */}
      <div className="bg-glow-blob top-10 left-1/2 -translate-x-1/2 opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <div className="mx-auto max-w-4xl text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/30 bg-[#0077B6]/10 px-4 py-1.5 text-xs font-semibold text-[#0077B6] mb-6 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Resume Optimization Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.15]"
          >
            Make Your Resume <br className="hidden sm:inline" />
            <span className="gradient-text">Job-Winning</span> with Intelligent{" "}
            <span className="text-[#0077B6]">AI Analysis</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-slate-300 sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed"
          >
            ResumeFit helps you optimize your resume with real-time AI insights.
            Discover your <strong className="text-white font-semibold">strengths</strong>, uncover hidden{" "}
            <strong className="text-white font-semibold">skill gaps</strong>, and boost your callback rate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/analyzer")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0077B6] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#0077B6]/30 transition-all duration-200 hover:bg-[#0096C7] hover:scale-[1.02] active:scale-95"
            >
              <span>Resume Analyzer</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => navigate("/help")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white"
            >
              <span>How It Works</span>
            </button>
          </motion.div>

        </div>

        {/* HERO GRAPHIC CARDS / DEMO PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Match score floating */}
          <div className="glass-card p-6 flex flex-col justify-between hover:border-[#0077B6]/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/80 text-cyan-400">
                <FileText className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                Live Parsing
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white">Instant PDF Extract</h3>
              <p className="mt-1 text-sm text-slate-400">
                Directly extracts technical skills from PDF structure using advanced regex and LLM parsers.
              </p>
            </div>
          </div>

          {/* Card 2: Main score highlight */}
          <div className="glass-card p-6 flex flex-col justify-between border-[#0077B6]/30 bg-gradient-to-b from-[#0077B6]/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077B6]/20 text-[#0077B6]">
                <Brain className="h-5 w-5" />
              </div>
              <div className="flex items-baseline gap-1 text-2xl font-extrabold text-[#0077B6]">
                94<span>%</span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white">AI Match Heuristics</h3>
              <p className="mt-1 text-sm text-slate-400">
                Compares candidate skillset against recruiter benchmarks for tailored match percentages.
              </p>
            </div>
          </div>

          {/* Card 3: Advanced Quiz Mode */}
          <div className="glass-card p-6 flex flex-col justify-between hover:border-[#0077B6]/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/80 text-purple-400">
                <Zap className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20">
                50/50 Holistic
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white">Advanced Assessment</h3>
              <p className="mt-1 text-sm text-slate-400">
                Synthesizes resume analysis with a 25-question technical quiz for weighted scoring.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FEATURES GRID */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Engineered for Career Growth
            </h2>
            <p className="mt-3 text-slate-400">
              Everything you need to transform your resume into an interview invitation machine.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-card p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0077B6]/15 text-[#0077B6] mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
