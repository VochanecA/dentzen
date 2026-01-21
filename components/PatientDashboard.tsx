
import React, { useState } from 'react';
import BreathingExercise from './BreathingExercise';
import ExposureTool from './ExposureTool';
import StressBusterGame from './StressBusterGame';
import { PROCEDURES, CALMING_TIPS } from '../constants';
import { getReassurance } from '../services/geminiService';

const PatientDashboard: React.FC = () => {
  const [view, setView] = useState<'overview' | 'modules' | 'education'>('overview');
  const [anxiety, setAnxiety] = useState(5);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const askAI = async () => {
    if (!query) return;
    setLoading(true);
    setFeedback(null); // Reset feedback for new query
    const res = await getReassurance(query);
    setAiResponse(res || '');
    setLoading(false);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    // In a production app, you would send this to your backend/Supabase here
    console.log(`User feedback for AI response: ${type}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Alen</h1>
          <p className="text-slate-500">Your journey to a stress-free smile.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-100">
          <button 
            onClick={() => setView('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'overview' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setView('modules')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'modules' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Relax Zone
          </button>
          <button 
            onClick={() => setView('education')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'education' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Education
          </button>
        </div>
      </div>

      {view === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Check-in */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold mb-6">How are you feeling about your next visit?</h2>
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-cyan-600">Completely Calm</span>
                  <span className="text-rose-500">Very Anxious</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={anxiety} 
                  onChange={(e) => setAnxiety(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="text-center">
                  <span className="text-4xl font-bold text-slate-700">{anxiety}</span>
                  <span className="text-slate-400 ml-1">/ 10</span>
                </div>
              </div>
              
              <div className="p-6 bg-cyan-50 rounded-xl border border-cyan-100">
                <h4 className="font-semibold text-cyan-800 mb-2">Today's Calming Tip</h4>
                <p className="text-cyan-700 leading-relaxed">{CALMING_TIPS[anxiety % CALMING_TIPS.length]}</p>
              </div>
            </div>
          </div>

          {/* AI Companion */}
          <div className="bg-gradient-to-br from-cyan-600 to-teal-600 p-8 rounded-2xl shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Companion
            </h2>
            <p className="text-cyan-50 text-sm mb-6 opacity-90">Ask anything about your dental procedure. We're here to explain gently.</p>
            <div className="space-y-4">
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Will the needle hurt?"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[100px]"
              />
              <button 
                onClick={askAI}
                disabled={loading}
                className="w-full bg-white text-cyan-700 font-bold py-3 rounded-xl hover:bg-cyan-50 transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'Thinking...' : 'Get Reassurance'}
              </button>
            </div>
            {aiResponse && (
              <div className="mt-6 space-y-3 animate-fade-in">
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-sm leading-relaxed">
                  {aiResponse}
                </div>
                
                <div className="flex items-center justify-end gap-3 px-1">
                  <span className="text-[10px] text-cyan-100/60 uppercase font-bold tracking-tight">Was this helpful?</span>
                  <button 
                    onClick={() => handleFeedback('positive')}
                    className={`p-1.5 rounded-lg transition-all ${feedback === 'positive' ? 'bg-white text-cyan-700 scale-110' : 'hover:bg-white/10 text-white/80'}`}
                    aria-label="Thumbs up"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.708C19.746 10 20.47 10.886 20.08 11.77l-2.43 5.5c-.322.73-1.04 1.23-1.84 1.23H9V10l3.1-6.1c.4-.8 1.4-1.1 2.2-.7.8.4 1.1 1.4.7 2.2L14 10z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleFeedback('negative')}
                    className={`p-1.5 rounded-lg transition-all ${feedback === 'negative' ? 'bg-white text-cyan-700 scale-110' : 'hover:bg-white/10 text-white/80'}`}
                    aria-label="Thumbs down"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.292C4.254 14 3.53 13.114 3.92 12.23l2.43-5.5c.322-.73 1.04-1.23 1.84-1.23H15v8l-3.1 6.1c-.4.8-1.4 1.1-2.2.7-.8-.4-1.1-1.4-.7-2.2L10 14z" />
                    </svg>
                  </button>
                </div>
                {feedback && (
                  <p className="text-[10px] text-center text-cyan-100/80 italic animate-in fade-in slide-in-from-top-1">
                    Thank you for your feedback!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col gap-8">
            <BreathingExercise />
            <ExposureTool />
          </div>
          <div className="h-full">
            <StressBusterGame />
          </div>
        </div>
      )}

      {view === 'education' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {PROCEDURES.map((proc) => (
            <div key={proc.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
              <img src={`https://picsum.photos/seed/${proc.id}/400/250`} alt={proc.title} className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{proc.title}</h3>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${proc.scaryRating > 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    Fear Level: {proc.scaryRating}/10
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{proc.description}</p>
                <button className="text-cyan-600 text-sm font-semibold hover:text-cyan-700 flex items-center gap-1">
                  View Gentle Walkthrough
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
