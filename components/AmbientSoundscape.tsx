import React, { useState, useRef, useEffect } from 'react';

const SCAPES = [
  { id: 'rain', name: 'Summer Rain', icon: '🌧️', soundFile: 'summer-rain.mp3' },
  { id: 'forest', name: 'Forest Birds', icon: '🌲', soundFile: 'forest-birds.mp3' },
  { id: 'noise', name: 'Safe Static', icon: '📻', soundFile: 'safe-static.mp3' },
  { id: 'waves', name: 'Distant Tide', icon: '🌊', soundFile: 'distant-tide.mp3' }
];

// Definisanje tipova za audio reference
type AudioRefsType = {
  [key: string]: HTMLAudioElement | null;
};

const AmbientSoundscape: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // Koristimo pravilne TypeScript tipove
  const audioRefs = useRef<AudioRefsType>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Pomoćna funkcija za zaustavljanje svih zvukova
  const stopAllSounds = () => {
    // Zaustavi sve HTMLAudio elemente
    Object.keys(audioRefs.current).forEach(key => {
      const audio = audioRefs.current[key];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // Zaustavi generisani zvuk
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch (e) {
        // Ignoriši greške ako je već zaustavljeno
      }
      noiseSourceRef.current = null;
    }
  };

  // Inicijalizacija audio konteksta
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // Kreiranje audio elementa za svaki zvuk
  const createAudioElement = (scapeId: string, soundFile: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
      const existingAudio = audioRefs.current[scapeId];
      if (existingAudio) {
        resolve(existingAudio);
        return;
      }

      const audio = new Audio(`/sounds/${soundFile}`);
      audio.loop = true;
      audio.preload = 'metadata';
      
      audio.onloadeddata = () => {
        audioRefs.current[scapeId] = audio;
        resolve(audio);
      };
      
      audio.onerror = (error) => {
        console.error(`Error loading sound ${soundFile}:`, error);
        reject(error);
      };
      
      audio.load();
    });
  };

  // Povezivanje audio elementa sa AudioContext
  const connectAudioToContext = (audioElement: HTMLAudioElement) => {
    if (!audioContextRef.current || !gainNodeRef.current) return null;
    
    try {
      const source = audioContextRef.current.createMediaElementSource(audioElement);
      source.connect(gainNodeRef.current);
      return source;
    } catch (error) {
      console.error('Error connecting audio to context:', error);
      return null;
    }
  };

  // Reprodukcija zvuka
  const playSound = async (scapeId: string) => {
    try {
      initAudioContext();
      
      // Zaustavi sve zvukove pre nego što pokreneš novi
      stopAllSounds();
      
      // Ako kliknemo na aktivni zvuk, zaustavi ga
      if (activeId === scapeId) {
        setActiveId(null);
        return;
      }
      
      setIsLoading(scapeId);
      
      const scape = SCAPES.find(s => s.id === scapeId);
      if (!scape) return;
      
      // Kreiraj audio element ako ne postoji
      let audio = audioRefs.current[scapeId];
      if (!audio) {
        audio = await createAudioElement(scapeId, scape.soundFile);
      }
      
      // Poveži sa AudioContext
      const source = connectAudioToContext(audio);
      if (!source) {
        throw new Error('Could not connect audio to context');
      }
      
      // Postavi volumen na AudioContext
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = volume;
      }
      
      // Postavi volumen na audio element
      audio.volume = volume;
      
      // Pokreni reprodukciju
      await audio.play();
      setActiveId(scapeId);
      
    } catch (error) {
      console.error('Error playing MP3 sound, falling back to generated sound:', error);
      // Fallback na generisani šum ako MP3 ne radi
      playGeneratedSound(scapeId);
    } finally {
      setIsLoading(null);
    }
  };

  // Fallback funkcija za generisani šum
  const playGeneratedSound = (scapeId: string) => {
    try {
      initAudioContext();
      
      if (!audioContextRef.current || !gainNodeRef.current) {
        throw new Error('Audio context not available');
      }
      
      // Zaustavi sve zvukove
      stopAllSounds();
      
      // Ako kliknemo na aktivni zvuk, zaustavi ga
      if (activeId === scapeId) {
        setActiveId(null);
        return;
      }
      
      const bufferSize = audioContextRef.current.sampleRate * 2;
      const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
      const output = buffer.getChannelData(0);
      
      // Generisanje različitih vrsta šuma
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        
        switch (scapeId) {
          case 'rain':
            // Kiša - brown šum
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            break;
          case 'forest':
            // Šuma - pink šum sa varijacijama
            output[i] = (lastOut + (0.03 * white)) / 1.03;
            break;
          case 'noise':
            // Statika - white šum
            output[i] = white * 0.5;
            break;
          case 'waves':
            // Talasi - filtered šum sa oscilacijama
            output[i] = (lastOut + (0.015 * white)) / 1.015;
            break;
          default:
            output[i] = white * 0.3;
        }
        
        lastOut = output[i];
      }
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNodeRef.current);
      source.start();
      
      noiseSourceRef.current = source;
      setActiveId(scapeId);
    } catch (error) {
      console.error('Error playing generated sound:', error);
      setActiveId(null);
    }
  };

  // Postavljanje volumena - FIXED VERSION
  useEffect(() => {
    // Postavi volumen na AudioContext
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
    
    // Postavi volumen na sve audio elemente
    Object.keys(audioRefs.current).forEach(key => {
      const audio = audioRefs.current[key];
      if (audio) {
        audio.volume = volume;
      }
    });
  }, [volume]);

  // Čišćenje pri unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      
      // Zatvori AudioContext
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">Safe Ambience</h3>
        <span className="text-[10px] bg-cyan-50 px-2 py-0.5 rounded-full font-bold text-cyan-400 uppercase tracking-tight">Audio Shield</span>
      </div>
      
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        Mask clinical sounds with soothing ambient loops. 
        {/* <span className="block mt-1 text-cyan-600 font-medium">
          📁 Sounds from: /public/sounds/
        </span> */}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {SCAPES.map((scape) => (
          <button
            key={scape.id}
            onClick={() => playSound(scape.id)}
            disabled={isLoading === scape.id}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all relative
              ${activeId === scape.id 
                ? 'bg-cyan-600 border-cyan-600 shadow-lg shadow-cyan-100' 
                : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-slate-100'
              }
              ${isLoading === scape.id ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {isLoading === scape.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            <span className="text-2xl">{scape.icon}</span>
            <span className={`text-[10px] font-black uppercase tracking-tight 
              ${activeId === scape.id ? 'text-white' : 'text-slate-500'}`}>
              {scape.name}
            </span>
            
            {activeId === scape.id && !isLoading && (
              <div className="flex gap-0.5 items-center mt-1">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className="w-0.5 h-2 bg-white/60 animate-pulse" 
                    style={{ animationDelay: `${i * 0.2}s` }} 
                  />
                ))}
              </div>
            )}
            
            {!activeId && !isLoading && (
              <div className="text-[8px] text-slate-400 mt-1">
                Click to play
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
          type="range" 
          min="0" 
          max="1" 
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600"
        />
      </div>

      {/* Status bar */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {activeId ? (
              <span className="text-cyan-600 font-medium">
                ▶️ Playing: {SCAPES.find(s => s.id === activeId)?.name}
              </span>
            ) : (
              '⏸️ No sound playing'
            )}
          </div>
          
          {activeId && (
            <button
              onClick={() => {
                stopAllSounds();
                setActiveId(null);
              }}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 transition-all"
            >
              Stop All
            </button>
          )}
        </div>
        
        {/* Debug info - samo u development modu */}
        {process.env.NODE_ENV === 'development' && activeId && (
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-2">
            {audioRefs.current[activeId] ? (
              <>
                <span>🔊 Using MP3 file</span>
                {/* <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded">
                  /sounds/{SCAPES.find(s => s.id === activeId)?.soundFile}
                </span> */}
              </>
            ) : (
              <span>🔈 Using generated sound (fallback)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbientSoundscape;