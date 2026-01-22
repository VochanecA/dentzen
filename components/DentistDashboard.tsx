
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDentistInsights } from '../services/geminiService';

const MOCK_PATIENTS = [
  { id: '1', name: 'Sarah Miller', anxiety: 8, lastModule: 'Breathing Ex', progress: 65, status: 'Concern' },
  { id: '2', name: 'John Doe', anxiety: 3, lastModule: 'Cleaning Prep', progress: 90, status: 'Ready' },
  { id: '3', name: 'Emma Wilson', anxiety: 9, lastModule: 'None', progress: 10, status: 'At Risk' },
  { id: '4', name: 'James Knight', anxiety: 5, lastModule: 'Tool Exposure', progress: 40, status: 'Monitoring' },
];

const MOCK_CHART_DATA = [
  { name: 'Mon', anxiety: 7 },
  { name: 'Tue', anxiety: 8 },
  { name: 'Wed', anxiety: 6 },
  { name: 'Thu', anxiety: 5 },
  { name: 'Fri', anxiety: 4 },
];

const DentistDashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async (patient: any) => {
    setLoading(true);
    const res = await getDentistInsights(MOCK_CHART_DATA);
    setInsights(res || '');
    setLoading(false);
  };

  useEffect(() => {
    if (selectedPatient) {
      fetchInsights(selectedPatient);
    }
  }, [selectedPatient]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Clinic Overview</h1>
        <p className="text-slate-500">Managing patient anxiety for successful clinical outcomes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg">Active Patients</h2>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Fear
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Prepared
                </span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Anxiety Level</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_PATIENTS.map((p) => {
                  const isSelected = selectedPatient?.id === p.id;
                  return (
                    <tr 
                      key={p.id} 
                      onClick={() => setSelectedPatient(p)}
                      className={`cursor-pointer transition-all border-l-4 ${
                        isSelected 
                          ? 'bg-cyan-50/80 border-cyan-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]' 
                          : 'hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-medium ${isSelected ? 'text-cyan-900' : 'text-slate-800'}`}>{p.name}</span>
                          {isSelected && <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-tight">Active Selection</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${p.anxiety > 7 ? 'bg-rose-500' : p.anxiety > 4 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                              style={{ width: `${p.anxiety * 10}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold">{p.anxiety}/10</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{p.lastModule}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' :
                          p.status === 'Concern' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          disabled={isSelected}
                          className={`text-sm font-semibold transition-all ${
                            isSelected 
                              ? 'text-slate-300 cursor-not-allowed flex items-center gap-1 justify-end w-full' 
                              : 'text-cyan-600 hover:text-cyan-800'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              Viewing
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </>
                          ) : 'View Detail'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Insights Panel */}
        <div className="space-y-6">
          {selectedPatient ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-right-4 relative">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPatient(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                title="Close Insights"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="flex justify-between items-start mb-6 pr-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedPatient.name}</h3>
                  <p className="text-slate-400 text-sm">Fear Profile: Tool Vibration, Sharp Sounds</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600 font-bold whitespace-nowrap">
                  {selectedPatient.progress}% Ready
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Anxiety Trend (Last 5 Days)</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[0, 10]} hide />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                      <Line type="monotone" dataKey="anxiety" stroke="#0891b2" strokeWidth={3} dot={{ fill: '#0891b2', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clinical Insights (AI Powered)
                </h4>
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    {insights || "Select a patient to generate clinical communication strategies."}
                  </div>
                )}
                <div className="pt-4 flex gap-2">
                  <button className="flex-1 bg-cyan-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-cyan-100">Prescribe Module</button>
                  <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">Select a patient to view detailed anxiety analysis and AI insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DentistDashboard;
