
import React, { useState } from 'react';

const PARTNER_CLINICS = [
  {
    id: 1,
    name: "Skyline Dental Spa",
    location: "Podgorica, Montenegro",
    specialty: "Sedation & Comfort",
    rating: 4.9,
    features: ["Weighted Blankets", "Noise-Canceling", "Zen-Certified"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    name: "Monte Smiles Clinic",
    location: "Podgorica, Montenegro",
    specialty: "Pediatric Anxiety",
    rating: 4.8,
    features: ["Interactive Games", "Warm Towels", "Zen-Certified"],
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    name: "Modern Roots Dentistry",
    location: "Kotor, Montenegro",
    specialty: "Holistic Care",
    rating: 5.0,
    features: ["Aromatherapy", "Ergonomic Chairs", "Zen-Certified"],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400"
  }
];

const ClinicsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [search, setSearch] = useState('');

  const filtered = PARTNER_CLINICS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.location.toLowerCase().includes(search.toLowerCase())
  );

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
            className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Zen-Certified Clinics-EXAMPLE ONLY! Not a real clinics!</h1>
          <p className="text-slate-500 text-lg">
            Find a provider that prioritizes your psychological comfort as much as your clinical health.
          </p>
        </div>

        <div className="mb-12 relative max-w-xl mx-auto">
           <input 
             type="text"
             placeholder="Search by city or clinic name..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all text-slate-800"
           />
           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filtered.map(clinic => (
            <div key={clinic.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="h-48 relative overflow-hidden">
                <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-cyan-600 uppercase tracking-widest border border-cyan-100 shadow-sm">
                  Partner Clinic
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{clinic.name}</h3>
                  <div className="flex items-center text-amber-500 gap-1 text-sm font-bold">
                    ★ {clinic.rating}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-6 flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   {clinic.location}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {clinic.features.map(f => (
                    <span key={f} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">
                      {f}
                    </span>
                  ))}
                </div>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  Book with Zen Prep
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-indigo-600 rounded-[48px] p-12 text-center text-white relative overflow-hidden">
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
           <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Are you a dental professional?</h2>
              <p className="text-cyan-50 mb-8 max-w-xl mx-auto">
                Join our network of clinics that are redefining patient experience. Get access to our empathy dashboard and certified training.
              </p>
              <button className="bg-white text-cyan-600 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                Become Zen-Certified
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicsPage;
