# Setup Guide - AI Health Companion (Web App)

## Quick Start

### Step 1: Install Node.js
If you haven't already, install Node.js:
- Visit: https://nodejs.org/
- Download and install Node.js 18 or higher
- Verify installation: `node --version` and `npm --version`

### Step 2: Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 3: Configure API Key

**Option 1: Direct Configuration (Quick)**
Open `src/config/api.ts` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:

```typescript
export const GEMINI_API_KEY = 'your_actual_api_key_here';
```

**Option 2: Environment Variable (Recommended for Production)**
Create a `.env` file in the root directory:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important**: For production, use environment variables. Never commit API keys to version control.

### Step 4: Install Dependencies
Run the following command in the project root:

```bash
npm install
```

or

```bash
yarn install
```

### Step 5: Run the Development Server
```bash
npm run dev
```

or

```bash
yarn dev
```

### Step 6: Open in Browser
- The app will automatically open at `http://localhost:5173`
- Or manually navigate to the URL shown in the terminal

## Project Structure

```
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
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `src/config/api.ts` or `.env`
- Check that your API key has proper permissions
- Verify you're not exceeding API rate limits
- Check browser console for detailed error messages

### Build Issues
- Run `npm install` again to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure you're using Node.js 18 or higher
- Check that all dependencies are compatible

### Runtime Errors
- Check browser console (F12) for detailed error messages
- Verify internet connection for API calls
- Ensure API key is properly configured
- Check network tab for API request/response details

### Port Already in Use
If port 5173 is already in use:
- The dev server will automatically use the next available port
- Or specify a port: `npm run dev -- --port 3000`

## Health Data Privacy

- All health data is stored locally in your browser's localStorage
- No data is sent to external servers (except Gemini API for AI features)
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
   - The `dist` folder contains the production build
   - Deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.)

## Environment Variables

Create a `.env` file for environment-specific configuration:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

Note: Variables must be prefixed with `VITE_` to be accessible in the app.

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
