
import React, { useState } from 'react';
import { generateSanctuaryImage } from '../services/geminiService';

const SANCTUARY_PRESETS = [
  "Bioluminescent forest at twilight",
  "A cozy cottage in a floating cloud meadow",
  "Underwater crystal palace with friendly whales",
  "Starlit mountain peaks above a purple mist",
  "A library of infinitely tall mahogany shelves and golden sunlight"
];

const VisualSanctuary: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt) return;
    setLoading(true);
    const result = await generateSanctuaryImage(finalPrompt);
    if (result) setImage(result);
    setLoading(false);
  };

  if (fullscreen && image) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-1000">
        <img src={image} className="w-full h-full object-contain md:object-cover opacity-90 transition-opacity duration-1000" alt="Your Sanctuary" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <button 
          onClick={() => setFullscreen(false)}
          className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all border border-white/20 z-[101]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-white/70 italic tracking-widest text-sm pointer-events-none animate-pulse">
          Breathe in the peace of your sanctuary...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col group/sanctuary">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-xl font-semibold text-slate-800">Visual Sanctuary</h3>
          <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded-full font-bold text-indigo-400 uppercase tracking-tight">AI Generated</span>
        </div>
        <p className="text-slate-500 text-sm">Create a custom safe space to visit in your mind during treatment.</p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {image ? (
          <div className="relative group aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
            <img src={image} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-105" alt="Calm Sanctuary" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <button 
                onClick={() => setFullscreen(true)}
                className="opacity-0 group-hover:opacity-100 bg-white text-cyan-600 px-6 py-2 rounded-full font-bold text-xs shadow-xl transition-all translate-y-4 group-hover:translate-y-0 active:scale-95"
              >
                Enter Fullscreen Focus
              </button>
            </div>
            <button 
              onClick={() => setImage(null)}
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-1.5 rounded-lg shadow-sm text-slate-400 hover:text-rose-500 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ) : (
          <div className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all ${loading ? 'bg-slate-50 border-cyan-200' : 'bg-slate-50/50 border-slate-100'}`}>
             {loading ? (
                <div className="flex flex-col items-center">
                   <div className="w-12 h-12 border-4 border-cyan-100 border-t-cyan-500 rounded-full animate-spin mb-4" />
                   <p className="text-sm font-bold text-cyan-700 animate-pulse tracking-tight">Manifesting your sanctuary...</p>
                </div>
             ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-cyan-500 mb-4 shadow-sm border border-slate-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-400 mb-1 leading-relaxed px-4">Type a place where you feel perfectly at peace.</p>
                </>
             )}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: A glowing moonlit garden..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-400"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
              onClick={() => handleGenerate()}
              disabled={loading || !prompt}
              className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center min-w-[54px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Safe Presets</p>
            <div className="flex flex-wrap gap-2">
              {SANCTUARY_PRESETS.slice(0, 3).map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => handleGenerate(p)}
                  disabled={loading}
                  className="text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-white hover:text-cyan-600 hover:border-cyan-200 px-3 py-2 rounded-lg border border-slate-200 transition-all truncate max-w-[140px]"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSanctuary;
