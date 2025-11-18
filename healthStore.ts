import { create } from 'zustand';
import type { HealthEntry, VitalSign, Medication, HealthGoal, HealthInsight } from '../types/health';

interface HealthState {
  entries: HealthEntry[];
  vitals: VitalSign[];
  medications: Medication[];
  goals: HealthGoal[];
  insights: HealthInsight[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addEntry: (entry: Omit<HealthEntry, 'id' | 'dateTime'>) => void;
  addVital: (vital: Omit<VitalSign, 'id' | 'dateTime'>) => void;
  addMedication: (medication: Omit<Medication, 'id' | 'startDate'>) => void;
  addGoal: (goal: Omit<HealthGoal, 'id' | 'createdAt' | 'status' | 'currentValue'>) => void;
  updateGoalProgress: (goalId: string, currentValue: number) => void;
  addInsight: (insight: HealthInsight) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getRecentEntries: (days?: number) => HealthEntry[];
  getRecentVitals: (days?: number) => VitalSign[];
  getActiveMedications: () => Medication[];
  getActiveGoals: () => HealthGoal[];
}

export const useHealthStore = create<HealthState>((set, get) => ({
  entries: [],
  vitals: [],
  medications: [],
  goals: [],
  insights: [],
  isLoading: false,
  error: null,

  addEntry: (entry) => {
    const newEntry: HealthEntry = {
      ...entry,
      id: `entry_${Date.now()}_${Math.random()}`,
      dateTime: new Date().toISOString(),
    };
    set((state) => ({
      entries: [newEntry, ...state.entries],
    }));
    // Save to localStorage
    localStorage.setItem('health_entries', JSON.stringify([newEntry, ...get().entries]));
  },

  addVital: (vital) => {
    const newVital: VitalSign = {
      ...vital,
      id: `vital_${Date.now()}_${Math.random()}`,
      dateTime: new Date().toISOString(),
    };
    set((state) => ({
      vitals: [newVital, ...state.vitals],
    }));
    localStorage.setItem('health_vitals', JSON.stringify([newVital, ...get().vitals]));
  },

  addMedication: (medication) => {
    const newMedication: Medication = {
      ...medication,
      id: `med_${Date.now()}_${Math.random()}`,
      startDate: new Date().toISOString(),
      isActive: true,
    };
    set((state) => ({
      medications: [...state.medications, newMedication],
    }));
    localStorage.setItem('health_medications', JSON.stringify([...get().medications, newMedication]));
  },

  addGoal: (goal) => {
    const newGoal: HealthGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random()}`,
      createdAt: new Date().toISOString(),
      status: 'in_progress',
      currentValue: 0,
    };
    set((state) => ({
      goals: [...state.goals, newGoal],
    }));
    localStorage.setItem('health_goals', JSON.stringify([...get().goals, newGoal]));
  },

  updateGoalProgress: (goalId, currentValue) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              currentValue,
              status: currentValue >= goal.targetValue ? 'completed' : goal.status,
            }
          : goal
      ),
    }));
    localStorage.setItem('health_goals', JSON.stringify(get().goals));
  },

  addInsight: (insight) => {
    set((state) => ({
      insights: [insight, ...state.insights],
    }));
    localStorage.setItem('health_insights', JSON.stringify([insight, ...get().insights]));
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getRecentEntries: (days = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return get().entries.filter(
      (e) => new Date(e.dateTime) > cutoff
    );
  },

  getRecentVitals: (days = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return get().vitals.filter(
      (v) => new Date(v.dateTime) > cutoff
    );
  },

  getActiveMedications: () => {
    return get().medications.filter((m) => m.isActive);
  },

  getActiveGoals: () => {
    return get().goals.filter((g) => g.status === 'in_progress');
  },
}));

// Load from localStorage on init
if (typeof window !== 'undefined') {
  const loadFromStorage = () => {
    const entries = localStorage.getItem('health_entries');
    const vitals = localStorage.getItem('health_vitals');
    const medications = localStorage.getItem('health_medications');
    const goals = localStorage.getItem('health_goals');
    const insights = localStorage.getItem('health_insights');

    useHealthStore.setState({
      entries: entries ? JSON.parse(entries) : [],
      vitals: vitals ? JSON.parse(vitals) : [],
      medications: medications ? JSON.parse(medications) : [],
      goals: goals ? JSON.parse(goals) : [],
      insights: insights ? JSON.parse(insights) : [],
    });
  };

  loadFromStorage();
}

