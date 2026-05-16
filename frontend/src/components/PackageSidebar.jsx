import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Info, Wallet, UserCheck, Truck, Utensils, Zap } from 'lucide-react';
import useTripStore from '../store/tripStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function PackageSidebar() {
  const { selectedActivities, removeActivityFromPackage, updateActivityExtras, members } = useTripStore();
  const navigate = useNavigate();


  const calculateTotal = () => {

    return selectedActivities.reduce((sum, act) => {
      let actTotal = act.price * members;
      if (act.extras.guide) actTotal += (act.guidePrice || 0);
      if (act.extras.transport) actTotal += (act.transportPrice || 0);
      if (act.extras.food) actTotal += (act.foodPrice || 0) * members;
      return sum + actTotal;
    }, 0);
  };

  const total = calculateTotal();
  const advance = Math.round(total * 0.2);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500 rounded-lg">
          <ShoppingBag size={20} className="text-white" />
        </div>
        <h3 className="text-xl font-bold">Experience Package</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6 custom-scrollbar pr-2">
        <AnimatePresence mode="popLayout">
          {selectedActivities.map((act) => (
            <motion.div
              key={act._id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 relative group"
            >
              <button 
                onClick={() => removeActivityFromPackage(act._id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={12} />
              </button>

              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-sm leading-tight pr-4">{act.name}</h4>
                <span className="text-orange-400 font-bold text-sm">₹{act.price * members}</span>
              </div>

              {/* Extras Toggles */}
              <div className="grid grid-cols-3 gap-2">
                {act.guideAvailable && (
                  <button
                    onClick={() => updateActivityExtras(act._id, 'guide', !act.extras.guide)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${act.extras.guide ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                  >
                    <UserCheck size={14} />
                    <span className="text-[8px] font-bold uppercase">Guide</span>
                  </button>
                )}
                {act.transportAvailable && (
                  <button
                    onClick={() => updateActivityExtras(act._id, 'transport', !act.extras.transport)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${act.extras.transport ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                  >
                    <Truck size={14} />
                    <span className="text-[8px] font-bold uppercase">Cab</span>
                  </button>
                )}
                {act.foodAvailable && (
                  <button
                    onClick={() => updateActivityExtras(act._id, 'food', !act.extras.food)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${act.extras.food ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                  >
                    <Utensils size={14} />
                    <span className="text-[8px] font-bold uppercase">Food</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {selectedActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-white/20 text-center">
            <Zap size={40} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-sm italic">Add activities to start building your package</p>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm">Total Package Value</span>
          <span className="text-2xl font-bold">₹{total.toLocaleString("en-IN")}</span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Commitment Advance (20%)</span>
            </div>
            <span className="text-emerald-400 font-bold text-lg">₹{advance.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[10px] text-emerald-400/60 leading-tight">Secure your slots now. Pay the rest at the destination.</p>
        </div>

        <button 
          disabled={selectedActivities.length === 0}
          onClick={() => navigate('/experience-checkout')}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-white/5 disabled:text-white/20 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group"
        >

          Book Your Experience
          <Zap size={18} className="group-hover:scale-125 transition-transform" />
        </button>
      </div>
    </div>
  );
}
