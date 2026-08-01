import { extractSkillsSection } from "../utils/skillsExtractor.js";

/**
 * Call Hugging Face API (or configured LLM provider)
 */
async function chatWithAI(message) {
  const apiKey = process.env.HF_TOKEN || process.env.HF_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("No AI API key found in environment variables (HF_TOKEN / HF_API_KEY).");
  }

  // Hugging Face Router API with DeepSeek model
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "deepseek-ai/DeepSeek-V4-Flash:novita",
      messages: [{ role: "user", content: message }],
      temperature: 0.3,
    }),
  });

  const rawText = await response.text();

  if (!response.ok) {
    console.error(`[AI Service Error ${response.status}]:`, rawText);
    throw new Error(`AI API request failed with status ${response.status}`);
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (err) {
    console.error("[AI Service JSON Parse Error]:", rawText);
    throw new Error("Invalid JSON response from AI service");
  }

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Unexpected AI response structure");
  }

  return data.choices[0].message.content;
}

/**
 * Fallback heuristic skill extraction when AI key is missing or fails
 */
function fallbackExtractSkills(text) {
  const commonTech = [
    "JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB", "Python",
    "Java", "C++", "C#", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "SQL",
    "PostgreSQL", "MySQL", "Git", "GitHub", "Docker", "AWS", "REST API",
    "GraphQL", "Redux", "Next.js", "Vue.js", "Angular", "Django", "Flask",
    "Spring Boot", "Linux", "CI/CD", "Jest", "Webpack", "Vite"
  ];
  
  const found = commonTech.filter(tech => 
    new RegExp(`\\b${tech.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")}\\b`, "i").test(text)
  );

  return found.length > 0 ? found.join(", ") : "JavaScript, HTML, CSS, Git, React";
}

/**
 * Fallback required skills by job role keyword
 */
function fallbackRequiredSkills(jobRole) {
  const roleLower = jobRole.toLowerCase();
  if (roleLower.includes("frontend") || roleLower.includes("react") || roleLower.includes("web")) {
    return "React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, Redux, REST API, Git, Webpack, Responsive Design";
  }
  if (roleLower.includes("backend") || roleLower.includes("node") || roleLower.includes("python")) {
    return "Node.js, Express.js, MongoDB, REST API, SQL, Python, Git, Docker, JWT Authentication, Microservices";
  }
  if (roleLower.includes("full") || roleLower.includes("mern") || roleLower.includes("stack")) {
    return "React, Node.js, Express.js, MongoDB, JavaScript, TypeScript, REST API, Git, Redux, HTML5, CSS3, Docker";
  }
  if (roleLower.includes("data") || roleLower.includes("ai") || roleLower.includes("machine")) {
    return "Python, SQL, Machine Learning, Pandas, NumPy, Scikit-Learn, TensorFlow, PyTorch, Data Visualization, Statistics";
  }
  if (roleLower.includes("devops") || roleLower.includes("cloud")) {
    return "Docker, Kubernetes, AWS, CI/CD, Terraform, Linux, Bash, Git, Python, Monitoring";
  }
  return "JavaScript, React, Node.js, HTML5, CSS3, Git, REST API, Database Management, Problem Solving, Communication";
}

/**
 * Extract skills from resume text
 */
export async function extractSkillsFromResume(resumeText) {
  try {
    const skillsText = extractSkillsSection(resumeText);
    const MAX_LENGTH = 1500;
    const truncatedText = skillsText.length > MAX_LENGTH ? skillsText.slice(0, MAX_LENGTH) : skillsText;

    const prompt = `
Extract ONLY the technical skills, programming languages, frameworks,
libraries, and tools from the text below.
Return as a clean comma-separated list.
Do NOT explain anything.

Text:
${truncatedText}
`;

    const result = await chatWithAI(prompt);
    if (!result || typeof result !== "string") return fallbackExtractSkills(resumeText);

    return result
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");
  } catch (err) {
    console.warn("[AI extractSkillsFromResume Warning]: Using heuristic fallback -", err.message);
    return fallbackExtractSkills(resumeText);
  }
}

/**
 * Extract required skills from Job Role
 */
