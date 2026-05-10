import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slide-in-right">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-500/30 backdrop-blur-md flex items-center gap-4 max-w-sm">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Data Stored Successfully!</p>
          <p className="text-xs text-green-100 mt-0.5">Waiting for verification</p>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SuccessToast;