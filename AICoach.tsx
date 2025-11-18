import { useState, useRef, useEffect } from 'react';
import { useHealthStore } from '../store/healthStore';
import { geminiService } from '../services/geminiService';
import { MessageCircle, Send, Loader2, Bot, User, Sparkles, Info } from 'lucide-react';

interface Message {
  type: 'user' | 'assistant';
  text: string;
}

export default function AICoach() {
  const { entries, goals, getRecentEntries, getActiveGoals, setLoading, setError } = useHealthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    'What should I do for a headache?',
    'How to improve sleep?',
    'What is blood pressure?',
    'How to manage stress?',
  ];

  const handleSend = async (question?: string) => {
    const questionText = question || input.trim();
    if (!questionText) return;

    const userMessage: Message = { type: 'user', text: questionText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const recentEntries = getRecentEntries(7);
      const activeGoals = getActiveGoals();
      const answer = await geminiService.getHealthAnswer(questionText, recentEntries, activeGoals);
      
      const assistantMessage: Message = { type: 'assistant', text: answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setError(error.message);
      const errorMessage: Message = {
        type: 'assistant',
        text: 'Sorry, I encountered an error. Please try again or check your API key configuration.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">AI Health Coach</h1>
          </div>
          <p className="text-gray-600 mt-1">Ask me anything about your health</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800 leading-relaxed">
            ⚠️ This AI assistant provides general health information and guidance. It is not a replacement for professional medical advice. Always consult healthcare professionals for medical concerns.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100" style={{ height: '600px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-full mb-6">
                <MessageCircle className="w-16 h-16 text-purple-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Ask me anything about your health
              </h3>
              <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                I can help explain symptoms, provide health tips, and answer your health questions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {quickQuestions.map((q, index) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary-50 hover:to-teal-50 rounded-xl text-left text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200 hover:border-primary-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-primary-600 to-teal-600 text-white'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.type === 'assistant' && (
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {message.type === 'user' && (
                        <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        {message.type === 'assistant' && (
                          <div className="text-xs font-bold text-gray-600 mb-2 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Coach</span>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-primary-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-300 hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
