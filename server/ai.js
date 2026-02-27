import fetch from "node-fetch";

/**
 * Helper: Send message to Hugging Face AI
 */
async function chatWithAI(message) {

  if (!process.env.HF_API_KEY) {
    throw new Error("HF_API_KEY is missing in .env file");
  }

  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct:novita",
        messages: [{ role: "user", content: message }],
        temperature: 0.3
      }),

    }
  );

  // 👇 SAFELY READ RESPONSE
  const rawText = await response.text();

  if (!response.ok) {
    console.error("HuggingFace API ERROR:");
    console.error(rawText);
    throw new Error(`AI request failed with status ${response.status}`);
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse AI response as JSON:");
    console.error(rawText);
    throw new Error("Invalid JSON response from AI");
  }

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("Invalid AI response structure:", data);
    throw new Error("Invalid AI response structure");
  }

  return data.choices[0].message.content;
}

/**
 * Extract skills section from resume text
 */
function extractSkillsSection(text) {
  text = text.replace(/\r\n/g, "\n");

  const skillsHeadingRegex = /(skills|technical skills|skills & tools)[:\n]/i;
  const skillsMatch = skillsHeadingRegex.exec(text);
  if (!skillsMatch) return text;

  const startIndex = skillsMatch.index + skillsMatch[0].length;

  const nextSections = [
    "Projects", "Work Experience", "Professional Experience", "Experience",
    "Employment History", "Education", "Work History", "Certifications",
    "Achievements", "Awards", "Languages", "Interests", "Hobbies",
    "Summary", "Profile", "Objective", "Contact", "References",
    "Extracurricular", "Leadership", "Volunteer Work",
    "Publications", "Courses", "Trainings", "Licenses"
  ];

  const nextHeadingRegex = new RegExp(`\\n(${nextSections.join("|")})[:\\n]`, "i");
  const nextMatch = nextHeadingRegex.exec(text.slice(startIndex));

  const endIndex = nextMatch ? startIndex + nextMatch.index : text.length;
  return text.slice(startIndex, endIndex).trim();
}

/**
 * Extract skills from resume using AI
 */
export async function extractSkillsFromResume(resumeText) {
  try {
    const skillsText = extractSkillsSection(resumeText);

    const MAX_LENGTH = 1500;
    const truncatedText =
      skillsText.length > MAX_LENGTH
        ? skillsText.slice(0, MAX_LENGTH)
        : skillsText;

    const prompt = `
Extract ONLY the technical skills, programming languages, frameworks,
libraries, and tools from the text below.
Return as a clean comma-separated list.
Do NOT explain anything.

Text:
${truncatedText}
`;

    const result = await chatWithAI(prompt);

    if (!result || typeof result !== "string") return "";

    return result
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join(", ");

  } catch (err) {
    console.error("Error in extractSkillsFromResume:", err.message);
    throw err;
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

    if (!result || typeof result !== "string") return "";

    const skills = result
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    // hard cap safety
    return skills.slice(0, 12).join(", ");

  } catch (err) {
    console.error("Error in extractSkillsFromJobRole:", err.message);
    throw err;
  }
}

export async function analyzeCompatibility(resumeSkills, requiredSkills) {

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

  try {
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}") + 1;
    const jsonString = response.slice(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("AI JSON parsing failed:", response);
    throw new Error("AI response format invalid");
  }
}

export async function generateQuestions(jobRole) {
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

  try {
    const jsonStart = response.indexOf("[");
    const jsonEnd = response.lastIndexOf("]") + 1;
    const jsonString = response.slice(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("AI JSON parsing failed for questions:", response);
    throw new Error("AI response format invalid for questions");
  }
}

