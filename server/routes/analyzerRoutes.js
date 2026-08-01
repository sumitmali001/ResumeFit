import express from "express";
import {
  extractPdf,
  analyzeSkills,
  analyzeJobRole,
  analyzeCompatibility,
  generateQuestions,
  saveAnalysis,
  getHistory,
  getAnalysisById,
  deleteAnalysis,
} from "../controllers/analyzerController.js";
import { uploadSinglePdf } from "../middleware/uploadMiddleware.js";
import {
  validateJobRole,
  validateCompatibility,
  validateSaveAnalysis,
} from "../middleware/validatorMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Resume upload & PDF parsing
router.post("/extract", uploadSinglePdf, extractPdf);

// AI Skill extraction & role analysis
router.post("/analyze", analyzeSkills);
router.post("/analyze-job-role", validateJobRole, analyzeJobRole);
router.post("/analyze-compatibility", validateCompatibility, analyzeCompatibility);

// Quiz generation
router.post("/generate-questions", validateJobRole, generateQuestions);

// History routes (MongoDB persistence)
router.post("/history", protect, validateSaveAnalysis, saveAnalysis);
router.get("/history", protect, getHistory);
router.get("/history/:id", protect, getAnalysisById);
router.delete("/history/:id", protect, deleteAnalysis);

export default router;
