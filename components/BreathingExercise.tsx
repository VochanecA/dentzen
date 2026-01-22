
import React, { useState, useEffect, useRef, useMemo } from 'react';

type Soundscape = 'None' | 'Zen Pulse' | 'Deep Focus' | 'Ocean Waves' | 'Soft Rain';
type BreathPattern = 'Box' | '4-7-8' | 'Coherent' | 'Equal' | 'Custom';

interface Phase {
  name: string;
  duration: number;
}

interface PatternConfig {
  name: string;
  description: string;
  phases: Phase[];
}

const DEFAULT_PATTERNS: Record<Exclude<BreathPattern, 'Custom'>, PatternConfig> = {
  Box: {
    name: 'Box Breathing',
    description: 'Navy SEAL technique to reset the nervous system during high stress.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Pause', duration: 4 }
    ]
  },
  '4-7-8': {
    name: 'Sedative Breath',
    description: 'Natural tranquilizer for the nervous system. Best for intense fear.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 }
    ]
  },
  Coherent: {
    name: 'Coherent Breathing',
    description: 'Optimizes heart rate variability for deep physiological resilience.',
    phases: [
      { name: 'Inhale', duration: 5.5 },
      { name: 'Exhale', duration: 5.5 }
    ]
  },
  Equal: {
    name: 'Equal Balance',
    description: 'A simple rhythm to maintain steady calm throughout the clinical day.',
    phases: [
      { name: 'Inhale', duration: 5 },
      { name: 'Exhale', duration: 5 }
    ]
  }
};

