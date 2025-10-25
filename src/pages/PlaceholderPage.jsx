import React from 'react';
import { Settings, ArrowRight } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="font-sans max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1.5 tracking-tight">{title}</h1>
        <p className="text-slate-500 text-base m-0 font-normal">This section is currently under development</p>
      </div>

      <div className="flex justify-center items-center min-h-96">
        <div className="bg-white border border-slate-200 rounded-2xl py-12 px-10 text-center max-w-lg w-full shadow-lg">
          <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings size={24} strokeWidth={2} />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Coming Soon</h2>
          <p className="text-slate-500 text-base leading-relaxed mb-8 font-normal">We're working on bringing you the best {title.toLowerCase()} management experience.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-200">
              <div className="text-base flex-shrink-0">📊</div>
              <span className="text-sm font-medium text-slate-600">Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-200">
              <div className="text-base flex-shrink-0">⚡</div>
              <span className="text-sm font-medium text-slate-600">Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-200">
              <div className="text-base flex-shrink-0">🔍</div>
              <span className="text-sm font-medium text-slate-600">Smart Search</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-200">
              <div className="text-base flex-shrink-0">🎯</div>
              <span className="text-sm font-medium text-slate-600">Bulk Operations</span>
            </div>
          </div>

          <button className="flex items-center gap-1.5 bg-indigo-500 text-white border-0 py-3 px-5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-indigo-600">
            <span>Get Notified</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
