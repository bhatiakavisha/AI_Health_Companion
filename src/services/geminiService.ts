import axios from 'axios';
import { GENERATE_CONTENT_API_URL } from '../config/api';
import type { HealthEntry, VitalSign, HealthGoal, HealthInsight } from '../types/health';

interface ApiErrorResponse {
  error?: {
    message?: unknown;
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export class GeminiService {
  async generateContent(prompt: string): Promise<string> {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) {
      throw new Error('A prompt is required to generate content.');
    }
    if (normalizedPrompt.length > 20_000) {
      throw new Error('The prompt is too long. Please shorten it and try again.');
    }

    let response;
    try {
      response = await axios.post<unknown>(
        GENERATE_CONTENT_API_URL,
        { prompt: normalizedPrompt },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 25_000,
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const apiMessage = error.response?.data?.error?.message;
        if (typeof apiMessage === 'string' && apiMessage.trim()) {
          throw new Error(apiMessage);
        }
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          throw new Error('The AI service took too long to respond. Please try again.');
        }
        if (!error.response) {
          throw new Error('Could not connect to the AI service. Please try again later.');
        }
        throw new Error('The AI service is temporarily unavailable. Please try again later.');
      }
      throw new Error('Unable to generate content. Please try again.');
    }

    if (!isRecord(response.data) || typeof response.data.text !== 'string' || !response.data.text.trim()) {
      throw new Error('The AI service returned an empty or invalid response. Please try again.');
    }

    return response.data.text;
  }

  async analyzeSymptoms(symptoms: HealthEntry[], vitals: VitalSign[]): Promise<string> {
    const symptomsList = symptoms.map(s => 
      `- ${s.title}: ${s.description} (${s.severity})`
    ).join('\n');
    
    const vitalsList = vitals.map(v => 
      `- ${v.type}: ${v.value} ${v.unit}`
    ).join('\n');

    const prompt = `As a health information assistant, analyze the following symptoms and vital signs. 
Provide general information and suggest when to consult a healthcare professional.

IMPORTANT: This is for informational purposes only and does not replace professional medical advice.

Symptoms:
${symptomsList}

Recent Vital Signs:
${vitalsList}

Provide:
1. A brief analysis of potential patterns
2. General information about these symptoms
3. When to seek medical attention
4. General self-care recommendations

Keep the response clear, concise, and emphasize consulting healthcare professionals for proper diagnosis.`;

    return await this.generateContent(prompt);
  }

  async generateHealthInsight(
    entries: HealthEntry[],
    vitals: VitalSign[],
    goals: HealthGoal[]
  ): Promise<HealthInsight> {
    const entriesSummary = entries.slice(0, 5).map(e => `${e.type}: ${e.title}`).join(', ');
    const vitalsSummary = vitals.slice(0, 5).map(v => `${v.type}: ${v.value} ${v.unit}`).join(', ');

    const prompt = `Analyze the user's health data and provide personalized insights.

Recent Health Entries: ${entriesSummary}
Recent Vitals: ${vitalsSummary}
Active Goals: ${goals.length} goals in progress

Generate a health insight that:
1. Identifies patterns or trends
2. Provides actionable recommendations
3. Explains health information in simple terms
4. Encourages healthy behaviors
5. Makes clear that this is general information, not a medical diagnosis

Format as JSON:
{
  "title": "Brief insight title",
  "description": "Detailed description",
  "explanation": "Simple explanation of what this means",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "severity": "info"
}

Return ONLY valid JSON.`;

    const response = await this.generateContent(prompt);
    const cleanedResponse = response
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    let jsonData: unknown;
    try {
      jsonData = JSON.parse(cleanedResponse);
    } catch {
      throw new Error('The AI returned an invalid health insight. Please try again.');
    }

    if (
      !isRecord(jsonData) ||
      typeof jsonData.title !== 'string' ||
      !jsonData.title.trim() ||
      typeof jsonData.description !== 'string' ||
      !jsonData.description.trim()
    ) {
      throw new Error('The AI returned an incomplete health insight. Please try again.');
    }

    const severity: HealthInsight['severity'] =
      jsonData.severity === 'warning' || jsonData.severity === 'urgent' || jsonData.severity === 'info'
        ? jsonData.severity
        : 'info';
    const recommendations = Array.isArray(jsonData.recommendations)
      ? jsonData.recommendations.filter((recommendation): recommendation is string => typeof recommendation === 'string')
      : [];

    return {
      id: `insight_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      type: 'trend',
      title: jsonData.title,
      description: jsonData.description,
      explanation: typeof jsonData.explanation === 'string' ? jsonData.explanation : undefined,
      severity,
      recommendations,
    };
  }

  async explainHealthTerm(term: string): Promise<string> {
    const prompt = `Explain the medical/health term "${term}" in simple, easy-to-understand language.
Keep it concise (2-3 sentences) and avoid overly technical jargon.
Focus on what it means for general health and wellness.`;
    const safePrompt = `${prompt}

This is general health information, not a medical diagnosis. Encourage consulting a qualified healthcare professional for personal medical concerns.`;

    return await this.generateContent(safePrompt);
  }

  async getHealthAnswer(
    question: string,
    entries: HealthEntry[],
    goals: HealthGoal[]
  ): Promise<string> {
    const context = `
User's recent health entries: ${entries.length} entries
Active health goals: ${goals.map(g => g.title).join(', ')}
`;

    const prompt = `As a health information assistant, provide a helpful response to the user's question.

User Question: "${question}"

Context: ${context}

Provide:
1. A clear, helpful answer
2. General health information (not medical diagnosis)
3. When appropriate, suggest consulting healthcare professionals
4. Practical, actionable advice

Keep it conversational and supportive. Emphasize that this is informational and not a replacement for professional medical advice.`;

    return await this.generateContent(prompt);
  }

  async generateHealthPlan(goal: HealthGoal, history: HealthEntry[]): Promise<string> {
    const historySummary = history.slice(0, 5).map(h => `${h.type}: ${h.title}`).join(', ');
    const prompt = `Create a personalized health plan to help achieve this goal, taking into account the user's recent history:

Goal: ${goal.title}
Description: ${goal.description}
Current Progress: ${goal.currentValue} ${goal.unit} / ${goal.targetValue} ${goal.unit}
Target Date: ${goal.targetDate.split('T')[0]}
Recent Health History: ${historySummary}

Provide a step-by-step plan with:
1. Weekly milestones
2. Actionable daily habits
3. Tips for staying motivated
4. Ways to track progress

Format it as a clear, structured plan that's easy to follow. This is general information, not a medical diagnosis; advise the user to consult a healthcare professional before making medical changes.`;

    return await this.generateContent(prompt);
  }
}

export const geminiService = new GeminiService();

