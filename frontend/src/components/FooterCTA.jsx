import React from "react";

export default function FooterCTA({ onPlan }) {
  return (
    <footer className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-500/20" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
          Ready for the weekend?
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Ditch the mainstream hotels. Support local communities and experience the real vibe of your destination.
        </p>
        <button
          onClick={onPlan}
          className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-xl hover:scale-105 transition-transform text-lg"
        >
          Start Browsing Destinations
        </button>
      </div>
      
      <div className="relative z-10 mt-24 pt-8 border-t border-slate-800 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
        <div className="font-display font-bold text-xl text-white">
          Quest<span className="text-orange-500">ora</span>
        </div>
        <div>© 2026 Questora. The Weekend-First Platform.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">List Your Property</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
