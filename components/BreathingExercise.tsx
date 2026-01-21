
import React, { useState, useEffect, useRef } from 'react';

type Soundscape = 'None' | 'Zen Pulse' | 'Deep Focus' | 'Ocean Breath';

const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [timer, setTimer] = useState(4);
  const [active, setActive] = useState(false);
  const [soundscape, setSoundscape] = useState<Soundscape>('Zen Pulse');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Phase Configuration
  const phaseConfig = {
    Inhale: { color: 'bg-cyan-400', ringColor: 'border-cyan-200', text: 'Slowly breathe in...', scale: 'scale-[1.4]' },
    Hold: { color: 'bg-teal-400', ringColor: 'border-teal-200', text: 'Hold that breath.', scale: 'scale-[1.4]' },
    Exhale: { color: 'bg-indigo-400', ringColor: 'border-indigo-200', text: 'Release gently.', scale: 'scale-75' },
    Pause: { color: 'bg-slate-400', ringColor: 'border-slate-200', text: 'Rest and wait.', scale: 'scale-75' }
  };

  // Audio Logic
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.connect(audioCtxRef.current.destination);
      gainNodeRef.current.gain.value = 0;
    }
  };

  const startTone = () => {
    if (!audioCtxRef.current || soundscape === 'None') return;
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    oscillatorRef.current = audioCtxRef.current.createOscillator();
    oscillatorRef.current.type = soundscape === 'Deep Focus' ? 'triangle' : 'sine';
    oscillatorRef.current.connect(gainNodeRef.current!);
    oscillatorRef.current.start();
  };

  const updateTone = () => {
    if (!gainNodeRef.current || !oscillatorRef.current || !active || soundscape === 'None') return;

    const now = audioCtxRef.current!.currentTime;
    
    // Smooth frequency and volume shifts based on phase
    if (phase === 'Inhale') {
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(330, now + 4);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.1, now + 2);
    } else if (phase === 'Exhale') {
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(220, now + 4);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.05, now + 2);
    } else if (phase === 'Hold') {
      gainNodeRef.current.gain.linearRampToValueAtTime(0.08, now + 0.5);
    } else {
      gainNodeRef.current.gain.linearRampToValueAtTime(0.02, now + 0.5);
    }
  };

  const stopTone = () => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current!.currentTime + 0.5);
    }
  };

  useEffect(() => {
    let interval: any;
    if (active) {
      initAudio();
      startTone();
      updateTone();

      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setPhase((current) => {
              if (current === 'Inhale') return 'Hold';
              if (current === 'Hold') return 'Exhale';
              if (current === 'Exhale') return 'Pause';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopTone();
    }
    return () => {
      clearInterval(interval);
      stopTone();
    };
  }, [active]);

  useEffect(() => {
    if (active) updateTone();
  }, [phase, soundscape]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
      <div className="flex justify-between w-full mb-6 items-center">
        <h3 className="text-xl font-semibold text-slate-700">Box Breathing</h3>
        <select 
          value={soundscape}
          onChange={(e) => setSoundscape(e.target.value as Soundscape)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="None">Silent</option>
          <option value="Zen Pulse">Zen Pulse</option>
          <option value="Deep Focus">Deep Focus</option>
          <option value="Ocean Breath">Ocean Breath</option>
        </select>
      </div>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background Rings */}
        <div className={`absolute w-full h-full rounded-full border-4 transition-all duration-[4000ms] ease-in-out ${phaseConfig[phase].ringColor} opacity-20 scale-110`} />
        
        {/* Breathing Orb */}
        <div className={`absolute w-32 h-32 rounded-full transition-all duration-[4000ms] ease-in-out blur-sm opacity-60 ${phaseConfig[phase].color} ${phaseConfig[phase].scale}`} />
        
        {/* Core Content */}
        <div className="z-10 text-center animate-in fade-in duration-700">
          <p className="text-3xl font-bold text-slate-800 uppercase tracking-widest tabular-nums">{timer}</p>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Seconds left</p>
        </div>
      </div>

      <div className="mt-8 text-center min-h-[3rem]">
        <p className={`text-lg font-medium transition-colors duration-500 ${active ? 'text-slate-700' : 'text-slate-300'}`}>
          {active ? phaseConfig[phase].text : 'Ready to start?'}
        </p>
        <p className="text-xs text-slate-400 mt-2 italic">
          Phase: <span className="font-bold text-cyan-600">{active ? phase : 'Waiting'}</span>
        </p>
      </div>

      <button 
        onClick={() => setActive(!active)}
        className={`mt-6 px-10 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 ${active ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-xl shadow-cyan-100'}`}
      >
        {active ? 'Stop Exercise' : 'Begin Relaxation'}
      </button>

      <div className="mt-6 flex gap-1">
        {['Inhale', 'Hold', 'Exhale', 'Pause'].map((p) => (
          <div 
            key={p} 
            className={`h-1.5 w-10 rounded-full transition-all duration-500 ${phase === p && active ? 'bg-cyan-500 scale-y-125' : 'bg-slate-100'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default BreathingExercise;
