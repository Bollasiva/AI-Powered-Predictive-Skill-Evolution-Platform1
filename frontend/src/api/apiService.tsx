import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🚀 DASHBOARD_UI_V2 CONNECTING TO:", API_URL);

const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT Token to every request
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

// Robust Error Handling
const handleRequest = async <T,>(apiCall: Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiCall;
    return response;
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.msg ||
      error?.response?.data?.error ||
      error?.response?.data?.content ||
      error.message ||
      "Something went wrong!";

    console.error("❌ API Error:", errMsg);
    throw new Error(errMsg);
  }
};

// --- AUTH ---
export const login = (formData: any) =>
  handleRequest(API.post("/auth/login", formData));

export const register = (formData: any) =>
  handleRequest(API.post("/auth/register", formData));

export const getUserProfile = () =>
  handleRequest(API.get("/auth"));

// --- USER ---
export const updateUserSkills = (skills: any[]) =>
  handleRequest(API.put("/users/skills", { skills }));

// --- RECOMMENDATIONS ---
export const getMarketRecommendations = (userSkills: any[], careerInterest: string) =>
  handleRequest(API.post("/recommendations/market", { skills: userSkills, careerInterest }));

export const getCollaborativeRecommendations = () =>
  handleRequest(API.get("/recommendations/collaborative"));

// --- CAREERS ---
export const getCareerPaths = () =>
  handleRequest(API.get("/careers"));

// --- DASHBOARD ---
export const getDashboardData = () =>
  handleRequest(API.get("/dashboard/trends"));

// --- MENTOR BOT ---
export const getMentorResponse = (message: string, history: any[]) =>
  handleRequest(API.post("/mentor/chat", { message, history }));

// --- RESUME ---
export const uploadResume = (formData: FormData) =>
  handleRequest(API.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }));

export default API;