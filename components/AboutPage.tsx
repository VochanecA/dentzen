
import React from 'react';

const AboutPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className="text-xl font-bold tracking-tight text-slate-800">DentZen</span>
          </div>
          <button 
            onClick={onBack}
            className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6">Our Mission</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            DentZen was created to transform the dental experience from a source of fear into a journey of comfort and clinical success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">The Problem</h2>
            <p className="text-slate-600 leading-relaxed">
              Dental anxiety affects millions of people worldwide, often leading to avoided appointments and deteriorating oral health. Traditional approaches often ignore the psychological state of the patient until they are already in the chair.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">The DentZen Solution</h2>
            <p className="text-slate-600 leading-relaxed">
              By using interactive exposure therapy, guided relaxation, and AI-driven communication strategies, we empower patients to manage their anxiety before they even step into the clinic.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Powered by Modern Tech</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.922-.617l2.108-4.742A1 1 0 0016.445 10H14a1 1 0 01-1-1V5a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 01-1 1H4.555a1 1 0 00-.922 1.641l2.108 4.742a1 1 0 00.922.617z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Gemini AI</h3>
              <p className="text-xs text-slate-400">Intelligent Reassurance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">React 19</h3>
              <p className="text-xs text-slate-400">Reactive Interfaces</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Supabase</h3>
              <p className="text-xs text-slate-400">Secure Data</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Tailwind</h3>
              <p className="text-xs text-slate-400">Modern Styling</p>
            </div>
          </div>
        </div>

        <div className="text-center py-12 border-t border-slate-200">
          <div className="inline-block p-4 rounded-full bg-slate-100 mb-6">
             <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center text-white font-black text-2xl">A</div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Built by Alen</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            A Senior Frontend Engineer dedicated to building empathetic technology that solves real-world human problems.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t border-slate-100 py-10 text-center text-slate-400 text-sm">
        <p>&copy; 2024 DentZen. Built with ❤️ by Alen.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
