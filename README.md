# AI Health Companion 🏥💚

A modern web application built with React, TypeScript, and Tailwind CSS that leverages Google's Gemini API to create a comprehensive, AI-powered health management companion. The app provides personalized health insights, symptom tracking, medication management, and an intelligent health coach.

## 🎯 Key Features

### Technical Merit (25%)
- **Deep Gemini API Integration**: Advanced use of Gemini API for health analysis, explanations, and personalized recommendations
- **Modern Web Stack**: React 18 + TypeScript + Vite for fast, type-safe development
- **State Management**: Zustand for efficient state management
- **Multi-Modal Health Data**: Tracks symptoms, vital signs, medications, and health goals
- **AI-Powered Insights**: Generates personalized health insights based on user data patterns
- **Intelligent Health Coach**: Conversational AI assistant for health questions and guidance
- **Cloud-Ready Architecture**: Designed for easy integration with Vertex AI and Cloud Functions

### Innovation & Creativity (25%)
- **Comprehensive Health Management**: All-in-one solution combining tracking, analysis, and AI guidance
- **Personalized AI Insights**: Generates unique health insights based on individual data patterns
- **Symptom Analysis**: AI analyzes symptoms and provides contextual information
- **Adaptive Health Recommendations**: Tailored suggestions based on user's health history
- **Simple Medical Explanations**: AI explains complex health terms in easy-to-understand language

### Functionality & UI (25%)
- **Modern Responsive Design**: Beautiful, intuitive health-focused interface with Tailwind CSS
- **Smooth Animations**: Polished user experience with CSS transitions
- **Comprehensive Tracking**: Symptom tracker, vital signs, medications, and health goals
- **Real-time Insights**: AI-generated health insights and recommendations
- **Dark Mode Ready**: Easy to extend with dark mode support
- **Mobile Responsive**: Works seamlessly across desktop, tablet, and mobile devices

### Market Feasibility (25%)
- **Real-World Problem**: Addresses the need for accessible health management tools
- **Scalable Solution**: Can be extended with wearables integration, telemedicine, and more
- **Accessible**: Free to use with Gemini API (with usage limits)
- **Health Impact**: Empowers users to take control of their health
- **Market Potential**: Growing health tech market with increasing demand for AI-powered solutions

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Cloud Account with Gemini API access
- API Key for Gemini API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Manvi_K
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API Key**
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Open `src/config/api.ts`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
     ```typescript
     export const GEMINI_API_KEY = 'your_actual_api_key_here';
     ```
   - **OR** create a `.env` file in the root directory:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

6. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📱 Project Structure

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
    ├── SymptomTracker.tsx  # Symptom logging and analysis
    ├── Vitals.tsx          # Vital signs tracking
    ├── Medications.tsx     # Medication management
    ├── Goals.tsx           # Health goals tracking
    ├── AICoach.tsx         # AI health coach chat
    └── Insights.tsx         # Health insights and recommendations
```

## 🔌 API Integration

The app uses Gemini API for:
- **Symptom Analysis**: Analyzes logged symptoms and provides contextual information
- **Health Insights**: Generates personalized insights based on health data patterns
- **Health Explanations**: Explains medical terms and concepts in simple language
- **Personalized Recommendations**: Provides tailored health advice
- **Health Plan Generation**: Creates personalized plans for achieving health goals

### Example API Usage
```typescript
import { geminiService } from './services/geminiService';

const analysis = await geminiService.analyzeSymptoms(symptoms, vitals);
const insight = await geminiService.generateHealthInsight(entries, vitals, goals);
```

## 🎨 UI/UX Highlights

- **Health-Focused Design**: Teal/health color scheme optimized for health applications
- **Gradient Backgrounds**: Modern, calming designs
- **Card-based Layout**: Clean, organized information display
- **Smooth Transitions**: CSS transitions for polished interactions
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Quick Actions**: Easy access to common health tracking features
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🚀 Unique Features

1. **AI Symptom Analysis**: Log symptoms and get AI-powered analysis
2. **Comprehensive Vital Tracking**: Track blood pressure, heart rate, temperature, weight, and more
3. **Medication Management**: Keep track of medications and schedules
4. **Health Goals**: Set and track progress toward health goals
5. **AI Health Coach**: Chat with an AI assistant about health questions
6. **Personalized Insights**: Get AI-generated insights based on your health data

## 🔒 Privacy & Safety

- **Local Storage**: All health data stored locally in browser localStorage
- **No Medical Diagnosis**: App provides information only, not medical advice
- **Professional Consultation**: Always encourages consulting healthcare professionals
- **Safety Settings**: Gemini API configured with medical safety thresholds

## 🚀 Future Enhancements

- Integration with Vertex AI for advanced features
- Cloud Functions for server-side processing
- Wearable device integration (Fitbit, Apple Watch, etc.)
- Telemedicine integration
- Export health reports as PDF
- Multi-language support
- Voice input/output
- Health data visualization and trends
- Integration with electronic health records (EHR)
- PWA support for mobile app-like experience

## 📄 License

This project is created for educational purposes and demonstration of Gemini API integration in health tech.

## ⚠️ Disclaimer

This app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Google Gemini API for Health Tech**
