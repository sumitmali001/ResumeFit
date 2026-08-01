import React from "react";
import { HelpCircle, Upload, Target, Brain, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HelpPage() {
  const steps = [
    {
      num: "01",
      icon: Upload,
      title: "Upload Resume",
      description: "Upload your PDF resume securely. Our system parses plaintext technical sections instantly without saving your file to third-party databases.",
    },
    {
      num: "02",
      icon: Target,
      title: "Enter Target Role",
      description: "Specify the exact job title you are applying for (e.g. Frontend Developer). This allows the AI to tailor skill benchmark comparisons.",
    },
    {
      num: "03",
      icon: Brain,
      title: "AI Analysis",
      description: "Our LLM evaluates ATS compatibility, extracts your candidate skills, highlights missing skill gaps, and generates tailored match metrics.",
    },
    {
      num: "04",
      icon: TrendingUp,
      title: "Improve & Optimize",
      description: "Use actionable suggestions or take the optional 25-question technical quiz to produce a holistic score and refine your application strategy.",
    },
  ];

  const faqs = [
    {
      q: "Is my resume data kept private?",
      a: "Yes! 100% privacy protected. Resume files are parsed in temporary memory and are never sold or retained on permanent file storage.",
    },
    {
      q: "What file formats are supported?",
      a: "ResumeFit currently supports PDF documents up to 5MB file size.",
    },
    {
      q: "How does the Advanced 25-Question Assessment work?",
      a: "Advanced mode generates 25 dynamic technical questions tailored specifically to your target job role. Upon completion, your final score is computed using a 50% AI Match + 50% Quiz Performance formula.",
    },
    {
      q: "What AI model powers ResumeFit?",
      a: "ResumeFit utilizes Meta's Llama 3.1 8B Instruct model via serverless AI API inference for high-accuracy recruiter prompt evaluation.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/30 bg-[#0077B6]/10 px-4 py-1.5 text-xs font-semibold text-[#0077B6] mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help Center & Guidelines</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            How ResumeFit Works
          </h1>
          <p className="mt-2 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Understand the step-by-step optimization workflow to maximize your interview callbacks.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 flex flex-col justify-between border-slate-800 hover:border-[#0077B6]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-[#0077B6]/40">
                      {step.num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077B6]/20 text-[#0077B6]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="glass-card p-8 border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#0077B6]" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="text-base font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
