
import React, { useState } from 'react';

const CalmingMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "T32VIsOlfB4";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full relative overflow-hidden group">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-cyan-100/30 blur-[40px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Zen Melodies</h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Curated Calm</p>
        </div>
        <div className="flex gap-1 items-center h-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`w-0.5 bg-cyan-500 transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'h-1 opacity-20'}`}
              style={{ 
                height: isPlaying ? `${Math.random() * 100 + 20}%` : '4px',
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center py-4">
        {/* Rotating "Vinyl" Visual */}
        <div className={`relative w-32 h-32 rounded-full p-1 border-2 border-slate-100 shadow-xl transition-transform duration-[10000ms] linear infinite ${isPlaying ? 'rotate-[360deg]' : ''}`}
             style={{ animationIterationCount: 'infinite' }}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=200" 
               alt="Zen" 
               className="w-full h-full object-cover opacity-60"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                </div>
             </div>
          </div>
        </div>

        <div className="mt-8 text-center space-y-1">
          <p className="text-sm font-bold text-slate-800">432Hz Deep Healing</p>
          <p className="text-[11px] text-slate-400 italic">Dental Anxiety Relief Loop</p>
        </div>
      </div>

      {/* Hidden YouTube Embed to act as audio source */}
      <div className="absolute bottom-[-100px] pointer-events-none opacity-0">
        <iframe 
          width="1" 
          height="1" 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? '1' : '0'}&mute=0&controls=0&loop=1&playlist=${videoId}`}
          title="Calming Music"
          allow="autoplay"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${isPlaying ? 'bg-rose-50 text-rose-600 border border-rose-100 shadow-rose-100' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'}`}
        >
          {isPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              Pause Sanctuary
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Zen Music
            </>
          )}
        </button>
        
        <p className="text-[9px] text-center text-slate-400 px-4 leading-relaxed">
          Best paired with noise-canceling headphones for immersive relaxation.
        </p>
      </div>
    </div>
  );
};

export default CalmingMusicPlayer;
