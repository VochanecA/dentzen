
import React, { useState, useEffect, useRef } from 'react';

type Soundscape = 'None' | 'Zen Pulse' | 'Deep Focus' | 'Ocean Waves' | 'Soft Rain';

const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [timer, setTimer] = useState(4);
  const [active, setActive] = useState(false);
  const [soundscape, setSoundscape] = useState<Soundscape>('Zen Pulse');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Phase Configuration
  const phaseConfig = {
    Inhale: { color: 'bg-cyan-400', ringColor: 'border-cyan-200', text: 'Slowly breathe in...', scale: 'scale-[1.5]' },
    Hold: { color: 'bg-teal-400', ringColor: 'border-teal-200', text: 'Hold that breath.', scale: 'scale-[1.5]' },
    Exhale: { color: 'bg-indigo-400', ringColor: 'border-indigo-200', text: 'Release gently.', scale: 'scale-90' },
    Pause: { color: 'bg-slate-400', ringColor: 'border-slate-200', text: 'Rest and wait.', scale: 'scale-75' }
  };

  // Audio Logic: Noise Generator for Nature Sounds
  const createNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      filterNodeRef.current = audioCtxRef.current.createBiquadFilter();
      
      filterNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioCtxRef.current.destination);
      gainNodeRef.current.gain.value = 0;
    }
  };

  const startSound = () => {
    if (!audioCtxRef.current || soundscape === 'None') return;
    
    // Stop previous sources
    if (oscillatorRef.current) { oscillatorRef.current.stop(); oscillatorRef.current = null; }
    if (noiseSourceRef.current) { noiseSourceRef.current.stop(); noiseSourceRef.current = null; }

    const now = audioCtxRef.current.currentTime;

    if (soundscape === 'Zen Pulse' || soundscape === 'Deep Focus') {
      oscillatorRef.current = audioCtxRef.current.createOscillator();
      oscillatorRef.current.type = soundscape === 'Deep Focus' ? 'triangle' : 'sine';
      oscillatorRef.current.connect(filterNodeRef.current!);
      oscillatorRef.current.start();
      filterNodeRef.current!.type = 'lowpass';
      filterNodeRef.current!.frequency.setValueAtTime(1000, now);
    } else if (soundscape === 'Ocean Waves' || soundscape === 'Soft Rain') {
      noiseSourceRef.current = audioCtxRef.current.createBufferSource();
      noiseSourceRef.current.buffer = createNoiseBuffer(audioCtxRef.current);
      noiseSourceRef.current.loop = true;
      noiseSourceRef.current.connect(filterNodeRef.current!);
      noiseSourceRef.current.start();
      
      filterNodeRef.current!.type = 'lowpass';
      filterNodeRef.current!.frequency.setValueAtTime(soundscape === 'Ocean Waves' ? 400 : 2000, now);
    }
  };

  const updateSound = () => {
    if (!gainNodeRef.current || !filterNodeRef.current || !active || soundscape === 'None') return;
    const now = audioCtxRef.current!.currentTime;
    
    if (soundscape === 'Zen Pulse' || soundscape === 'Deep Focus') {
      const freq = phase === 'Inhale' ? 330 : phase === 'Exhale' ? 220 : 270;
      oscillatorRef.current?.frequency.exponentialRampToValueAtTime(freq, now + 4);
      gainNodeRef.current.gain.linearRampToValueAtTime(phase === 'Pause' ? 0.02 : 0.1, now + 2);
    } else if (soundscape === 'Ocean Waves') {
      const cutoff = phase === 'Inhale' ? 1200 : phase === 'Exhale' ? 300 : 600;
      filterNodeRef.current.frequency.exponentialRampToValueAtTime(cutoff, now + 4);
      gainNodeRef.current.gain.linearRampToValueAtTime(phase === 'Inhale' ? 0.2 : 0.05, now + 4);
    } else if (soundscape === 'Soft Rain') {
      gainNodeRef.current.gain.linearRampToValueAtTime(0.08, now + 1);
      filterNodeRef.current.frequency.setValueAtTime(2000, now);
    }
  };

  const stopSound = () => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current!.currentTime + 0.5);
    }
  };

  useEffect(() => {
    let interval: any;
    if (active) {
      initAudio();
      startSound();
      updateSound();

      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setPhase((current) => {
              const next: Record<typeof phase, typeof phase> = { Inhale: 'Hold', Hold: 'Exhale', Exhale: 'Pause', Pause: 'Inhale' };
              return next[current];
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopSound();
    }
    return () => { clearInterval(interval); stopSound(); };
  }, [active]);

  useEffect(() => {
    if (active) {
      startSound();
      updateSound();
    }
  }, [soundscape]);

  useEffect(() => {
    if (active) updateSound();
  }, [phase]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[500px]">
      <div className="flex justify-between w-full mb-8 items-center z-20">
        <div>
          <h3 className="text-xl font-semibold text-slate-700">Breathing Guide</h3>
          <p className="text-xs text-slate-400">Box breathing for immediate calm.</p>
        </div>
        <select 
          value={soundscape}
          onChange={(e) => setSoundscape(e.target.value as Soundscape)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none text-slate-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="None">Silent</option>
          <option value="Zen Pulse">Zen Pulse</option>
          <option value="Deep Focus">Deep Focus</option>
          <option value="Ocean Waves">Ocean Waves</option>
          <option value="Soft Rain">Soft Rain</option>
        </select>
      </div>
      
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Visual Ripples */}
        <div className={`absolute w-full h-full rounded-full border-2 transition-all duration-[4000ms] ease-in-out ${phaseConfig[phase].ringColor} opacity-10 scale-150 blur-sm`} />
        <div className={`absolute w-full h-full rounded-full border border-dashed transition-all duration-[4000ms] ease-in-out ${phaseConfig[phase].ringColor} opacity-30 scale-125`} />
        
        {/* Pulsing Glow */}
        <div className={`absolute w-40 h-40 rounded-full transition-all duration-[4000ms] ease-in-out blur-2xl opacity-40 ${phaseConfig[phase].color} ${phaseConfig[phase].scale}`} />
        
        {/* Core Breathing Orb */}
        <div className={`absolute w-32 h-32 rounded-full transition-all duration-[4000ms] ease-in-out shadow-2xl border-4 border-white/50 ${phaseConfig[phase].color} ${phaseConfig[phase].scale}`} />
        
        {/* Timer Text */}
        <div className="z-10 text-center animate-in fade-in duration-700">
          <p className="text-4xl font-black text-white drop-shadow-md tabular-nums">{timer}</p>
          <p className="text-[10px] font-bold text-white/80 uppercase tracking-tighter">Seconds</p>
        </div>
      </div>

      <div className="mt-12 text-center min-h-[4rem] z-20">
        <p className={`text-xl font-bold transition-all duration-500 ${active ? 'text-slate-800 translate-y-0 opacity-100' : 'text-slate-300 translate-y-2 opacity-50'}`}>
          {active ? phaseConfig[phase].text : 'Find a comfortable seat.'}
        </p>
        <div className="flex justify-center gap-1.5 mt-4">
          {['Inhale', 'Hold', 'Exhale', 'Pause'].map((p) => (
            <div 
              key={p} 
              className={`h-1.5 rounded-full transition-all duration-700 ${phase === p && active ? 'w-12 bg-cyan-500' : 'w-8 bg-slate-100'}`} 
            />
          ))}
        </div>
      </div>

      <button 
        onClick={() => setActive(!active)}
        className={`mt-8 px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 z-20 ${active ? 'bg-slate-50 text-slate-400 border border-slate-200' : 'bg-slate-900 text-white shadow-2xl shadow-slate-200 hover:bg-slate-800'}`}
      >
        {active ? 'End Session' : 'Start Session'}
      </button>

      {/* Background Decorative Element */}
      <div className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-[4000ms] ${phaseConfig[phase].color} opacity-20`} />
    </div>
  );
};

export default BreathingExercise;
