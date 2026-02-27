import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import {
  extractSkillsFromResume,
  extractSkillsFromJobRole,
  analyzeCompatibility,
  generateQuestions
} from "./ai.js";


dotenv.config({ path: path.resolve("./server/.env") });

const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;

