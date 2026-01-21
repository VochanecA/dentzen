
import React, { useState, useEffect, useCallback } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const StressBusterGame: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const colors = ['bg-cyan-200', 'bg-teal-200', 'bg-indigo-200', 'bg-blue-200', 'bg-sky-200'];

  const spawnBubble = useCallback(() => {
    const id = Date.now() + Math.random();
    const size = Math.floor(Math.random() * 40) + 60; // 60-100px
    const x = Math.random() * (100 - (size / 4)); // Percentage
    const y = Math.random() * (100 - (size / 4)); // Percentage
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    setBubbles((prev) => [...prev, { id, x, y, size, color }]);

    // Auto-remove bubble after 4 seconds if not clicked
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(spawnBubble, 1200);
    }
    return () => clearInterval(interval);
  }, [isActive, spawnBubble]);

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 10);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Bubble Zen</h3>
          <p className="text-slate-500 text-sm">Gently pop bubbles to clear your mind.</p>
        </div>
        <div className="bg-cyan-50 px-4 py-2 rounded-xl text-cyan-700 font-bold border border-cyan-100">
          {score} <span className="text-[10px] uppercase ml-1">Zen Points</span>
        </div>
      </div>

      <div className="relative flex-1 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden min-h-[300px] cursor-crosshair">
        {!isActive ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
            <button 
              onClick={() => setIsActive(true)}
              className="bg-cyan-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-700 transition-all hover:scale-105"
            >
              Start Game
            </button>
          </div>
        ) : null}

        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className={`absolute rounded-full transition-all duration-500 hover:scale-110 active:scale-90 animate-in fade-in zoom-in ${bubble.color} opacity-60 backdrop-blur-sm border border-white/50 shadow-inner`}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
          />
        ))}

        {isActive && bubbles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-300 animate-pulse italic">Watching the waves...</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Gamified Stress Relief</p>
        {isActive && (
          <button 
            onClick={() => { setIsActive(false); setBubbles([]); }}
            className="text-xs text-rose-500 font-semibold hover:underline"
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
};

export default StressBusterGame;
