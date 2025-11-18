// Replace with your actual Gemini API key
// Get it from: https://makersuite.google.com/app/apikey
export const GEMINI_API_KEY = 'AIzaSyCOLFq1h7wChzk3PPQZkEjNp5JXf1CL2zc';

export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// For production, use environment variables
export const getApiUrl = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || GEMINI_API_KEY;
  return `${GEMINI_API_URL}?key=${apiKey}`;
};

