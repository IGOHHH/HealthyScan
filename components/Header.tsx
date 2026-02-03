import React from 'react';
import { Scan, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">PureScan AI</h1>
            <p className="text-xs text-slate-500 font-medium">Scan. Analyze. Live Healthy.</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center space-x-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini 3</span>
        </div>
      </div>
    </header>
  );
};