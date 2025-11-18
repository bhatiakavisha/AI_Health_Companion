import { useState } from 'react';
import { useHealthStore } from '../store/healthStore';
import { Target, Plus, X, TrendingUp, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Goals() {
  const { goals, addGoal, updateGoalProgress, getActiveGoals } = useHealthStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'fitness' | 'nutrition' | 'mental_health' | 'chronic_disease'>('fitness');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const activeGoals = getActiveGoals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetValue || !unit.trim() || !targetDate) return;

    addGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      targetValue: parseFloat(targetValue),
      unit: unit.trim(),
      targetDate,
    });

    setTitle('');
    setDescription('');
    setCategory('fitness');
    setTargetValue('');
    setUnit('');
    setTargetDate('');
    setShowForm(false);
  };

  const handleUpdateProgress = (goalId: string, currentValue: number) => {
    updateGoalProgress(goalId, currentValue);
  };

  const getProgressPercentage = (goal: typeof goals[0]) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      fitness: 'from-green-500 to-emerald-500',
      nutrition: 'from-orange-500 to-amber-500',
      mental_health: 'from-purple-500 to-pink-500',
      chronic_disease: 'from-red-500 to-rose-500',
    };
    return colors[cat] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Health Goals</h1>
          </div>
          <p className="text-gray-600 mt-1">Set and track progress toward your health goals</p>
        </div>
      </div>

      {/* Add Goal Form */}
      {showForm ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Health Goal</h2>
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
                Goal Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Lose 10 pounds"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="fitness">Fitness</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="mental_health">Mental Health</option>
                  <option value="chronic_disease">Chronic Disease</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Target Date *
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Target Value *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Unit *
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., lbs, kg, miles"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Create Goal
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
          <span>New Goal</span>
        </button>
      )}

      {/* Goals List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Your Goals ({goals.length})
        </h2>
        {goals.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 sm:p-16 text-center">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-2">No health goals set yet</p>
            <p className="text-gray-500">Click the button above to create your first goal</p>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal, index) => {
              const progress = getProgressPercentage(goal);
              return (
                <div
                  key={goal.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 card-hover animate-fade-in border border-gray-100"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`bg-gradient-to-br ${getCategoryColor(goal.category)} p-3 rounded-xl shadow-lg`}>
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{goal.title}</h3>
                            {goal.status === 'completed' && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border-2 border-green-300 flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>COMPLETED</span>
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 leading-relaxed">{goal.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-700">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className="text-2xl font-extrabold text-primary-600">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className={`h-4 rounded-full transition-all duration-500 ${
                          goal.status === 'completed' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-r from-primary-500 to-teal-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                    </span>
                    <button
                      onClick={() => {
                        const newValue = prompt(`Update progress for "${goal.title}" (current: ${goal.currentValue} ${goal.unit}):`, goal.currentValue.toString());
                        if (newValue) {
                          const numValue = parseFloat(newValue);
                          if (!isNaN(numValue)) {
                            handleUpdateProgress(goal.id, numValue);
                          }
                        }
                      }}
                      className="text-primary-600 hover:text-primary-700 font-bold flex items-center space-x-1 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Update Progress</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
