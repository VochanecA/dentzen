
import React, { useState } from 'react';

const ExposureTool: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);

  const sounds = [
    { id: 'drill', name: 'Water-Cooled Polish', description: 'Often mistaken for the drill, this is used to polish and clean surfaces.', color: 'blue' },
    { id: 'suction', name: 'Gentle Air Flow', description: 'Removes water to keep your mouth dry and comfortable.', color: 'teal' },
    { id: 'scaler', name: 'Sonic Cleaner', description: 'Uses vibrations to gently flick away hard plaque.', color: 'cyan' }
  ];

  const handlePlay = (id: string) => {
    setPlaying(id === playing ? null : id);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-semibold mb-2 text-slate-800">Zen Tool Sounds</h3>
      <p className="text-slate-500 mb-6">Listen to softened versions of common dental sounds to normalize them.</p>

      <div className="space-y-4">
        {sounds.map((sound) => (
          <div key={sound.id} className="group p-4 rounded-xl border border-slate-100 hover:border-cyan-200 transition-all bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-700">{sound.name}</span>
              <button 
                onClick={() => handlePlay(sound.id)}
                className={`p-2 rounded-full ${playing === sound.id ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600 border border-cyan-100'}`}
              >
                {playing === sound.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{sound.description}</p>
            {playing === sound.id && (
              <div className="mt-3 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 animate-[pulse_2s_infinite]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExposureTool;
