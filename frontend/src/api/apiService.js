import axios from "axios";

// 1. Point directly to the Host machine's port 5000.
// This bypasses the Docker Proxy issues entirely.
const API_URL = "http://localhost:5000/api";

console.log("🔗 FRONTEND CONNECTING TO:", API_URL);

const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 2. Attach JWT Token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers["x-auth-token"] = token;
  return req;
});

// 3. Robust Error Handling (Fixed the genAI crash)
const handleRequest = async (apiCall) => {
  try {
    const response = await apiCall;
    return response;
  } catch (error) {
    const errMsg =
      error?.response?.data?.msg ||
      error?.response?.data?.error ||
      error?.response?.data?.content ||
      error.message ||
      "Something went wrong!";
    
    console.error("❌ API Error:", errMsg);
    // REMOVED: console.log(genAI.listModels()) -> This was crashing your app!
    throw new Error(errMsg);
  }
};

// --- AUTH ---
export const login = (formData) =>
  handleRequest(API.post("/auth/login", formData));

export const register = (formData) =>
  handleRequest(API.post("/auth/register", formData));

export const getUserProfile = () =>
  handleRequest(API.get("/auth"));

// --- USER ---
export const updateUserSkills = (skills) =>
  handleRequest(API.put("/users/skills", { skills }));

// --- RECOMMENDATIONS ---
export const getMarketRecommendations = (userSkills, careerInterest) =>
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
export const getMentorResponse = (message, history) =>
  handleRequest(API.post("/mentor/chat", { message, history }));