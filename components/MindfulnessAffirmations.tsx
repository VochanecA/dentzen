
import React, { useState, useEffect } from 'react';

const AFFIRMATIONS = [
  "I am in a safe environment with trained professionals.",
  "I am in control of my body and my breath.",
  "Every breath I take brings me more calm and peace.",
  "I can choose to feel comfortable and relaxed in this chair.",
  "This procedure is a positive step for my long-term health.",
  "I am brave for prioritizing my well-being today.",
  "I can signal for a pause whenever I need one.",
  "Modern technology ensures my comfort throughout this visit.",
  "I trust my ability to manage this experience successfully.",
  "My smile is worth the care I am receiving today."
];

const MindfulnessAffirmations: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
        setFade(true);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center text-center">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 text-cyan-600 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className="text-xs font-black text-cyan-600/60 uppercase tracking-[0.2em] mb-4">Positive Anchor</h3>
      <p className={`text-lg font-medium text-slate-700 leading-relaxed transition-all duration-500 min-h-[60px] ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        "{AFFIRMATIONS[index]}"
      </p>
      <div className="mt-6 flex gap-1">
        {AFFIRMATIONS.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-cyan-500' : 'w-1 bg-slate-200'}`} />
        ))}
      </div>
    </div>
  );
};

export default MindfulnessAffirmations;
