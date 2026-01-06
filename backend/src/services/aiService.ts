import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

export const parseResume = async (filePath: string): Promise<any> => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${AI_SERVICE_URL}/parse-resume`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // Returns { technical_skills, soft_skills, role, seniority }
    return response.data;
  } catch (error: any) {
    console.error("AI Service Error:", error.message);
    throw new Error('Failed to process resume via AI Engine');
  }
};

export const getTrendPrediction = async (skill: string): Promise<any> => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-trend`, { skill });
    return response.data;
  } catch (error: any) {
    console.error("Trend Prediction Error:", error.message);
    throw new Error('Prediction failed');
  }
};

export const getSemanticSkills = async (skill: string) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/semantic-skills`, { skill });
    return response.data.related_skills;
  } catch (error: any) {
    console.error("Semantic Skills Error:", error);
    return []; // Return empty if AI fails
  }
};

export const getRealTimeJobs = async (skill: string, location: string = 'Remote') => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/jobs`, { params: { skill, location } });
    return response.data.jobs;
  } catch (error: any) {
    console.error("Real-time Jobs Error:", error);
    return [];
  }
};

export const getForecast = async (skill: string, history: any[]) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/forecast`, { skill, history });
    return response.data;
  } catch (error: any) {
    console.error("Forecast Error:", error);
    return null;
  }
};

export const getMentorChatResponse = async (message: string, history: any[]) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/chat`, { message, history });
    return response.data;
  } catch (error: any) {
    console.error("Mentor Chat Error:", error);
    throw new Error("AI Mentor Unreachable");
  }
};