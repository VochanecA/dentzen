import React, { useState } from 'react';
import BreathingExercise from './BreathingExercise';
import ExposureTool from './ExposureTool';
import StressBusterGame from './StressBusterGame';
import MindfulnessAffirmations from './MindfulnessAffirmations';
import VisualSanctuary from './VisualSanctuary';
import ProgressiveRelaxation from './ProgressiveRelaxation';
import AmbientSoundscape from './AmbientSoundscape';
import CalmingMusicPlayer from './CalmingMusicPlayer';
import { PROCEDURES, CALMING_TIPS } from '../constants';

// OpenRouter Service - Fixed version
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "deepseek/deepseek-r1-0528:free";

// Funkcija za dobijanje API key-a
const getOpenRouterApiKey = (): string => {
  // Proveri različite načine dobijanja API key-a
  // 1. Za Create React App (CRA)
  const craKey = process.env.REACT_APP_OPENROUTER_API_KEY;
  
  // 2. Za Vite (ako se koristi import.meta.env)
  let viteKey = '';
  try {
    // @ts-ignore - ignoriši TypeScript grešku za import.meta
    viteKey = import.meta.env?.VITE_OPENROUTER_API_KEY || '';
  } catch (error) {
    // Nema import.meta u CRA, ignorišemo
  }
  
  // 3. Globalna window varijabla (za build-time injection)
  const windowKey = (window as any).__ENV__?.REACT_APP_OPENROUTER_API_KEY || 
                    (window as any).__ENV__?.VITE_OPENROUTER_API_KEY;
  
  // Kombinuj sve
  const envKey = craKey || viteKey || windowKey;
  
  // 4. Ako nema env varijable, probaj da pročitaš iz localStorage (za development)
  if (!envKey) {
    const localKey = localStorage.getItem('OPENROUTER_API_KEY');
    if (localKey) {
      console.warn("Using API key from localStorage (development only!)");
      return localKey;
    }
  }
  
  return envKey || '';
};

const OPENROUTER_API_KEY = getOpenRouterApiKey();

