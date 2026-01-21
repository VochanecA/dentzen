
import React, { useState } from 'react';
import PatientDashboard from './components/PatientDashboard';
import DentistDashboard from './components/DentistDashboard';
import { UserRole } from './types';

const LandingPage: React.FC<{ onSelectRole: (role: UserRole) => void }> = ({ onSelectRole }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
          <div className="absolute top-[-100px] left-[-200px] w-[500px] h-[500px] bg-cyan-200/30 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-[200px] right-[-100px] w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-cyan-700 uppercase bg-cyan-100 rounded-full">
            The Future of Dental Comfort
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Smile Without the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">Anxiety</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed">
            DentZen bridges the gap between fear and care. Interactive exposure therapy for patients, real-time anxiety insights for dentists.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => scrollToSection('join')}
              className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-cyan-200 hover:bg-cyan-700 transition-all hover:-translate-y-1"
            >
              Start Free Journey
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Science-Backed Relief</h2>
            <p className="text-slate-500 max-w-xl mx-auto">We use proven psychological techniques to desensitize dental triggers and build clinical trust.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-all group">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-6 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Zen Audio Therapy</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Softened versions of dental tool sounds to normalize the clinical environment from the comfort of home.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-all group">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Guided Relaxation</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Interactive box-breathing and mindfulness exercises tailored specifically for medical environments.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Clinical Insights</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Dentists receive AI-powered communication guides based on patient anxiety trends for better care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection / Join Section */}
      <section id="join" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Choose Your Path</h2>
              <p className="text-slate-600">Personalized tools for patients and professional dashboards for clinics.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Card */}
              <button 
                className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:border-cyan-400 transition-all text-left w-full"
                onClick={() => onSelectRole(UserRole.PATIENT)}
              >
                <div className="w-20 h-20 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">I'm a Patient</h2>
                <p className="text-slate-500 leading-relaxed mb-8">Prepare for your next visit with calming tools and gentle education. Personalized for your fears.</p>
                <div className="mt-auto w-full px-8 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-100">Enter Relax Zone</div>
              </button>

              {/* Dentist Card */}
              <button 
                className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:border-teal-400 transition-all text-left w-full"
                onClick={() => onSelectRole(UserRole.DENTIST)}
              >
                <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">I'm a Dentist</h2>
                <p className="text-slate-500 leading-relaxed mb-8">Monitor patient anxiety and provide personalized care recommendations. Improve clinical success.</p>
                <div className="mt-auto w-full px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-100">Clinic Dashboard</div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);

  if (!role) {
    return <LandingPage onSelectRole={setRole} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRole(null)}>
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className="text-xl font-bold tracking-tight text-slate-800">DentZen</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 mr-6">
                <button className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">Community</button>
                <button className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">Support</button>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                 {role === UserRole.PATIENT ? 'Patient Mode' : 'Clinic Portal'}
               </span>
               <div className="w-8 h-8 bg-cyan-100 text-cyan-700 flex items-center justify-center rounded-full border border-cyan-200 font-bold text-xs">
                 {role === UserRole.PATIENT ? 'A' : 'Dr'}
               </div>
             </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {role === UserRole.PATIENT ? <PatientDashboard /> : <DentistDashboard />}
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 text-center text-slate-400 text-sm">
        &copy; 2024 DentZen. Making smiles comfortable for Alen and the community.
      </footer>
    </div>
  );
};

export default App;
