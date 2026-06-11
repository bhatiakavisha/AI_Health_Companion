export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Enforce environment variable for API Key
export const getApiUrl = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please create a `.env` file and set the `VITE_GEMINI_API_KEY` environment variable.');
  }
  return `${GEMINI_API_URL}?key=${apiKey}`;
};

