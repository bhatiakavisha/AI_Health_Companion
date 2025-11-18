import { Link } from 'react-router-dom';
import { useHealthStore } from '../store/healthStore';
import { Heart, Activity, Pill, Target, MessageCircle, Lightbulb, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const { vitals, medications, goals, insights, getActiveMedications, getActiveGoals } = useHealthStore();
  const activeMeds = getActiveMedications();
  const activeGoalsList = getActiveGoals();

  const stats = [
    { label: 'Vitals Recorded', value: vitals.length, icon: Activity, color: 'from-red-500 to-pink-500', bgColor: 'bg-red-50', textColor: 'text-red-600' },
    { label: 'Active Medications', value: activeMeds.length, icon: Pill, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Health Goals', value: activeGoalsList.length, icon: Target, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
  ];

  const features = [
    { path: '/symptoms', icon: Heart, title: 'Symptom Tracker', description: 'Log and analyze symptoms with AI-powered insights', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50' },
    { path: '/vitals', icon: Activity, title: 'Vital Signs', description: 'Track your vital signs and monitor trends', color: 'from-red-500 to-rose-500', bgColor: 'bg-red-50' },
    { path: '/medications', icon: Pill, title: 'Medications', description: 'Manage your medications and schedules', color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50' },
    { path: '/goals', icon: Target, title: 'Health Goals', description: 'Set and track progress toward health goals', color: 'from-green-500 to-teal-500', bgColor: 'bg-green-50' },
    { path: '/coach', icon: MessageCircle, title: 'AI Health Coach', description: 'Get instant answers to your health questions', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
    { path: '/insights', icon: Lightbulb, title: 'Health Insights', description: 'AI-generated personalized health insights', color: 'from-teal-500 to-cyan-500', bgColor: 'bg-teal-50' },
  ];

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden gradient-health rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl animate-slide-up">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-4xl z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Powered by Gemini AI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Your AI-Powered<br />
            <span className="bg-white/20 px-4 py-2 rounded-xl inline-block">Health Companion</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/95 mb-8 font-medium leading-relaxed">
            Track symptoms, monitor vitals, manage medications, and get personalized health insights powered by Google's Gemini AI.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/symptoms"
              className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
            >
              <span>Start Tracking</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/coach"
              className="group bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all duration-300 border-2 border-white/50 hover:border-white hover:scale-105 flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Ask AI Coach</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className={`${stat.bgColor} rounded-2xl p-6 shadow-lg card-hover card-glow animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`${stat.textColor} text-sm font-semibold mb-2 uppercase tracking-wide`}>{stat.label}</p>
                  <p className="text-4xl font-extrabold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest Insight */}
      {insights.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-teal-200/50 card-hover animate-slide-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Latest Health Insight</h3>
                <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full font-medium">
                  {format(new Date(insights[0].generatedAt), 'MMM d, yyyy')}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-2">{insights[0].title}</p>
              <p className="text-gray-700 mb-4 leading-relaxed">{insights[0].description}</p>
              <Link
                to="/insights"
                className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-bold text-sm group"
              >
                <span>View all insights</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div>
        <div className="flex items-center space-x-3 mb-8">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-teal-500 rounded-full"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className={`group relative ${feature.bgColor} rounded-2xl p-6 sm:p-8 shadow-lg card-hover card-glow overflow-hidden animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity rounded-full blur-2xl"></div>
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span className="text-sm">Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-teal-500 rounded-full"></div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { path: '/symptoms', icon: Heart, label: 'Log Symptom', color: 'text-orange-600', bgColor: 'bg-orange-50', hoverColor: 'hover:bg-orange-100' },
            { path: '/vitals', icon: Activity, label: 'Record Vital', color: 'text-red-600', bgColor: 'bg-red-50', hoverColor: 'hover:bg-red-100' },
            { path: '/coach', icon: MessageCircle, label: 'Ask Question', color: 'text-purple-600', bgColor: 'bg-purple-50', hoverColor: 'hover:bg-purple-100' },
            { path: '/insights', icon: TrendingUp, label: 'View Insights', color: 'text-teal-600', bgColor: 'bg-teal-50', hoverColor: 'hover:bg-teal-100' },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className={`${action.bgColor} ${action.hoverColor} p-6 rounded-xl border-2 border-transparent hover:border-primary-300 transition-all duration-300 text-center group hover:scale-105 hover:shadow-lg animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={`w-10 h-10 ${action.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-bold text-gray-800 block">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
