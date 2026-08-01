import React, { createContext, useContext, useState, useEffect } from "react";
import {
  extractPdfApi,
  analyzeSkillsApi,
  analyzeJobRoleApi,
  analyzeCompatibilityApi,
  generateQuestionsApi,
  saveAnalysisApi,
  getHistoryApi,
} from "../services/api";
import { toast } from "sonner";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [resumeText, setResumeText] = useState("");
  const [resumeSkills, setResumeSkills] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  const [normalResult, setNormalResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [history, setHistory] = useState([]);

  // Fetch history on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getHistoryApi();
      if (data && data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.warn("Could not fetch analysis history:", err.message);
    }
  };

  // Upload and parse PDF resume
  const uploadResume = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Please upload a valid PDF document.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return false;
    }

    setIsExtracting(true);
    setFileName(file.name);
    setResumeFile(file);

    try {
      const extractRes = await extractPdfApi(file);
      const text = extractRes.text || "";
      setResumeText(text);

      // Instantly extract skills in background
      const skillsRes = await analyzeSkillsApi(text);
      setResumeSkills(skillsRes.skills || "");

      toast.success("Resume parsed and skills extracted successfully!");
      return true;
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error || "Failed to extract resume text.");
      return false;
    } finally {
      setIsExtracting(false);
    }
  };

  // Run normal analysis
  const executeNormalAnalysis = async (targetRole = jobRole) => {
    if (!resumeSkills) {
      toast.error("Please upload your PDF resume first.");
      return null;
    }
    const cleanRole = targetRole.trim();
    if (!cleanRole) {
      toast.error("Please enter your target job role.");
      return null;
    }

    setIsAnalyzing(true);
    try {
      // Step 1: Get job role required skills
      const roleRes = await analyzeJobRoleApi(cleanRole);
      const reqSkills = roleRes.requiredSkills || "";
      setRequiredSkills(reqSkills);

      // Step 2: Compatibility analysis
      const compRes = await analyzeCompatibilityApi(resumeSkills, reqSkills);
      setNormalResult(compRes);
      setFinalResult(compRes);

      // Auto-save to history
      saveToHistory({
        resumeFileName: fileName,
        jobRole: cleanRole,
        resumeSkills,
        requiredSkills: reqSkills,
        missingSkills: compRes.missingSkills,
        score: compRes.score,
        compatibility: compRes.compatibility,
        suggestion: compRes.suggestion,
        isAdvanced: false,
      });

      return compRes;
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Analysis failed. Please try again.");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Start Advanced Analysis (Quiz Mode)
  const startAdvancedAnalysis = async (targetRole = jobRole) => {
    if (!resumeSkills) {
      toast.error("Please upload your PDF resume first.");
      return false;
    }
    const cleanRole = targetRole.trim();
    if (!cleanRole) {
      toast.error("Please enter your target job role.");
      return false;
    }

    setIsQuizLoading(true);
    setQuizQuestions([]);

    // Run normal analysis in parallel background
    executeNormalAnalysis(cleanRole);

    try {
      const quizRes = await generateQuestionsApi(cleanRole);
      if (quizRes.questions && quizRes.questions.length > 0) {
        setQuizQuestions(quizRes.questions);
        toast.success(`Generated ${quizRes.questions.length} dynamic assessment questions!`);
        return true;
      } else {
        toast.error("Failed to generate assessment questions.");
        return false;
      }
    } catch (err) {
      console.error("Quiz error:", err);
      toast.error("Error generating technical assessment.");
      return false;
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Submit Quiz Answers & calculate 50/50 weighted score
  const submitQuizAnswers = (userAnswers) => {
    if (!quizQuestions.length) return null;

    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const quizScorePercentage = Math.round((correctCount / quizQuestions.length) * 100);
    const aiScore = normalResult ? normalResult.score : 70;
    
    // 50% AI compatibility score + 50% Quiz performance score
    const holisticScore = Math.round(aiScore * 0.5 + quizScorePercentage * 0.5);

    let compatibilityLabel = `Holistic Score: ${holisticScore}% (AI Match: ${aiScore}% | Tech Quiz: ${quizScorePercentage}%)`;
    if (holisticScore >= 80) compatibilityLabel += " - Outstanding Candidate!";
    else if (holisticScore >= 65) compatibilityLabel += " - Strong Candidate";

    const mergedResult = {
      ...(normalResult || {}),
      score: holisticScore,
      aiScore,
      quizScore: quizScorePercentage,
      compatibility: compatibilityLabel,
      isAdvanced: true,
    };

    setFinalResult(mergedResult);

    // Save holistic result to history
    saveToHistory({
      resumeFileName: fileName,
      jobRole: jobRole,
      resumeSkills,
      requiredSkills,
      missingSkills: mergedResult.missingSkills || [],
      score: holisticScore,
      aiScore,
      quizScore: quizScorePercentage,
      compatibility: compatibilityLabel,
      suggestion: mergedResult.suggestion || "",
      isAdvanced: true,
    });

    toast.success(`Assessment submitted! Score: ${holisticScore}%`);
    return mergedResult;
  };

  // Helper save to DB / local history state
  const saveToHistory = async (payload) => {
    try {
      const saved = await saveAnalysisApi(payload);
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      console.warn("Could not persist history to DB:", err.message);
    }
  };

  const resetAll = () => {
    setResumeFile(null);
    setFileName("No file selected");
    setResumeText("");
    setResumeSkills("");
    setJobRole("");
    setRequiredSkills("");
    setNormalResult(null);
    setFinalResult(null);
    setQuizQuestions([]);
  };

  return (
    <AnalysisContext.Provider
      value={{
        resumeFile,
        fileName,
        resumeText,
        resumeSkills,
        jobRole,
        setJobRole,
        requiredSkills,
        isExtracting,
        isAnalyzing,
        isQuizLoading,
        normalResult,
        finalResult,
        setFinalResult,
        quizQuestions,
        history,
        uploadResume,
        executeNormalAnalysis,
        startAdvancedAnalysis,
        submitQuizAnswers,
        fetchHistory,
        resetAll,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
