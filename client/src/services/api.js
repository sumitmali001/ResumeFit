import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to append JWT token if stored
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("resumefit_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Resume PDF text extraction
export const extractPdfApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/extract", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Extract resume skills
export const analyzeSkillsApi = async (resumeText) => {
  const response = await API.post("/analyze", { resumeText });
  return response.data;
};

// Extract job role required skills
export const analyzeJobRoleApi = async (jobRole) => {
  const response = await API.post("/analyze-job-role", { jobRole });
  return response.data;
};

// Analyze compatibility
export const analyzeCompatibilityApi = async (resumeSkills, requiredSkills) => {
  const response = await API.post("/analyze-compatibility", {
    resumeSkills,
    requiredSkills,
  });
  return response.data;
};

// Generate technical quiz questions
export const generateQuestionsApi = async (jobRole) => {
  const response = await API.post("/generate-questions", { jobRole });
  return response.data;
};

// History APIs
export const saveAnalysisApi = async (data) => {
  const response = await API.post("/history", data);
  return response.data;
};

// Get past history
export const getHistoryApi = async () => {
  const response = await API.get("/history");
  return response.data;
};

// Delete history record
export const deleteAnalysisApi = async (id) => {
  const response = await API.delete(`/history/${id}`);
  return response.data;
};

export default API;
