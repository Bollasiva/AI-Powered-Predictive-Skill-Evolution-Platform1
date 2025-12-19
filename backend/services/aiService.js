const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

const parseResume = async (filePath) => {
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
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error('Failed to process resume via AI Engine');
  }
};

const getTrendPrediction = async (skill) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-trend`, { skill });
    return response.data;
  } catch (error) {
    console.error("Trend Prediction Error:", error.message);
    throw new Error('Prediction failed');
  }
};

const getSemanticSkills = async (skill) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/semantic-skills`, { skill });
    return response.data.related_skills;
  } catch (error) {
    console.error("Semantic Skills Error:", error.message);
    return []; // Return empty if AI fails
  }
};

module.exports = { parseResume, getTrendPrediction, getSemanticSkills };