
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
  life: number; // 0 to 1
  color: string;
}

const ALASKA_IMAGES = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1533512930330-4ac257c86793?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000"
];

const StressBusterGame: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('zen');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [visualizerPulse, setVisualizerPulse] = useState(false);
  const [orbActive, setOrbActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const colors = ['bg-cyan-200', 'bg-teal-200', 'bg-indigo-200', 'bg-blue-200', 'bg-sky-200'];

  // --- Background Rotation ---
  useEffect(() => {
    let interval: any;
    if (isActive && !isGameOver) {
      interval = setInterval(() => {
        setBgIndex((prev) => (prev + 1) % ALASKA_IMAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isActive, isGameOver]);

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
    const x = Math.random() * 85; 
    const y = Math.random() * 85; 
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

  // Particle Physics Engine
  useEffect(() => {
    let animationFrame: number;
    const updateParticles = () => {
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.04,
            life: p.life - 0.015,
          }))
          .filter((p) => p.life > 0 && p.y < 110 && p.x > -10 && p.x < 110)
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

  const createBurst = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    const particleCount = gameMode === 'zen' ? 12 : 18;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      newParticles.push({
        id: Math.random() + Date.now(),
        x: x + 5, 
        y: y + 5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: color,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handleBubbleInteraction = (bubble: Bubble) => {
    if (isGameOver || bubble.isMerging) return;

    if (gameMode === 'zen') {
      playMergeSound();
      setBubbles((prev) => 
        prev.map((b) => b.id === bubble.id ? { ...b, isMerging: true } : b)
      );
      
      // Animate the central orb
      setOrbActive(true);
      setTimeout(() => setOrbActive(false), 500);

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
        setVisualizerPulse(true);
        createBurst(50, 50, bubble.color); 
        setTimeout(() => setVisualizerPulse(false), 600);
      }, 800);
    } else {
      playPopSound();
      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      setScore((s) => s + 10);
      createBurst(bubble.x, bubble.y, bubble.color);
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
          <h3 className="text-xl font-semibold text-slate-800">Wilderness Bubbles</h3>
          <p className="text-slate-500 text-sm">
            {gameMode === 'zen' ? 'Gently merge into the center orb while breathing.' : 'Focus challenge: Clear the triggers!'}
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
                Alaska Calm
             </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-slate-900 rounded-xl border border-slate-100 overflow-hidden min-h-[450px] cursor-crosshair group">
        
        {/* Alaska Wilderness Background */}
        <div className="absolute inset-0 z-0">
          {ALASKA_IMAGES.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${bgIndex === idx && isActive ? 'opacity-40' : 'opacity-0'}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[0.5px]" />
        </div>

        {!isActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md z-30 gap-4">
            <h4 className="text-slate-700 font-bold text-lg mb-2">Select Focus Mode</h4>
            <div className="flex gap-4">
              <button 
                onClick={() => startGame('zen')}
                className="bg-cyan-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-700 transition-all hover:scale-105"
              >
                Zen Calm
              </button>
              <button 
                onClick={() => startGame('challenge')}
                className="bg-amber-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all hover:scale-105"
              >
                Timed Focus
              </button>
            </div>
            <button 
              onClick={() => { initAudio(); setSoundEnabled(!soundEnabled); }}
              className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-600 transition-colors"
            >
              Sound {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>
        ) : null}

        {/* ZEN ORB VISUALIZER - ENHANCED */}
        {gameMode === 'zen' && isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
             {/* Deep Halo Layer */}
             <div className={`absolute rounded-full bg-cyan-500/10 blur-[60px] transition-all duration-1000 ${orbActive ? 'w-80 h-80 opacity-60' : 'w-40 h-40 opacity-20'}`} />
             {/* Outer Glow Ring */}
             <div className={`absolute rounded-full border border-white/20 blur-sm transition-all duration-700 ${orbActive ? 'w-56 h-56 scale-110 opacity-40' : 'w-48 h-48 scale-100 opacity-20'}`} />
             {/* Main Orb Body with Soft Texture */}
             <div className={`absolute rounded-full bg-gradient-to-br from-white/20 to-cyan-100/10 border-2 border-white/30 backdrop-blur-xl transition-all duration-700 ease-out ${orbActive ? 'w-32 h-32 scale-125 border-cyan-300/50 shadow-[0_0_50px_rgba(34,211,238,0.3)]' : 'w-24 h-24 scale-100'}`} />
             {/* Pulse Ripple Effect */}
             <div className={`absolute rounded-full border-2 border-white/40 transition-all duration-[1500ms] ${visualizerPulse ? 'w-64 h-64 opacity-0 scale-[2.5]' : 'w-24 h-24 opacity-100 scale-100'}`} />
             {/* Inner core - Solid Grounding Point */}
             <div className={`rounded-full bg-white shadow-2xl transition-all duration-700 ${orbActive ? 'w-16 h-16 shadow-cyan-400/50' : 'w-12 h-12'}`} />
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-40 animate-in fade-in zoom-in duration-300">
             <div className="text-center p-8 rounded-3xl bg-white shadow-2xl border border-slate-100">
                <h4 className="text-3xl font-extrabold text-slate-900 mb-2">Focus Session Over</h4>
                <p className="text-slate-500 mb-6">Great concentration.</p>
                <div className="text-6xl font-black text-cyan-600 mb-8">{score}</div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => startGame('challenge')}
                    className="w-full bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all"
                  >
                    Restart Challenge
                  </button>
                  <button 
                    onClick={resetGame}
                    className="w-full bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Main Menu
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* Bubble Layer */}
        <div className="relative z-20 w-full h-full">
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              onClick={() => handleBubbleInteraction(bubble)}
              disabled={isGameOver}
              className={`absolute rounded-full transition-all duration-[800ms] ${bubble.isMerging ? 'ease-in-out' : 'hover:scale-110 active:scale-90 animate-in fade-in zoom-in'} ${bubble.color} opacity-70 backdrop-blur-md border border-white/40 shadow-xl group`}
              style={{
                left: bubble.isMerging ? '50%' : `${bubble.x}%`,
                top: bubble.isMerging ? '50%' : `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                transform: bubble.isMerging ? 'translate(-50%, -50%) scale(0.1)' : 'none',
                opacity: bubble.isMerging ? 0.2 : 0.7,
                zIndex: bubble.isMerging ? 5 : 10
              }}
            >
              <span className={`absolute inset-0 flex items-center justify-center text-white text-[11px] font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest drop-shadow-md ${bubble.isMerging ? 'hidden' : ''}`}>
                {gameMode === 'zen' ? 'Gently' : 'Target'}
              </span>
            </button>
          ))}
        </div>

        {/* Particle Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full w-2 h-2 ${particle.color} shadow-lg shadow-white/20`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: particle.life,
                scale: particle.life
              }}
            />
          ))}
        </div>

        {isActive && !isGameOver && bubbles.length === 0 && particles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <p className="text-white/40 animate-pulse italic text-sm tracking-widest">Breathing in harmony...</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
          {gameMode} MODE • ALASKA WILDERNESS
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
          {(isActive || score > 0) && (
            <button 
              onClick={resetGame}
              className="text-xs text-slate-400 font-bold hover:text-cyan-600 transition-colors uppercase tracking-tight"
            >
              Reset Session
            </button>
          )}
          {isActive && !isGameOver && (
            <button 
              onClick={() => { setIsActive(false); setBubbles([]); setParticles([]); setIsGameOver(false); }}
              className="text-xs text-rose-500 font-bold hover:underline uppercase tracking-tight"
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
