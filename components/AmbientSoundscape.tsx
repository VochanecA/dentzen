
import React, { useState, useRef, useEffect } from 'react';

const SCAPES = [
  { id: 'rain', name: 'Summer Rain', icon: '🌧️', type: 'brown' },
  { id: 'forest', name: 'Forest Birds', icon: '🌲', type: 'pink' },
  { id: 'noise', name: 'Safe Static', icon: '📻', type: 'white' },
  { id: 'waves', name: 'Distant Tide', icon: '🌊', type: 'blue' }
];

const AmbientSoundscape: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  };

  const createNoiseBuffer = (type: string) => {
    if (!audioCtxRef.current) return null;
    const bufferSize = audioCtxRef.current.sampleRate * 2;
    const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    } else {
      // Basic brown/pink filter approximation
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    }
    return buffer;
  };

  const playSound = (id: string) => {
    initAudio();
    if (noiseSourceRef.current) {
      noiseSourceRef.current.stop();
      noiseSourceRef.current = null;
    }

    if (activeId === id) {
      setActiveId(null);
      return;
    }

    const scape = SCAPES.find(s => s.id === id);
    const buffer = createNoiseBuffer(scape?.type || 'white');
    if (buffer && audioCtxRef.current && gainNodeRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNodeRef.current);
      source.start();
      noiseSourceRef.current = source;
      setActiveId(id);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current?.currentTime || 0 + 0.1);
    }
  }, [volume]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">Safe Ambience</h3>
        <span className="text-[10px] bg-cyan-50 px-2 py-0.5 rounded-full font-bold text-cyan-400 uppercase tracking-tight">Audio Shield</span>
      </div>
      
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">Mask clinical sounds with high-frequency comfort loops. Best used with headphones.</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {SCAPES.map((scape) => (
          <button
            key={scape.id}
            onClick={() => playSound(scape.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${activeId === scape.id ? 'bg-cyan-600 border-cyan-600 shadow-lg shadow-cyan-100' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
          >
            <span className="text-2xl">{scape.icon}</span>
            <span className={`text-[10px] font-black uppercase tracking-tight ${activeId === scape.id ? 'text-white' : 'text-slate-500'}`}>{scape.name}</span>
            {activeId === scape.id && (
              <div className="flex gap-0.5 items-center mt-1">
                 {[1,2,3].map(i => <div key={i} className="w-0.5 h-2 bg-white/60 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600"
        />
      </div>
    </div>
  );
};

export default AmbientSoundscape;
