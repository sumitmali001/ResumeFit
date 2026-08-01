/**
 * Extract skills section from resume text using section header matching
 */
export function extractSkillsSection(text) {
  if (!text || typeof text !== "string") return "";
  
  const normalizedText = text.replace(/\r\n/g, "\n");

  const skillsHeadingRegex = /(skills|technical skills|skills & tools|core competencies|technologies|technical summary)[:\n]/i;
  const skillsMatch = skillsHeadingRegex.exec(normalizedText);
  if (!skillsMatch) return normalizedText;

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
  const nextMatch = nextHeadingRegex.exec(normalizedText.slice(startIndex));

  const endIndex = nextMatch ? startIndex + nextMatch.index : normalizedText.length;
  return normalizedText.slice(startIndex, endIndex).trim();
}
