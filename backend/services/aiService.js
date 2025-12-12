const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-engine:5001';

const parseResume = async (filePath) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${AI_SERVICE_URL}/parse-resume`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    return response.data.extracted_skills;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error('Failed to process resume');
  }
};

const getTrendPrediction = async (skill) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-trend`, { skill });
    return response.data;
  } catch (error) {
    throw new Error('Prediction failed');
  }
};

module.exports = { parseResume, getTrendPrediction };