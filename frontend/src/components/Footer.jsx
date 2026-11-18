import React from 'react';
import { ShieldAlert, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 mb-8 flex items-start space-x-3 text-slate-300">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="text-amber-300 font-semibold">Educational Project Notice: </strong>
            This web application is built strictly as an academic demonstration of MERN Stack architecture, relational data matching, and compatibility algorithms. A computed database match does not confirm clinical feasibility. Real-world organ transplants require comprehensive HLA tissue typing, cross-matching, and authorization by certified transplant authorities (e.g., NOTTO / OPTN).
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-1">
            <span>LifeBridge Platform</span>
            <span>•</span>
            <span>Empowering Lifesaving Connections</span>
          </div>
          <div>
            Built with MongoDB, Express, React & Node.js
          </div>
        </div>
      </div>
    </footer>
  );
};
