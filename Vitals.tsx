import { useState } from 'react';
import { useHealthStore } from '../store/healthStore';
import { Activity, Plus, X, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Vitals() {
  const { vitals, addVital } = useHealthStore();
  const [type, setType] = useState<'blood_pressure' | 'heart_rate' | 'temperature' | 'weight' | 'blood_sugar'>('heart_rate');
  const [value, setValue] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'blood_pressure') {
      const sys = parseFloat(systolic);
      const dia = parseFloat(diastolic);
      if (isNaN(sys) || isNaN(dia)) return;
      addVital({
        type: 'blood_pressure',
        value: sys,
        unit: 'mmHg',
        notes: notes || `${sys}/${dia} mmHg`,
      });
      setSystolic('');
      setDiastolic('');
    } else {
      const val = parseFloat(value);
      if (isNaN(val)) return;
      
      let unit = 'bpm';
      if (type === 'temperature') unit = '°F';
      if (type === 'weight') unit = 'lbs';
      if (type === 'blood_sugar') unit = 'mg/dL';

      addVital({
        type,
        value: val,
        unit,
        notes: notes || undefined,
      });
      setValue('');
    }
    setNotes('');
    setShowForm(false);
  };

  const getTypeLabel = (t: string) => {
    const labels: Record<string, string> = {
      blood_pressure: 'Blood Pressure',
      heart_rate: 'Heart Rate',
      temperature: 'Temperature',
      weight: 'Weight',
      blood_sugar: 'Blood Sugar',
    };
    return labels[t] || t;
  };

  const getTypeIcon = (t: string) => {
    return <Activity className="w-6 h-6" />;
  };

  const getTypeColor = (t: string) => {
    const colors: Record<string, string> = {
      blood_pressure: 'from-red-500 to-pink-500',
      heart_rate: 'from-red-500 to-rose-500',
      temperature: 'from-orange-500 to-red-500',
      weight: 'from-blue-500 to-cyan-500',
      blood_sugar: 'from-purple-500 to-pink-500',
    };
    return colors[t] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Vital Signs</h1>
          </div>
          <p className="text-gray-600 mt-1">Track your vital signs and monitor trends</p>
        </div>
      </div>

      {/* Add Vital Form */}
      {showForm ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Record Vital Sign</h2>
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
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
              >
                <option value="blood_pressure">Blood Pressure</option>
                <option value="heart_rate">Heart Rate</option>
                <option value="temperature">Temperature</option>
                <option value="weight">Weight</option>
                <option value="blood_sugar">Blood Sugar</option>
              </select>
            </div>

            {type === 'blood_pressure' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Systolic
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="120"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Diastolic
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    placeholder="80"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={type === 'heart_rate' ? '72' : type === 'temperature' ? '98.6' : ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Record Vital Sign</span>
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
          <span>Record Vital Sign</span>
        </button>
      )}

      {/* Vitals List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recent Records ({vitals.length})
        </h2>
        {vitals.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 sm:p-16 text-center">
            <div className="bg-gradient-to-br from-red-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-2">No vital signs recorded yet</p>
            <p className="text-gray-500">Click the button above to record your first vital sign</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vitals.map((vital, index) => (
              <div
                key={vital.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 card-hover animate-fade-in border border-gray-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`bg-gradient-to-br ${getTypeColor(vital.type)} p-4 rounded-xl shadow-lg`}>
                      {getTypeIcon(vital.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {getTypeLabel(vital.type)}
                      </h3>
                      <p className="text-2xl font-extrabold text-gray-800 mb-1">
                        {vital.value} <span className="text-sm text-gray-500">{vital.unit}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(vital.dateTime), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  {vital.notes && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">{vital.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
