import { useState } from 'react';
import { useHealthStore } from '../store/healthStore';
import { geminiService } from '../services/geminiService';
import { Lightbulb, RefreshCw, Loader2, Info, AlertTriangle, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Insights() {
  const { insights, addInsight, setLoading, setError, isLoading, entries, vitals, goals, getRecentEntries, getRecentVitals, getActiveGoals } = useHealthStore();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setLoading(true);
    setError(null);

    try {
      const recentEntries = getRecentEntries(7);
      const recentVitals = getRecentVitals(30);
      const activeGoals = getActiveGoals();
      
      const insight = await geminiService.generateHealthInsight(recentEntries, recentVitals, activeGoals);
      addInsight(insight);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-orange-600" />;
      default:
        return <Info className="w-8 h-8 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300';
      case 'warning':
        return 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300';
      default:
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300';
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Health Insights</h1>
          </div>
          <p className="text-gray-600 mt-1">AI-powered personalized health insights</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating || isLoading}
          className="bg-gradient-to-r from-primary-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl disabled:opacity-50 flex items-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          {generating || isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Generate Insight</span>
            </>
          )}
        </button>
      </div>

      {/* Insights List */}
      {insights.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 sm:p-16 text-center border border-gray-100">
          <div className="bg-gradient-to-br from-teal-100 to-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-12 h-12 text-teal-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No insights yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Generate AI-powered insights based on your health data to get personalized recommendations
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating || isLoading}
            className="bg-gradient-to-r from-primary-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl disabled:opacity-50 flex items-center space-x-2 mx-auto transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate First Insight</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div
              key={insight.id}
              className={`rounded-2xl shadow-xl p-6 sm:p-8 border-2 ${getSeverityColor(insight.severity)} card-hover animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  {getSeverityIcon(insight.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">{insight.title}</h3>
                    <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full font-medium">
                      {format(new Date(insight.generatedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed text-lg">{insight.description}</p>
                  
                  {insight.explanation && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 mb-4 border border-white/50">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 italic leading-relaxed">{insight.explanation}</p>
                      </div>
                    </div>
                  )}

                  {insight.recommendations && insight.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span>Recommendations:</span>
                      </h4>
                      <ul className="space-y-2">
                        {insight.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-3 bg-white/60 p-3 rounded-lg">
                            <span className="text-green-600 mt-1 font-bold">✓</span>
                            <span className="text-gray-700 leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