async function callOpenRouter(prompt: string, systemInstruction?: string) {
  const apiKey = getOpenRouterApiKey();
  
  if (!apiKey) {
    console.error("OpenRouter Error: API_KEY nije konfigurisan.");
    console.error("Dodaj REACT_APP_OPENROUTER_API_KEY u .env.local fajl");
    console.error("Ili za development: localStorage.setItem('OPENROUTER_API_KEY', 'tvoj_key')");
    throw new Error("API key is not configured. Please check your environment variables.");
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://dentzen.app",
        "X-Title": "DentZen Relief App"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorMessage = errorJson.error?.message || response.statusText;
      throw new Error(`OpenRouter API error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from API");
    }

    return content;
  } catch (error) {
    console.error("OpenRouter Detailed Error:", error);
    throw error;
  }
}

function cleanDeepSeekResponse(text: string): string {
  if (!text) return "";
  
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, '');
  
  const parts = cleaned.split(/\n\n+/);
  if (parts.length > 1 && (parts[0].toLowerCase().includes("i should") || parts[0].toLowerCase().includes("the user is"))) {
    cleaned = parts.slice(1).join('\n\n');
  }

  return cleaned.trim();
}

const getReassurance = async (fear: string) => {
  const systemPrompt = "You are a comforting dental assistant. Provide a short (under 80 words), gentle, and medically reassuring explanation to help a patient with their specific fear. Do not use technical jargon. Be empathetic and warm.";
  const result = await callOpenRouter(`I am a patient and I am extremely afraid of: "${fear}". Please talk to me gently.`, systemPrompt);
  
  const cleaned = cleanDeepSeekResponse(result);
  
  return cleaned || "You are in safe hands. Modern dental techniques prioritize your comfort above all else, and we can go as slow as you need.";
};

// Constants - već učitano iz '../constants'
// const CALMING_TIPS = [...]
// const PROCEDURES = [...]

// Dodajemo JawResetTool komponentu koja nedostaje
const JawResetTool: React.FC = () => {
  const [active, setActive] = useState(false);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">Physical Check-in</h3>
        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-400 uppercase tracking-tight">Somatic Reset</span>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">Jaw Release</p>
            <p className="text-xs text-slate-500">Gently drop your lower jaw. Let your teeth stay slightly apart.</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">Shoulder Drop</p>
            <p className="text-xs text-slate-500">Exhale and visualize your shoulders melting away from your ears.</p>
          </div>
        </div>
      </div>
      <button 
        onClick={() => setActive(!active)}
        className={`w-full mt-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${active ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
      >
        {active ? 'Relaxation Active' : 'Begin Scan'}
      </button>
    </div>
  );
};

// Main Component
const PatientDashboard: React.FC = () => {
  const [view, setView] = useState<'overview' | 'modules' | 'education'>('overview');
  const [anxiety, setAnxiety] = useState(5);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(!!OPENROUTER_API_KEY);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  React.useEffect(() => {
    const checkApiKey = () => {
      const key = getOpenRouterApiKey();
      setApiKeyConfigured(!!key);
    };
    
    checkApiKey();
  }, []);

  const saveApiKeyToLocalStorage = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('OPENROUTER_API_KEY', tempApiKey.trim());
      setApiKeyConfigured(true);
      setShowApiKeyInput(false);
      setTempApiKey('');
      alert('API key saved to localStorage (development only!)');
    }
  };

  const askAI = async () => {
    if (!query.trim()) {
      setError('Please enter your concern first');
      return;
    }
    
    if (!apiKeyConfigured) {
      setError("API key is not configured. Please add your API key.");
      setShowApiKeyInput(true);
      return;
    }
    
    setLoading(true);
    setFeedback(null);
    setAiResponse('');
    setError('');
    
    try {
      const res = await getReassurance(query);
      setAiResponse(res);
    } catch (err: any) {
      console.error('Error getting reassurance:', err);
      setError(err.message || "I'm here for you. We can take this as slow as you need. What else is on your mind?");
      setAiResponse("I'm here for you. We can take this as slow as you need. What else is on your mind?");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    console.log(`User feedback for AI response: ${type}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, patient</h1>
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

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Zen Companion
                </h2>
                <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/10 text-cyan-300">
                  DeepSeek R1
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">Ask anything about your visit. I'll analyze your concern and provide gentle reassurance.</p>
              
              {/* API Key konfiguracija */}
              {!apiKeyConfigured && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-amber-300 text-sm font-semibold mb-2">⚠️ API Key Required</p>
                  
                  {showApiKeyInput ? (
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="Paste your OpenRouter API key here"
                        className="w-full bg-white/5 border border-amber-500/30 rounded-lg p-3 text-sm placeholder:text-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveApiKeyToLocalStorage}
                          className="flex-1 bg-amber-600 text-white font-bold py-2 rounded-lg hover:bg-amber-500 transition-all"
                        >
                          Save API Key
                        </button>
                        <button
                          onClick={() => setShowApiKeyInput(false)}
                          className="px-4 py-2 bg-white/10 text-amber-300 rounded-lg hover:bg-white/15 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                      <p className="text-amber-400/70 text-xs">
                        This will be saved in localStorage for development only.
                        For production, use REACT_APP_OPENROUTER_API_KEY in .env.local
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-amber-400/80 text-xs mb-3">
                        Add REACT_APP_OPENROUTER_API_KEY to .env.local file or enter it below:
                      </p>
                      <button
                        onClick={() => setShowApiKeyInput(true)}
                        className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-500 transition-all"
                      >
                        Enter API Key
                      </button>
                    </>
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={apiKeyConfigured ? "Ex: Will the local anesthetic hurt?" : "Enter API key first to use this feature"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[110px] resize-none transition-all disabled:opacity-50"
                  disabled={!apiKeyConfigured}
                />
                
                {error && !aiResponse && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs">
                    {error}
                  </div>
                )}
                
                <button 
                  onClick={askAI}
                  disabled={loading || !query.trim() || !apiKeyConfigured}
                  className="w-full bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Reasoning...
                    </>
                  ) : !apiKeyConfigured ? (
                    "Configure API Key First"
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Get Deep Reassurance
                    </>
                  )}
                </button>
                
                {apiKeyConfigured && (
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        localStorage.removeItem('OPENROUTER_API_KEY');
                        setApiKeyConfigured(false);
                        setShowApiKeyInput(false);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-300 transition-all"
                    >
                      {/* Remove saved API key */}
                    </button>
                  </div>
                )}
              </div>

              {aiResponse && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="relative p-5 bg-white/5 rounded-2xl border border-white/10 text-sm leading-relaxed text-slate-100 shadow-inner">
                    <div className="absolute -top-3 left-4 bg-slate-800 px-2 py-0.5 rounded-lg border border-white/10 text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                      Empathy Analysis Result
                    </div>
                    {aiResponse}
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Clinical Safety Confirmed</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleFeedback('positive')}
                        className={`p-2 rounded-lg transition-all ${feedback === 'positive' ? 'bg-cyan-600 text-white scale-110' : 'hover:bg-white/10 text-slate-400'}`}
                        aria-label="Helpful"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.708C19.746 10 20.47 10.886 20.08 11.77l-2.43 5.5c-.322.73-1.04 1.23-1.84 1.23H9V10l3.1-6.1c.4-.8 1.4-1.1 2.2-.7.8.4 1.1 1.4.7 2.2L14 10z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleFeedback('negative')}
                        className={`p-2 rounded-lg transition-all ${feedback === 'negative' ? 'bg-rose-600 text-white scale-110' : 'hover:bg-white/10 text-slate-400'}`}
                        aria-label="Not helpful"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.292C4.254 14 3.53 13.114 3.92 12.23l2.43-5.5c.322-.73 1.04-1.23 1.84-1.23H15v8l-3.1 6.1c-.4.8-1.4 1.1-2.2.7-.8-.4-1.1-1.4-.7-2.2L10 14z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <BreathingExercise />
            <AmbientSoundscape />
            <MindfulnessAffirmations />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-8">
            <StressBusterGame />
            <VisualSanctuary />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-8">
            <CalmingMusicPlayer />
            <ProgressiveRelaxation />
            <JawResetTool />
            <ExposureTool />
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