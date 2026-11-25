# Setup Guide - AI Health Companion (Web App)

## Quick Start

### Step 1: Install Node.js
If you haven't already, install Node.js:
- Visit: https://nodejs.org/
- Download and install Node.js 18 or higher
- Verify installation: `node --version` and `npm --version`

### Step 2: Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 3: Configure the server-side API key

The Gemini key must be named `GEMINI_API_KEY`. Never add it to a `VITE_` variable or frontend source code; Vite variables are public in browser bundles.

For local development, create `.env.local` in the project root (or copy `.env.example`) and set:

```
GEMINI_API_KEY=your_gemini_api_key
```

`.env.local` is ignored by Git. Alternatively, sign in and link the Vercel project, then pull its Development environment:

```bash
npx vercel login
npx vercel link
npx vercel env add GEMINI_API_KEY development
npx vercel env pull .env.local
```

### Step 4: Install Dependencies
Run the following command in the project root:

```bash
npm install
```

or

```bash
yarn install
```

### Step 5: Run the app and API locally

```bash
npx vercel dev
```

Use the local URL printed by Vercel CLI (usually `http://localhost:3000`). `npm run dev` starts Vite only and does not run the `/api` function.

In Vercel, add `GEMINI_API_KEY` under **Project Settings → Environment Variables** for the Development, Preview, and Production environments you use. Redeploy after changing a deployed value. Do not create a `VITE_GEMINI_API_KEY`.

### Step 6: Open in Browser
- Navigate to the local URL shown by Vercel CLI (usually `http://localhost:3000`).

## Project Structure

```
api/
└── generate-content.ts     # Secure Vercel function for Gemini requests
src/
├── main.tsx                 # App entry point
├── App.tsx                  # Main app component with routing
├── index.css                # Global styles with Tailwind
├── config/
│   └── api.ts              # API configuration
├── types/
│   └── health.ts           # TypeScript type definitions
├── services/
│   └── geminiService.ts    # Gemini API integration
├── store/
│   └── healthStore.ts      # Zustand state management
├── components/
│   └── Layout.tsx          # Main layout component
└── pages/
    ├── Home.tsx            # Dashboard/home page
    ├── SymptomTracker.tsx  # Symptom logging
    ├── Vitals.tsx          # Vital signs tracking
    ├── Medications.tsx     # Medication management
    ├── Goals.tsx           # Health goals
    ├── AICoach.tsx         # AI health coach
    └── Insights.tsx        # Health insights
```

## Features Overview

### 1. Symptom Tracker
- Log symptoms with severity levels
- AI-powered symptom analysis
- Track symptom history

### 2. Vital Signs
- Track blood pressure, heart rate, temperature, weight, blood sugar
- View trends over time
- Easy data entry

### 3. Medications
- Manage medication list
- Track dosages and frequencies
- Active/inactive status

### 4. Health Goals
- Set health goals
- Track progress
- Visual progress indicators

### 5. AI Health Coach
- Ask health questions
- Get personalized responses
- Conversational interface

### 6. Health Insights
- AI-generated insights based on your data
- Personalized recommendations
- Pattern recognition

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview the static Vite build (does not run `/api`)
- `npx vercel dev` - Run the frontend together with the Vercel API function
- `npm run lint` - Run ESLint

## Troubleshooting

### API Key Issues
- Ensure `GEMINI_API_KEY` is set in `.env.local` or in the Vercel project's environment variables
- Check that your API key has proper permissions
- Verify you're not exceeding API rate limits
- Never set the key in frontend code or in a `VITE_` variable

### Build Issues
- Run `npm install` again to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure you're using Node.js 18 or higher
- Check that all dependencies are compatible

### Runtime Errors
- Check browser console (F12) for detailed error messages
- Verify internet connection for API calls
- Run the app with `npx vercel dev` so the serverless API function is available
- Check network tab for API request/response details

### Port Already in Use
If the Vercel development port is already in use, follow the port shown by Vercel CLI or stop the other local server.

## Health Data Privacy

- All health data is stored locally in your browser's localStorage
- AI features send the relevant prompt and health context to the app's `/api/generate-content` function, which forwards it to Google Gemini
- You have full control over your health information
- Data persists across browser sessions

## Building for Production

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   - Deploy the project to Vercel so the `/api` serverless function is deployed with the Vite frontend
   - Configure `GEMINI_API_KEY` in the Vercel project's Development, Preview, and Production environments as needed

## Next Steps

1. **Start Tracking**: Begin logging symptoms, vitals, and medications
2. **Set Goals**: Create health goals to work towards
3. **Ask Questions**: Use the AI Health Coach for health questions
4. **View Insights**: Generate AI-powered health insights
5. **Customize**: Modify the app to fit your specific health needs

## Support

For issues or questions:
1. Check the README.md for general information
2. Review error messages in the browser console
3. Verify API configuration
4. Check Node.js and npm versions compatibility

## Important Disclaimer

This app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

Happy Health Tracking! 🏥💚
