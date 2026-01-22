
import React from 'react';

const PrivacyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 mb-12 italic">How we protect your peace of mind and your data.</p>

        <div className="space-y-12">
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Anonymity First
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We do not sell your anxiety scores or specific fear profiles to third-party advertisers. Your data is used exclusively to personalize your relaxation experience and, if consented, to help your dentist provide better care.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Data Collection</h2>
            <p className="text-slate-600 leading-relaxed">
              We DO NOT collect information you provide directly: anxiety levels, procedure fears, and interaction with relaxation modules. Biometric data from the "Stress Detector" is processed locally in your browser and is not stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">2. AI & Third Parties</h2>
            <p className="text-slate-600 leading-relaxed">
              When you use the Zen Companion, your queries are sent via OpenRouter to DeepSeek models. These queries are sanitized to remove PII (Personally Identifiable Information) before transmission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">3. Clinical Sharing</h2>
            <p className="text-slate-600 leading-relaxed">
              If you link your account to a DentZen Partner Clinic, your dentist will see your anxiety trends and completed modules to better prepare for your arrival. You can revoke this access at any time.
            </p>
          </section>
        </div>

        <div className="mt-20 text-center text-xs text-slate-400">
          Questions? Contact our Privacy Officer at privacy@dentzen.app
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
