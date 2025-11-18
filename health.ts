export interface HealthEntry {
  id: string;
  dateTime: string;
  type: 'symptom' | 'vital' | 'medication' | 'note';
  title: string;
  description: string;
  data?: Record<string, any>;
  severity: 'mild' | 'moderate' | 'severe';
  tags: string[];
}

export interface VitalSign {
  id: string;
  dateTime: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'weight' | 'blood_sugar';
  value: number;
  unit: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: number[];
  startDate: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
}

export interface HealthGoal {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'mental_health' | 'chronic_disease';
  targetValue: number;
  unit: string;
  currentValue: number;
  targetDate: string;
  createdAt: string;
  status: 'in_progress' | 'completed' | 'paused';
}

export interface HealthInsight {
  id: string;
  generatedAt: string;
  type: 'symptom_analysis' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  explanation?: string;
  severity: 'info' | 'warning' | 'urgent';
  relatedData?: Record<string, any>;
  recommendations?: string[];
}

