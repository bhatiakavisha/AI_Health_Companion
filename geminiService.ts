import axios from 'axios';
import { getApiUrl } from '../config/api';
import type { HealthEntry, VitalSign, HealthGoal, HealthInsight } from '../types/health';

export class GeminiService {
  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        getApiUrl(),
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_MEDICAL',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text || '';
    } catch (error: any) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
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

    const prompt = `Analyze the user's health data and provide personalized insights.

Recent Health Entries: ${entriesSummary}
Active Goals: ${goals.length} goals in progress

Generate a health insight that:
1. Identifies patterns or trends
2. Provides actionable recommendations
3. Explains health information in simple terms
4. Encourages healthy behaviors

Format as JSON:
{
  "title": "Brief insight title",
  "description": "Detailed description",
  "explanation": "Simple explanation of what this means",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "severity": "info"
}

Return ONLY valid JSON.`;

    try {
      const response = await this.generateContent(prompt);
      let cleanedResponse = response.trim();
      
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '').trim();
      }

      const jsonData = JSON.parse(cleanedResponse);
      
      return {
        id: `insight_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        type: 'trend',
        title: jsonData.title || 'Health Insight',
        description: jsonData.description || '',
        explanation: jsonData.explanation,
        severity: jsonData.severity || 'info',
        recommendations: jsonData.recommendations || [],
      };
    } catch (e) {
      // Fallback insight
      return {
        id: `insight_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        type: 'trend',
        title: 'Keep Tracking Your Health',
        description: 'Continue logging your symptoms and vitals for better insights.',
        severity: 'info',
      };
    }
  }

  async explainHealthTerm(term: string): Promise<string> {
    const prompt = `Explain the medical/health term "${term}" in simple, easy-to-understand language.
Keep it concise (2-3 sentences) and avoid overly technical jargon.
Focus on what it means for general health and wellness.`;

    return await this.generateContent(prompt);
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
    const prompt = `Create a personalized health plan to help achieve this goal:

Goal: ${goal.title}
Description: ${goal.description}
Current Progress: ${goal.currentValue} ${goal.unit} / ${goal.targetValue} ${goal.unit}
Target Date: ${goal.targetDate.split('T')[0]}

Provide a step-by-step plan with:
1. Weekly milestones
2. Actionable daily habits
3. Tips for staying motivated
4. Ways to track progress

Format it as a clear, structured plan that's easy to follow.`;

    return await this.generateContent(prompt);
  }
}

export const geminiService = new GeminiService();

