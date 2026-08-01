import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../contexts/AnalysisContext";
import { Upload, FileText, CheckCircle2, ArrowRight, Zap, Shield, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    fileName,
    resumeSkills,
    jobRole,
    setJobRole,
    isExtracting,
    isAnalyzing,
    isQuizLoading,
    uploadResume,
    executeNormalAnalysis,
    startAdvancedAnalysis,
  } = useAnalysis();

  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadResume(e.target.files[0]);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadResume(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleNormalClick = async () => {
    if (!resumeSkills && !isExtracting) {
      toast.error("Please upload your PDF resume first.");
      return;
    }
    if (!jobRole.trim()) {
      toast.error("Please enter a target job role.");
      return;
    }

    const res = await executeNormalAnalysis(jobRole);
    if (res) {
      navigate("/analysis");
    }
  };

  const handleAdvancedClick = async () => {
    if (!resumeSkills && !isExtracting) {
      toast.error("Please upload your PDF resume first.");
      return;
    }
    if (!jobRole.trim()) {
      toast.error("Please enter a target job role.");
      return;
    }

    const success = await startAdvancedAnalysis(jobRole);
    if (success) {
      navigate("/quiz");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/30 bg-[#0077B6]/10 px-4 py-1.5 text-xs font-semibold text-[#0077B6] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Step 1: Upload & Role Specification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Is Your Resume Ready for Top Companies?
          </h1>
          <p className="mt-2 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Upload your resume and receive instant AI-powered insights tailored to your target job role.
          </p>
        </div>

        {/* Upload Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Guidance & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="glass-card p-6 border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0077B6]" />
                <span>Resume Analyzer</span>
              </h3>
              
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0077B6]/20 text-[#0077B6] font-bold text-xs">
                    1
                  </div>
                  <p>
                    <strong className="text-white">PDF Format:</strong> Ensure your document is a readable PDF file under 5MB.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0077B6]/20 text-[#0077B6] font-bold text-xs">
                    2
                  </div>
                  <p>
                    <strong className="text-white">Target Job Role:</strong> Specify the exact title (e.g. "Frontend Developer", "DevOps Engineer").
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0077B6]/20 text-[#0077B6] font-bold text-xs">
                    3
                  </div>
                  <p>
                    <strong className="text-white">Analysis Choice:</strong> Choose standard AI match or Advanced 25-Q Quiz mode.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  100% Privacy Protected
                </span>
                <span>No File Storage</span>
              </div>
            </div>

            {/* Quick role suggestions */}
            <div className="mt-6 glass-card p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Popular Target Roles
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Frontend Developer",
                  "Full Stack Developer",
                  "Backend Engineer",
                  "Data Scientist",
                  "DevOps Engineer",
                  "React Developer",
                ].map((role) => (
                  <button
                    key={role}
                    onClick={() => setJobRole(role)}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 hover:border-[#0077B6]/50 hover:text-white transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Upload Box & Role Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Upload Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`glass-card relative flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
                isDragOver
                  ? "border-[#0077B6] bg-[#0077B6]/10 scale-[1.01]"
                  : resumeSkills
                  ? "border-emerald-500/40 bg-emerald-950/10"
                  : "border-slate-800 hover:border-[#0077B6]/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {isExtracting ? (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="h-10 w-10 animate-spin text-[#0077B6]" />
                  <p className="mt-3 text-sm font-semibold text-slate-200">
                    Parsing PDF text & analyzing skills...
                  </p>
                </div>
              ) : resumeSkills ? (
                <div className="flex flex-col items-center py-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-3">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="text-base font-bold text-white">{fileName}</h4>
                  <p className="mt-1 text-xs text-emerald-400 font-medium">
                    Skills detected! Ready for analysis.
                  </p>
                  <span className="mt-3 text-xs text-slate-400 underline hover:text-slate-200">
                    Click to replace PDF
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0077B6]/20 text-[#0077B6] mb-4">
                    <Upload className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Click or Drag PDF Resume here
                  </h4>
                  <p className="mt-1 text-xs text-slate-400">
                    PDF files only • Maximum file size 5MB
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0077B6] px-4 py-2 text-xs font-bold text-white shadow-md">
                    Select PDF Document
                  </span>
                </div>
              )}
            </div>

            {/* Job Role Section */}
            <div className="glass-card p-6">
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Enter Target Job Role
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6] transition-colors"
              />

              {/* Action buttons */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleNormalClick}
                  disabled={isAnalyzing || isQuizLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0077B6] py-3.5 px-4 font-bold text-white shadow-lg shadow-[#0077B6]/25 transition-all hover:bg-[#0096C7] disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleAdvancedClick}
                  disabled={isAnalyzing || isQuizLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-950/40 py-3.5 px-4 font-bold text-purple-300 shadow-lg hover:bg-purple-900/50 hover:text-white transition-all disabled:opacity-50"
                >
                  {isQuizLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating 25-Q...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 text-purple-400" />
                      <span>Advanced Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
