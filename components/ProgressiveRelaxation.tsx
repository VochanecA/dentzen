
import React, { useState, useEffect } from 'react';

interface MuscleGroup {
  name: string;
  instruction: string;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  { name: 'Feet & Calves', instruction: 'Curl your toes tightly and tense your calves.' },
  { name: 'Thighs & Glutes', instruction: 'Squeeze your thigh muscles and glutes as hard as you can.' },
  { name: 'Stomach & Back', instruction: 'Pull your belly button toward your spine and tense your core.' },
  { name: 'Hands & Arms', instruction: 'Make tight fists and flex your biceps.' },
  { name: 'Shoulders', instruction: 'Hike your shoulders up to your ears and hold.' },
  { name: 'Face & Jaw', instruction: 'Scrunched up your face and press your lips together (no teeth clenching).' }
];

const ProgressiveRelaxation: React.FC = () => {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'release' | 'ready'>('ready');
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (active) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            if (phase === 'tense') {
              setPhase('release');
              return 10; // Release for 10 seconds
            } else if (phase === 'release') {
              if (step < MUSCLE_GROUPS.length - 1) {
                setStep(s => s + 1);
                setPhase('tense');
                return 5; // Tense for 5 seconds
              } else {
                setActive(false);
                setPhase('ready');
                return 0;
              }
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [active, phase, step]);

  const startExercise = () => {
    setStep(0);
    setPhase('tense');
    setTimer(5);
    setActive(true);
  };

  const currentGroup = MUSCLE_GROUPS[step];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">Muscle Release</h3>
        <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded-full font-bold text-indigo-400 uppercase tracking-tight">PMR Therapy</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 min-h-[200px]">
        {!active && phase === 'ready' ? (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
               </svg>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed px-4">Tense and release muscle groups to physically "dump" adrenaline from your system.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
             <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-600 mb-2">Step {step + 1} of {MUSCLE_GROUPS.length}</div>
             <h4 className="text-2xl font-black text-slate-800">{currentGroup.name}</h4>
             <div className={`text-sm font-medium p-4 rounded-xl border transition-all duration-500 ${phase === 'tense' ? 'bg-rose-50 border-rose-100 text-rose-700 scale-105' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                {phase === 'tense' ? `TENSE: ${currentGroup.instruction}` : 'RELEASE: Feel the tension melting away...'}
             </div>
             <div className="text-4xl font-black text-slate-900 tabular-nums">
                {timer}s
             </div>
          </div>
        )}
      </div>

      <button 
        onClick={active ? () => setActive(false) : startExercise}
        className={`w-full mt-6 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg ${active ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-900 text-white shadow-slate-200'}`}
      >
        {active ? 'Interrupt Session' : 'Begin Full Cycle'}
      </button>
    </div>
  );
};

export default ProgressiveRelaxation;
