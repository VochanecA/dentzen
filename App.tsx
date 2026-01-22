
import React, { useState, useEffect } from 'react';
import PatientDashboard from './components/PatientDashboard';
import DentistDashboard from './components/DentistDashboard';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import ClinicsPage from './components/ClinicsPage';
import { UserRole } from './types';

type AppView = 'LANDING' | 'ABOUT' | 'TERMS' | 'PRIVACY' | 'CLINICS' | 'DASHBOARD';

const LandingPage: React.FC<{ 
  onSelectRole: (role: UserRole) => void,
  setView: (view: AppView) => void
}> = ({ onSelectRole, setView }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-cyan-100 selection:text-cyan-900">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-200">D</div>
            <span className="text-2xl font-black tracking-tight text-slate-900">DentZen</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setView('ABOUT')}
              className="hidden sm:block text-sm font-bold text-slate-600 hover:text-cyan-600 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('join')}
              className="text-sm font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-cyan-100/40 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-teal-100/40 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold mb-8 uppercase tracking-widest shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Reimagining Dental Care
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[1.05] tracking-tight">
                Calm Minds. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-500">Confident</span> Smiles.
              </h1>
              <p className="max-w-xl text-xl text-slate-600 mb-12 leading-relaxed">
                The world's first anxiety-first dental platform. Science-backed exposure tools for patients, and AI-driven empathy insights for clinics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 mb-12">
                <button 
                  onClick={() => scrollToSection('join')}
                  className="group px-8 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-slate-300 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Start Your Journey
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Explore Features
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                {/* <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i*10}`} alt="User" />
                    </div>
                  ))}
                </div> */}
                <div className="text-sm">
                  <p className="font-bold text-slate-900 tracking-tight">Trusted by 1 patient...me</p>
                  {/* <p className="text-slate-500">Across 450 global partner clinics</p> */}
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200">
              <div className="relative z-10 bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/50 shadow-2xl p-8 rotate-[-2deg] hover:rotate-0 transition-all duration-700">
                <div className="bg-slate-50 rounded-[32px] overflow-hidden shadow-inner border border-slate-200/50">
                   <div className="h-12 bg-white/80 border-b border-slate-200 flex items-center px-6 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                      </div>
                      <div className="ml-4 h-5 w-32 bg-slate-100 rounded-full"></div>
                   </div>
                   <div className="p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-40 bg-slate-200/50 rounded-lg"></div>
                        <div className="h-10 w-10 bg-cyan-100 rounded-xl"></div>
                      </div>
                      <div className="h-56 relative bg-gradient-to-br from-cyan-50 to-indigo-50 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50">
                         <img 
                           src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000" 
                           alt="Modern Dental Experience" 
                           className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-16 bg-white rounded-xl shadow-sm p-3 flex flex-col justify-center gap-1.5">
                           <div className="h-2 w-12 bg-slate-100 rounded"></div>
                           <div className="h-3 w-full bg-cyan-50 rounded"></div>
                        </div>
                        <div className="h-16 bg-white rounded-xl shadow-sm p-3 flex flex-col justify-center gap-1.5">
                           <div className="h-2 w-12 bg-slate-100 rounded"></div>
                           <div className="h-3 w-full bg-teal-50 rounded"></div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section id="join" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Choose Your Experience</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <button 
                className="bg-white p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:border-cyan-400 transition-all transform hover:-translate-y-2"
                onClick={() => onSelectRole(UserRole.PATIENT)}
              >
                <div className="w-24 h-24 bg-cyan-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-lg shadow-cyan-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-6">Patient</h2>
                <div className="mt-auto w-full py-5 bg-cyan-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-cyan-200">Enter Relax Zone</div>
              </button>
              <button 
                className="bg-white p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:border-teal-400 transition-all transform hover:-translate-y-2"
                onClick={() => onSelectRole(UserRole.DENTIST)}
              >
                <div className="w-24 h-24 bg-teal-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-lg shadow-teal-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-6">Dentist</h2>
                <div className="mt-auto w-full py-5 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-200">Clinic Portal</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
              <span className="text-2xl font-black text-slate-900 tracking-tight text-center">DentZen</span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 mb-16">
              <button onClick={() => setView('ABOUT')} className="text-xs font-black text-slate-500 hover:text-cyan-600 transition-colors uppercase tracking-[0.2em]">About</button>
              <button onClick={() => setView('PRIVACY')} className="text-xs font-black text-slate-500 hover:text-cyan-600 transition-colors uppercase tracking-[0.2em]">Privacy</button>
              <button onClick={() => setView('TERMS')} className="text-xs font-black text-slate-500 hover:text-cyan-600 transition-colors uppercase tracking-[0.2em]">Terms</button>
              <button onClick={() => setView('CLINICS')} className="text-xs font-black text-slate-500 hover:text-cyan-600 transition-colors uppercase tracking-[0.2em]">Clinics</button>
            </div>
            <div className="pt-8 border-t border-slate-100 w-full text-center">
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">
                Built with ❤️ by <span className="text-cyan-500">Alen</span> &copy; 2026
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('LANDING');

  useEffect(() => {
    // Reset view to landing if role is cleared
    if (!role && currentView === 'DASHBOARD') {
      setCurrentView('LANDING');
    }
  }, [role, currentView]);

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setCurrentView('DASHBOARD');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'ABOUT':
        return <AboutPage onBack={() => setCurrentView('LANDING')} />;
      case 'TERMS':
        return <TermsPage onBack={() => setCurrentView('LANDING')} />;
      case 'PRIVACY':
        return <PrivacyPage onBack={() => setCurrentView('LANDING')} />;
      case 'CLINICS':
        return <ClinicsPage onBack={() => setCurrentView('LANDING')} />;
      case 'DASHBOARD':
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
                      <button onClick={() => setCurrentView('ABOUT')} className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">About</button>
                      <button onClick={() => setCurrentView('CLINICS')} className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">Find Clinic</button>
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
          </div>
        );
      case 'LANDING':
      default:
        return <LandingPage onSelectRole={handleSelectRole} setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
      {currentView !== 'LANDING' && (
         <footer className="bg-white border-t border-slate-100 py-6 text-center text-slate-400 text-xs">
           &copy; 2026 DentZen. Making smiles comfortable for everyone.
         </footer>
      )}
    </div>
  );
};

export default App;