const BreathingExercise: React.FC = () => {
  const [patternType, setPatternType] = useState<BreathPattern>('Box');
  const [customPhases, setCustomPhases] = useState<Phase[]>([
    { name: 'Inhale', duration: 4 },
    { name: 'Exhale', duration: 6 }
  ]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timer, setTimer] = useState(4);
  const [active, setActive] = useState(false);
  const [soundscape, setSoundscape] = useState<Soundscape>('Zen Pulse');
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  const currentPattern = useMemo(() => {
    if (patternType === 'Custom') {
      return {
        name: 'Custom Flow',
        description: 'Your personalized rhythm for relaxation.',
        phases: customPhases
      };
    }
    return DEFAULT_PATTERNS[patternType];
  }, [patternType, customPhases]);

  const currentPhase = currentPattern.phases[phaseIndex];

  const progress = useMemo(() => {
    const total = currentPhase.duration;
    return Math.max(0, Math.min(100, ((total - timer) / total) * 100));
  }, [timer, currentPhase]);

  const getPhaseStyles = (name: string) => {
    switch (name) {
      case 'Inhale': return { color: 'bg-cyan-400', ring: 'stroke-cyan-400', text: 'Breathe In...', scale: 'scale-[1.5]', orbOpacity: 'opacity-100' };
      case 'Hold': return { color: 'bg-teal-400', ring: 'stroke-teal-400', text: 'Hold the breath...', scale: 'scale-[1.5]', orbOpacity: 'opacity-80' };
      case 'Exhale': return { color: 'bg-indigo-400', ring: 'stroke-indigo-400', text: 'Slowly Exhale...', scale: 'scale-100', orbOpacity: 'opacity-60' };
      case 'Pause': return { color: 'bg-slate-400', ring: 'stroke-slate-400', text: 'Rest...', scale: 'scale-[0.85]', orbOpacity: 'opacity-40' };
      default: return { color: 'bg-slate-400', ring: 'stroke-slate-400', text: 'Ready?', scale: 'scale-100', orbOpacity: 'opacity-100' };
    }
  };

  const styles = getPhaseStyles(currentPhase.name);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      filterNodeRef.current = audioCtxRef.current.createBiquadFilter();
      filterNodeRef.current.type = 'lowpass';
      filterNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioCtxRef.current.destination);
      gainNodeRef.current.gain.value = 0;
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  };

  const startSound = () => {
    if (!audioCtxRef.current || soundscape === 'None') return;
    if (oscillatorRef.current) { oscillatorRef.current.stop(); oscillatorRef.current = null; }
    if (noiseSourceRef.current) { noiseSourceRef.current.stop(); noiseSourceRef.current = null; }

    if (soundscape === 'Zen Pulse' || soundscape === 'Deep Focus') {
      oscillatorRef.current = audioCtxRef.current.createOscillator();
      oscillatorRef.current.type = soundscape === 'Deep Focus' ? 'triangle' : 'sine';
      oscillatorRef.current.connect(filterNodeRef.current!);
      oscillatorRef.current.start();
    } else if (soundscape === 'Ocean Waves' || soundscape === 'Soft Rain') {
      noiseSourceRef.current = audioCtxRef.current.createBufferSource();
      const bufferSize = audioCtxRef.current.sampleRate * 4;
      const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      noiseSourceRef.current.buffer = buffer;
      noiseSourceRef.current.loop = true;
      noiseSourceRef.current.connect(filterNodeRef.current!);
      noiseSourceRef.current.start();
    }
  };

  const updateSound = () => {
    if (!gainNodeRef.current || !filterNodeRef.current || !active || soundscape === 'None') return;
    const now = audioCtxRef.current!.currentTime;
    const isRest = currentPhase.name === 'Pause' || currentPhase.name === 'Hold';

    if (soundscape === 'Zen Pulse' || soundscape === 'Deep Focus') {
      const freq = currentPhase.name === 'Inhale' ? 330 : currentPhase.name === 'Exhale' ? 220 : 275;
      oscillatorRef.current?.frequency.exponentialRampToValueAtTime(freq, now + 1.2);
      gainNodeRef.current.gain.linearRampToValueAtTime(isRest ? 0.04 : 0.09, now + 0.8);
    } else if (soundscape === 'Ocean Waves') {
      const cutoff = currentPhase.name === 'Inhale' ? 1400 : currentPhase.name === 'Exhale' ? 400 : 800;
      filterNodeRef.current.frequency.exponentialRampToValueAtTime(cutoff, now + 1.5);
      gainNodeRef.current.gain.linearRampToValueAtTime(currentPhase.name === 'Inhale' ? 0.12 : 0.04, now + 1.5);
    }
  };

  const stopSound = () => {
    if (gainNodeRef.current) gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current?.currentTime || 0 + 0.5);
  };

  useEffect(() => {
    let interval: any;
    if (active) {
      initAudio();
      startSound();
      updateSound();
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0.1) {
            setPhaseIndex((idx) => {
              const nextIdx = (idx + 1) % currentPattern.phases.length;
              setTimer(currentPattern.phases[nextIdx].duration);
              return nextIdx;
            });
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    } else {
      stopSound();
    }
    return () => { clearInterval(interval); stopSound(); };
  }, [active, patternType, currentPattern, soundscape]);

  const handlePatternChange = (p: BreathPattern) => {
    setPatternType(p);
    const pattern = p === 'Custom' ? { phases: customPhases } : DEFAULT_PATTERNS[p];
    setPhaseIndex(0);
    setTimer(pattern.phases[0].duration);
    if (!active) setActive(false);
  };

  const updateCustomPhase = (index: number, duration: number) => {
    const newPhases = [...customPhases];
    newPhases[index].duration = duration;
    setCustomPhases(newPhases);
    if (patternType === 'Custom' && phaseIndex === index) {
      setTimer(duration);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative min-h-[720px] transition-all duration-700">
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${active ? 'opacity-10' : 'opacity-0'} ${styles.color}`} />
      
      <div className="w-full flex justify-between items-center mb-6 z-20">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Breath Architect</h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Align your rhythm</p>
        </div>
        <div className="flex gap-2">
           <select 
            value={soundscape}
            onChange={(e) => setSoundscape(e.target.value as Soundscape)}
            className="text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none text-slate-600 focus:ring-4 focus:ring-cyan-500/10 transition-all cursor-pointer"
          >
            {['None', 'Zen Pulse', 'Deep Focus', 'Ocean Waves', 'Soft Rain'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="w-full grid grid-cols-5 gap-1 mb-6 z-20">
        {(Object.keys(DEFAULT_PATTERNS).concat(['Custom']) as BreathPattern[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePatternChange(p)}
            className={`py-3 px-1 rounded-2xl text-[8px] font-black uppercase tracking-tighter transition-all border ${patternType === p ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {patternType === 'Custom' && (
        <div className="w-full bg-slate-50 p-4 rounded-2xl mb-6 z-20 border border-slate-100 animate-in fade-in slide-in-from-top-2">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Adjust Durations</p>
          <div className="flex gap-4">
            {customPhases.map((ph, idx) => (
              <div key={idx} className="flex-1 flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500">{ph.name} (s)</label>
                <input 
                  type="number" min="1" max="20" step="0.5"
                  value={ph.duration}
                  onChange={(e) => updateCustomPhase(idx, parseFloat(e.target.value))}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative w-64 h-64 flex items-center justify-center mb-10">
        <svg className="absolute w-full h-full -rotate-90 pointer-events-none">
          <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-50" />
          <circle 
            cx="128" cy="128" r="110" 
            stroke="currentColor" strokeWidth="6" fill="transparent" 
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
            strokeLinecap="round"
            className={`${styles.ring} transition-all duration-150 ease-linear`}
          />
        </svg>

        <div className={`absolute w-48 h-48 rounded-full transition-all duration-[1000ms] ease-in-out blur-3xl ${styles.color} ${styles.scale} ${styles.orbOpacity}`} />
        <div className={`absolute w-44 h-44 rounded-full transition-all duration-[1000ms] ease-in-out border-8 border-white shadow-2xl ${styles.color} ${styles.scale}`} />
        
        <div className="z-10 text-center select-none">
           <p className="text-6xl font-black text-white drop-shadow-xl tabular-nums tracking-tighter">{Math.ceil(timer)}</p>
           <p className="text-[10px] font-black text-white/90 uppercase tracking-[0.3em]">{currentPhase.name}</p>
        </div>
      </div>

      <div className="text-center min-h-[90px] z-20 flex flex-col items-center justify-center">
        <h4 className={`text-2xl font-black transition-all duration-700 tracking-tight ${active ? 'text-slate-900' : 'text-slate-300'}`}>
          {active ? styles.text : 'Ready to begin?'}
        </h4>
        <p className="text-xs text-slate-400 max-w-[260px] mt-3 leading-relaxed font-medium">
          {active ? currentPattern.description : 'Align your breath with the visual guide to naturally soothe your amygdala.'}
        </p>
      </div>

      <button 
        onClick={() => { initAudio(); setActive(!active); }}
        className={`mt-auto w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.25em] transition-all transform active:scale-95 z-20 shadow-xl ${active ? 'bg-white text-rose-500 border border-rose-100' : 'bg-cyan-600 text-white shadow-cyan-200 hover:bg-cyan-700'}`}
      >
        {active ? 'Interrupt Session' : 'Begin sequence'}
      </button>

      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-50 z-10">
        <div 
          className={`h-full transition-all duration-300 ease-out ${styles.color}`} 
          style={{ width: `${((phaseIndex + 1) / currentPattern.phases.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default BreathingExercise;