export async function extractSkillsFromJobRole(jobRole) {
  try {
    const prompt = `
You are an HR recruiter.

For a ${jobRole} position, list ONLY the 8 to 12 MOST IMPORTANT
and REALISTIC core technical skills typically required.

Do NOT list every possible tool.
Do NOT include optional, advanced, DevOps, cloud, or niche tools
unless they are essential for this role.

Return ONLY a simple comma-separated list.
No explanations.
`;

    const result = await chatWithAI(prompt);
    if (!result || typeof result !== "string") return fallbackRequiredSkills(jobRole);

    const skills = result
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return skills.slice(0, 12).join(", ");
  } catch (err) {
    console.warn("[AI extractSkillsFromJobRole Warning]: Using fallback -", err.message);
    return fallbackRequiredSkills(jobRole);
  }
}

/**
 * Analyze compatibility between resume skills and required skills
 */
export async function analyzeCompatibility(resumeSkills, requiredSkills) {
  try {
    const prompt = `
You are an expert ATS (Applicant Tracking System).

Compare the following resume skills with required job skills.

Resume Skills:
${resumeSkills}

Required Job Skills:
${requiredSkills}

Instructions:
1. Give a compatibility score from 0 to 100.
2. Determine job compatibility level (Excellent, Good, Average, Poor).
3. List missing skills (only from required skills not present in resume).
4. Give a short improvement suggestion (2 sentences max).

Return ONLY valid JSON in this format:

{
  "score": number,
  "compatibility": "string",
  "missingSkills": ["skill1", "skill2"],
  "suggestion": "text"
}
`;

    const response = await chatWithAI(prompt);
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}") + 1;

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = response.slice(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    }
    throw new Error("No JSON object found in response");
  } catch (err) {
    console.warn("[AI analyzeCompatibility Warning]: Using calculated analysis fallback -", err.message);

    // Heuristic math fallback
    const resArr = (resumeSkills || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
    const reqArr = (requiredSkills || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

    const missing = reqArr.filter(req => !resArr.some(res => res.includes(req) || req.includes(res)));
    const matchedCount = Math.max(0, reqArr.length - missing.length);
    const score = reqArr.length > 0 ? Math.round((matchedCount / reqArr.length) * 100) : 75;

    let compatibility = "Average Match";
    if (score >= 80) compatibility = "Excellent Match";
    else if (score >= 65) compatibility = "Good Match";
    else if (score < 40) compatibility = "Poor Match";

    return {
      score,
      compatibility,
      missingSkills: missing.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
      suggestion: missing.length > 0 
        ? `Consider adding hands-on experience or certifications in ${missing.slice(0, 3).join(", ")} to boost ATS match.`
        : "Your resume covers all major required core technical skills for this role!",
    };
  }
}

/**
 * Generate 25 multiple-choice questions for technical assessment
 */
export async function generateQuestions(jobRole) {
  try {
    const prompt = `
You are a technical interviewer. Generate exactly 25 multiple-choice questions to test a candidate's hard skills for the role of ${jobRole}.
Return ONLY a valid JSON array of objects. Do not include any markdown formatting, explanations, or extra text.
Each object must have the exact format:
{
  "question": "question text",
  "options": ["option 1", "option 2", "option 3", "option 4"],
  "answer": "the exact text of the correct option"
}
`;

    const response = await chatWithAI(prompt);
    const jsonStart = response.indexOf("[");
    const jsonEnd = response.lastIndexOf("]") + 1;

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = response.slice(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    throw new Error("Invalid questions array response");
  } catch (err) {
    console.warn("[AI generateQuestions Warning]: Generating fallback assessment questions -", err.message);

    // Fallback assessment generator for 25 questions
    const topics = ["Fundamentals", "State Management", "Performance", "Security", "Architecture", "API Integration", "Testing", "Deployment"];
    const questions = [];

    for (let i = 1; i <= 25; i++) {
      const topic = topics[(i - 1) % topics.length];
      questions.push({
        question: `[${jobRole} ${topic}] Question ${i}: Which best practice is essential when handling ${topic.toLowerCase()} in a modern ${jobRole} application?`,
        options: [
          `Implement modular patterns, proper validation, and performance optimization for ${topic.toLowerCase()}`,
          `Avoid using any third-party dependencies or modular code structures`,
          `Hardcode environment secrets directly into client-side bundles`,
          `Synchronously block the event loop for heavy computational tasks`
        ],
        answer: `Implement modular patterns, proper validation, and performance optimization for ${topic.toLowerCase()}`
      });
    }

    return questions;
  }
}
