import { useState } from 'react';
import { useHealthStore } from '../store/healthStore';
import { geminiService } from '../services/geminiService';
import { Heart, AlertCircle, Loader2, Plus, Sparkles, X } from 'lucide-react';
import { format } from 'date-fns';

export default function SymptomTracker() {
  const { entries, addEntry, setLoading, setError, isLoading } = useHealthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const symptoms = entries.filter(e => e.type === 'symptom');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEntry({
      type: 'symptom',
      title: title.trim(),
      description: description.trim(),
      severity,
      tags: [],
    });

    setTitle('');
    setDescription('');
    setSeverity('mild');
    setShowForm(false);
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) return;

    setAnalyzing(true);
    setError(null);
    try {
      const recentSymptoms = symptoms.slice(0, 10);
      const recentVitals = useHealthStore.getState().getRecentVitals(7);
      const analysis = await geminiService.analyzeSymptoms(recentSymptoms, recentVitals);
      setAnalysisResult(analysis);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'severe': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Symptom Tracker</h1>
          </div>
          <p className="text-gray-600 mt-1">Log and analyze your symptoms with AI</p>
        </div>
        {symptoms.length > 0 && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-gradient-to-r from-primary-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl disabled:opacity-50 flex items-center space-x-2 transition-all duration-300 hover:scale-105"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Symptoms</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Add Symptom Form */}
      {showForm ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Log New Symptom</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Symptom *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Headache, Fever"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Severity
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                      severity === sev
                        ? getSeverityColor(sev) + ' scale-105 shadow-lg'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Add Symptom
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-primary-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Log New Symptom</span>
        </button>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 shadow-xl animate-slide-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-500 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-900">AI Analysis</h3>
          </div>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed bg-white/60 p-4 rounded-xl">
            {analysisResult}
          </div>
          <button
            onClick={() => setAnalysisResult(null)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-bold transition-colors"
          >
            Close Analysis
          </button>
        </div>
      )}

      {/* Symptoms List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recent Symptoms ({symptoms.length})
        </h2>
        {symptoms.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 sm:p-16 text-center">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-orange-500" />
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-2">No symptoms logged yet</p>
            <p className="text-gray-500">Click the button above to log your first symptom</p>
          </div>
        ) : (
          <div className="space-y-4">
            {symptoms.map((symptom, index) => (
              <div
                key={symptom.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 card-hover animate-fade-in border border-gray-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{symptom.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(symptom.severity)}`}>
                        {symptom.severity.toUpperCase()}
                      </span>
                    </div>
                    {symptom.description && (
                      <p className="text-gray-600 mb-3 leading-relaxed">{symptom.description}</p>
                    )}
                    <p className="text-sm text-gray-500 flex items-center">
                      {format(new Date(symptom.dateTime), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
