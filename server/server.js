import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import multer from "multer";
import pdf from "pdf-parse";
import {
  extractSkillsFromResume,
  extractSkillsFromJobRole,
  analyzeCompatibility,
  generateQuestions
} from "./ai.js";


dotenv.config({ path: path.resolve("./server/.env") });

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// PDF Extraction Route
app.post("/api/extract", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // pdf-parse needs the raw buffer
    const buffer = req.file.buffer;

    // Check if buffer is valid
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: "Empty file buffer received" });
    }

    const data = await pdf(buffer);
    res.json({ text: data.text });

  } catch (err) {
    console.error("PDF extraction error:", err);
    res.status(500).json({ error: "Failed to extract text from PDF: " + err.message });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "No resume text provided" });
    }

    const skills = await extractSkillsFromResume(resumeText);
    res.json({ skills });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/analyze-job-role", async (req, res) => {
  try {
    const { jobRole } = req.body;
    if (!jobRole) {
      return res.status(400).json({ error: "No job role provided" });
    }

    const requiredSkills = await extractSkillsFromJobRole(jobRole);
    res.json({ requiredSkills });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/analyze-compatibility", async (req, res) => {
  try {
    const { resumeSkills, requiredSkills } = req.body;

    const result = await analyzeCompatibility(resumeSkills, requiredSkills);

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI compatibility analysis failed" });
  }
});

app.post("/api/generate-questions", async (req, res) => {
  try {
    const { jobRole } = req.body;
    if (!jobRole) {
      return res.status(400).json({ error: "No job role provided" });
    }

    const questions = await generateQuestions(jobRole);
    res.json({ questions });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});


const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

export default app;

