import React from "react";
import { Info, Target, Code2, Mail, Link as LinkIcon, CheckCircle2, UserCheck, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/30 bg-[#0077B6]/10 px-4 py-1.5 text-xs font-semibold text-[#0077B6] mb-3">
            <Info className="h-3.5 w-3.5" />
            <span>About ResumeFit</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Bridging Job Seekers & Hiring Expectations
          </h1>
          <p className="mt-2 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Empowering candidates with AI insights to optimize their resumes and demonstrate real technical knowledge.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* Mission & Purpose */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 border-slate-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077B6]/20 text-[#0077B6] mb-4">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                ResumeFit was created to eliminate unfair rejections caused by keyword mismatches. Many qualified candidates are turned away simply because their resumes fail ATS filters. ResumeFit offers a clear, actionable roadmap to fix alignment gaps.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 border-slate-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077B6]/20 text-[#0077B6] mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Why ResumeFit?</h3>
              <ul className="space-y-2.5 text-sm text-slate-300">
                {[
                  "Real-time resume & PDF skill extraction",
                  "Deep skill gap detection for recruiter role requirements",
                  "Interactive 25-Question technical quiz generator",
                  "50/50 weighted holistic compatibility scoring",
                  "100% privacy-focused in-memory processing",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0077B6] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Developer Details */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 border-[#0077B6]/30 bg-gradient-to-b from-[#0077B6]/10 to-slate-900/90 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0077B6] text-white font-black text-xl shadow-lg shadow-[#0077B6]/30">
                    SM
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Sumit Mali</h3>
                    <p className="text-xs text-[#0077B6] font-semibold">
                      Full-Stack Developer & Creator of ResumeFit
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Hello! I am <strong>Sumit Mali</strong>. I designed and built <strong>ResumeFit</strong> as part of my <strong>AI Lab Coursework Project</strong>.
                  My goal was to combine AI-powered document intelligence with modern full-stack web development to create a seamless, high-value tool for job seekers.
                </p>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 mb-6 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#0077B6]" />
                    <span><strong>Project Purpose:</strong> AI Lab Coursework & Portfolio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-[#0077B6]" />
                    <span><strong>Tech Stack:</strong> React 19, Vite, Node.js, Express, MongoDB, Tailwind CSS, Llama 3.1 AI</span>
                  </div>
                </div>
              </div>

              {/* Contact Links */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:sumitmali7799@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 border border-slate-800 hover:border-[#0077B6] hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-rose-400" />
                  <span>sumitmali7799@gmail.com</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/sumitmali/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 border border-slate-800 hover:border-[#0077B6] hover:text-white transition-colors"
                >
                  <LinkIcon className="h-4 w-4 text-cyan-400" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
