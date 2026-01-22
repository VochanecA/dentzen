
import React from 'react';

const TermsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
            Back
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Last Updated: May 2026</p>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing DentZen, you agree to be bound by these terms. Our platform is designed to provide auxiliary support for dental anxiety and is not a substitute for professional clinical diagnosis or treatment.
            </p>
          </section>

          <section className="bg-cyan-50 p-8 rounded-3xl border border-cyan-100">
            <h2 className="text-xl font-bold text-cyan-900 mb-4">2. Medical Disclaimer</h2>
            <p className="text-cyan-800 leading-relaxed">
              <strong>DentZen does not provide medical advice.</strong> The content, including AI-generated reassurance and relaxation modules, is for informational purposes only. Always seek the advice of your dentist or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">3. Use of AI Tools</h2>
            <p className="text-slate-600 leading-relaxed">
              Our "Zen Companion" uses large language models (DeepSeek R1 via OpenRouter) to provide empathetic responses. While we strive for accuracy and safety, AI responses may occasionally be imperfect. Users should exercise personal judgment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">4. Patient-Clinic Relationship</h2>
            <p className="text-slate-600 leading-relaxed">
              DentZen facilitates communication but does not establish a clinical relationship between you and partner clinics until an official appointment is booked through their respective clinical systems.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-200 text-center">
          <button 
            onClick={onBack}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
