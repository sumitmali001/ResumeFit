import { extractTextFromPDFBuffer } from "../services/pdfService.js";
import {
  extractSkillsFromResume,
  extractSkillsFromJobRole,
  analyzeCompatibility as analyzeCompatibilityAI,
  generateQuestions as generateQuestionsAI,
} from "../services/aiService.js";
import { Analysis } from "../models/Analysis.js";

/**
 * Handle PDF resume upload & text extraction
 * @route POST /api/extract
 */
export const extractPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded. Please upload a valid PDF resume." });
    }

    const text = await extractTextFromPDFBuffer(req.file.buffer);
    res.json({
      text,
      fileName: req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Extract skills from resume text
 * @route POST /api/analyze
 */
export const analyzeSkills = async (req, res, next) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "No resume text provided" });
    }

    const skills = await extractSkillsFromResume(resumeText);
    res.json({ skills });
  } catch (err) {
    next(err);
  }
};

/**
 * Extract required skills for job role
 * @route POST /api/analyze-job-role
 */
export const analyzeJobRole = async (req, res, next) => {
  try {
    const { jobRole } = req.body;
    if (!jobRole) {
      return res.status(400).json({ error: "No job role provided" });
    }

    const requiredSkills = await extractSkillsFromJobRole(jobRole);
    res.json({ requiredSkills });
  } catch (err) {
    next(err);
  }
};

/**
 * Analyze compatibility between resume skills and job role skills
 * @route POST /api/analyze-compatibility
 */
export const analyzeCompatibility = async (req, res, next) => {
  try {
    const { resumeSkills, requiredSkills } = req.body;

    const result = await analyzeCompatibilityAI(resumeSkills || "", requiredSkills || "");
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Generate technical quiz questions for a given job role
 * @route POST /api/generate-questions
 */
export const generateQuestions = async (req, res, next) => {
  try {
    const { jobRole } = req.body;
    if (!jobRole) {
      return res.status(400).json({ error: "No job role provided" });
    }

    const questions = await generateQuestionsAI(jobRole);
    res.json({ questions });
  } catch (err) {
    next(err);
  }
};

/**
 * Save analysis to database
 * @route POST /api/history
 */
export const saveAnalysis = async (req, res, next) => {
  try {
    const {
      resumeFileName,
      jobRole,
      resumeSkills,
      requiredSkills,
      missingSkills,
      score,
      aiScore,
      quizScore,
      compatibility,
      suggestion,
      isAdvanced,
    } = req.body;

    const newAnalysis = new Analysis({
      resumeFileName: resumeFileName || "Resume.pdf",
      jobRole,
      resumeSkills: Array.isArray(resumeSkills) ? resumeSkills : (resumeSkills || "").split(",").map(s => s.trim()).filter(Boolean),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills || "").split(",").map(s => s.trim()).filter(Boolean),
      missingSkills: Array.isArray(missingSkills) ? missingSkills : [],
      score,
      aiScore: aiScore || score,
      quizScore: quizScore !== undefined ? quizScore : null,
      compatibility,
      suggestion: suggestion || "",
      isAdvanced: !!isAdvanced,
      userId: req.user ? req.user._id : null,
    });

    try {
      const saved = await newAnalysis.save();
      return res.status(201).json(saved);
    } catch (dbErr) {
      // If DB is offline/unavailable, return JSON payload formatted nicely anyway!
      return res.status(201).json({
        ...newAnalysis.toObject(),
        _id: "temp_" + Date.now(),
        savedLocal: true,
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Get analysis history
 * @route GET /api/history
 */
export const getHistory = async (req, res, next) => {
  try {
    let history = [];
    try {
      const query = req.user ? { userId: req.user._id } : {};
      history = await Analysis.find(query).sort({ createdAt: -1 }).limit(20);
    } catch (dbErr) {
      console.warn("[MongoDB Warning]: DB query failed or uninitialized, returning empty history array.");
    }
    res.json({ history });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single analysis by ID
 * @route GET /api/history/:id
 */
export const getAnalysisById = async (req, res, next) => {
  try {
    const item = await Analysis.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Analysis record not found" });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete analysis by ID
 * @route DELETE /api/history/:id
 */
export const deleteAnalysis = async (req, res, next) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ message: "Analysis record deleted successfully" });
  } catch (err) {
    next(err);
  }
};
