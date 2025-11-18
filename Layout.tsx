import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Heart, 
  Pill, 
  Target, 
  MessageCircle, 
  Lightbulb,
  Menu,
  X,
  Activity
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home', color: 'text-blue-600' },
    { path: '/symptoms', icon: Heart, label: 'Symptoms', color: 'text-orange-600' },
    { path: '/vitals', icon: Activity, label: 'Vitals', color: 'text-red-600' },
    { path: '/medications', icon: Pill, label: 'Meds', color: 'text-blue-600' },
    { path: '/goals', icon: Target, label: 'Goals', color: 'text-green-600' },
    { path: '/coach', icon: MessageCircle, label: 'AI Coach', color: 'text-purple-600' },
    { path: '/insights', icon: Lightbulb, label: 'Insights', color: 'text-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30">
      {/* Header */}
      <header className={`gradient-health text-white shadow-2xl transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Heart className="w-7 h-7 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Health Companion</h1>
                <p className="text-xs sm:text-sm text-white/90 font-medium">Your personalized health assistant</p>
              </div>
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/20 transition-all duration-200 active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row overflow-x-auto`}>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    group relative flex items-center space-x-2 px-4 py-3 md:py-3.5 md:px-5
                    transition-all duration-300 whitespace-nowrap
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary-50 to-teal-50 text-primary-700 font-semibold border-b-2 border-primary-500' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-teal-500" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-20 border-t border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              <p className="text-lg font-semibold">AI Health Companion</p>
            </div>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            </p>
            <p className="text-xs text-gray-500 pt-4 border-t border-gray-700">
              Built with ❤️ using React, TypeScript, Tailwind CSS, and Google Gemini API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
