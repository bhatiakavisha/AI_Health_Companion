import { useState } from 'react';
import { useHealthStore } from '../store/healthStore';
import { Pill, Plus, X, CheckCircle2 } from 'lucide-react';

export default function Medications() {
  const { medications, addMedication, getActiveMedications } = useHealthStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [notes, setNotes] = useState('');

  const activeMeds = getActiveMedications();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    const times = frequency === 'daily' ? [9] : frequency === 'twice_daily' ? [9, 21] : [];

    addMedication({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times,
      notes: notes.trim() || undefined,
    });

    setName('');
    setDosage('');
    setFrequency('daily');
    setNotes('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl shadow-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Medications</h1>
          </div>
          <p className="text-gray-600 mt-1">Manage your medications and schedules</p>
        </div>
      </div>

      {/* Add Medication Form */}
      {showForm ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Medication</h2>
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
                Medication Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Aspirin"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 10mg"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
              >
                <option value="daily">Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
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
                className="flex-1 bg-gradient-to-r from-primary-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Add Medication
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
          <span>Add Medication</span>
        </button>
      )}

      {/* Medications List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Your Medications ({medications.length})
        </h2>
        {medications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 sm:p-16 text-center">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pill className="w-12 h-12 text-blue-500" />
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-2">No medications added yet</p>
            <p className="text-gray-500">Click the button above to add your first medication</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med, index) => (
              <div
                key={med.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 card-hover animate-fade-in border border-gray-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl shadow-lg">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{med.name}</h3>
                        {med.isActive && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border-2 border-green-300 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 font-semibold mb-1">Dosage: {med.dosage}</p>
                      <p className="text-gray-600 mb-2">Frequency: {med.frequency.replace('_', ' ')}</p>
                      {med.notes && (
                        <p className="text-gray-500 text-sm bg-gray-50 p-2 rounded-lg mt-2">{med.notes}</p>
                      )}
                    </div>
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
