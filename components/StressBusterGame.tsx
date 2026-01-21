
import React, { useState, useEffect, useCallback, useRef } from 'react';

type GameMode = 'zen' | 'challenge';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  isMerging?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

const StressBusterGame: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('zen');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [visualizerPulse, setVisualizerPulse] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const colors = ['bg-cyan-200', 'bg-teal-200', 'bg-indigo-200', 'bg-blue-200', 'bg-sky-200'];

  // --- Sound Engine ---
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playPopSound = () => {
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playMergeSound = () => {
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  const playGameOverSound = () => {
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const playNote = (freq: number, delay: number, length: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + length);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + length);
    };

    playNote(440, 0, 0.5);
    playNote(349, 0.2, 0.5);
    playNote(261, 0.4, 0.8);
  };

  const spawnBubble = useCallback(() => {
    const id = Date.now() + Math.random();
    const size = Math.floor(Math.random() * 40) + 60; // 60-100px
    const x = Math.random() * 85; // Percentage
    const y = Math.random() * 85; // Percentage
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    setBubbles((prev) => [...prev, { id, x, y, size, color }]);

    const duration = gameMode === 'challenge' ? 2500 : 6000;
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id || b.isMerging));
    }, duration);
  }, [gameMode]);

  useEffect(() => {
    let interval: any;
    if (isActive && !isGameOver) {
      const spawnRate = gameMode === 'challenge' ? 600 : 1500;
      interval = setInterval(spawnBubble, spawnRate);
    }
    return () => clearInterval(interval);
  }, [isActive, isGameOver, spawnBubble, gameMode]);

  useEffect(() => {
    let timerInterval: any;
    if (isActive && gameMode === 'challenge' && timeLeft > 0 && !isGameOver) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            playGameOverSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isActive, gameMode, timeLeft, isGameOver, soundEnabled]);

  useEffect(() => {
    let animationFrame: number;
    const updateParticles = () => {
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.05,
          }))
          .filter((p) => p.y < 110 && p.x > -10 && p.x < 110)
      );
      animationFrame = requestAnimationFrame(updateParticles);
    };

    if (particles.length > 0) {
      animationFrame = requestAnimationFrame(updateParticles);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [particles.length]);

  const startGame = (mode: GameMode) => {
    initAudio();
    setGameMode(mode);
    setScore(0);
    setBubbles([]);
    setParticles([]);
    setTimeLeft(60);
    setIsGameOver(false);
    setIsActive(true);
  };

  const handleBubbleInteraction = (bubble: Bubble) => {
    if (isGameOver || bubble.isMerging) return;

    if (gameMode === 'zen') {
      playMergeSound();
      setBubbles((prev) => 
        prev.map((b) => b.id === bubble.id ? { ...b, isMerging: true } : b)
      );
      
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
        setVisualizerPulse(true);
        setTimeout(() => setVisualizerPulse(false), 600);
      }, 800);
    } else {
      playPopSound();
      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      setScore((s) => s + 10);

      const newParticles: Particle[] = [];
      const particleCount = 8;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        newParticles.push({
          id: Date.now() + Math.random(),
          x: bubble.x + 5,
          y: bubble.y + 5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: bubble.color,
        });
      }
      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        const idsToRemove = newParticles.map(p => p.id);
        setParticles(prev => prev.filter(p => !idsToRemove.includes(p.id)));
      }, 800);
    }
  };

  const resetGame = () => {
    setScore(0);
    setBubbles([]);
    setParticles([]);
    setIsActive(false);
    setIsGameOver(false);
    setTimeLeft(60);
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all h-full flex flex-col ${gameMode === 'challenge' && isActive && !isGameOver ? 'border-amber-200' : 'border-slate-100'}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Bubble Zen</h3>
          <p className="text-slate-500 text-sm">
            {gameMode === 'zen' ? 'Gently merge bubbles into the center orb.' : 'Speed challenge: Pop as many as you can!'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {gameMode === 'challenge' && (
            <>
              <div className="bg-cyan-50 px-4 py-2 rounded-xl text-cyan-700 font-bold border border-cyan-100 whitespace-nowrap">
                {score} <span className="text-[10px] uppercase ml-1">Points</span>
              </div>
              {isActive && (
                <div className={`text-sm font-bold tabular-nums ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                  0:{timeLeft.toString().padStart(2, '0')}
                </div>
              )}
            </>
          )}
          {gameMode === 'zen' && isActive && (
             <div className="bg-cyan-50/50 px-4 py-2 rounded-xl text-cyan-600/60 font-medium border border-cyan-100/50 text-xs">
                Relax & Flow
             </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden min-h-[400px] cursor-crosshair">
        {!isActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10 gap-4">
            <h4 className="text-slate-700 font-bold text-lg mb-2">Select Game Mode</h4>
            <div className="flex gap-4">
              <button 
                onClick={() => startGame('zen')}
                className="bg-cyan-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-700 transition-all hover:scale-105"
              >
                Zen Mode
              </button>
              <button 
                onClick={() => startGame('challenge')}
                className="bg-amber-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all hover:scale-105"
              >
                Timed Challenge
              </button>
            </div>
            <button 
              onClick={() => { initAudio(); setSoundEnabled(!soundEnabled); }}
              className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-600 transition-colors"
            >
              {soundEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
              Sound {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>
        ) : null}

        {gameMode === 'zen' && isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className={`w-32 h-32 rounded-full bg-cyan-100/30 border-2 border-cyan-200/50 transition-all duration-700 blur-xl ${visualizerPulse ? 'scale-150 opacity-100' : 'scale-100 opacity-60'}`} />
             <div className={`absolute w-16 h-16 rounded-full bg-cyan-400/20 border-4 border-white transition-all duration-700 ${visualizerPulse ? 'scale-125 rotate-180' : 'scale-100 rotate-0'}`} />
             <div className={`absolute w-8 h-8 rounded-full bg-white shadow-lg transition-all duration-300 ${visualizerPulse ? 'scale-150' : 'scale-100'}`} />
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-20 animate-in fade-in zoom-in duration-300">
             <div className="text-center p-8 rounded-3xl bg-white shadow-2xl border border-slate-100">
                <h4 className="text-3xl font-extrabold text-slate-900 mb-2">Challenge Over!</h4>
                <p className="text-slate-500 mb-6">Excellent focus.</p>
                <div className="text-6xl font-black text-cyan-600 mb-8">{score}</div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => startGame('challenge')}
                    className="w-full bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={resetGame}
                    className="w-full bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Back to Menu
                  </button>
                </div>
             </div>
          </div>
        )}

        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            onClick={() => handleBubbleInteraction(bubble)}
            disabled={isGameOver}
            className={`absolute rounded-full transition-all duration-[800ms] ${bubble.isMerging ? 'ease-in-out' : 'hover:scale-110 active:scale-90 animate-in fade-in zoom-in'} ${bubble.color} opacity-60 backdrop-blur-sm border border-white/50 shadow-inner group`}
            style={{
              left: bubble.isMerging ? '50%' : `${bubble.x}%`,
              top: bubble.isMerging ? '50%' : `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              transform: bubble.isMerging ? 'translate(-50%, -50%) scale(0)' : 'none',
              opacity: bubble.isMerging ? 0 : 0.6,
              zIndex: bubble.isMerging ? 50 : 10
            }}
          >
            <span className={`absolute inset-0 flex items-center justify-center text-white/40 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter ${bubble.isMerging ? 'hidden' : ''}`}>
              {gameMode === 'zen' ? 'MERGE' : 'POP'}
            </span>
          </button>
        ))}

        {gameMode === 'challenge' && particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full w-2 h-2 ${particle.color} opacity-80`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {isActive && !isGameOver && bubbles.length === 0 && particles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-300 animate-pulse italic">Watching the waves...</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
          {gameMode.toUpperCase()} MODE
        </p>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => { initAudio(); setSoundEnabled(!soundEnabled); }}
            className={`p-2 rounded-lg transition-all ${soundEnabled ? 'text-cyan-600 bg-cyan-50' : 'text-slate-300 hover:text-slate-400'}`}
          >
            {soundEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
          {(isActive || score > 0) && (
            <button 
              onClick={resetGame}
              className="text-xs text-slate-400 font-semibold hover:text-cyan-600 transition-colors"
            >
              Reset Session
            </button>
          )}
          {isActive && !isGameOver && (
            <button 
              onClick={() => { setIsActive(false); setBubbles([]); setParticles([]); setIsGameOver(false); }}
              className="text-xs text-rose-500 font-semibold hover:underline"
            >
              Exit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StressBusterGame;
