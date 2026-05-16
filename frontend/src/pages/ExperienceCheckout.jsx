import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import { ShieldCheck, Wallet, CheckCircle, ArrowLeft, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Use your actual backend URL

export default function ExperienceCheckout() {
  const navigate = useNavigate();
  const { selectedActivities, members, clearPackage } = useTripStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tripUpdates, setTripUpdates] = useState([]);

  const total = selectedActivities.reduce((sum, act) => {
    let actTotal = act.price * members;
    if (act.extras.guide) actTotal += (act.guidePrice || 0);
    if (act.extras.transport) actTotal += (act.transportPrice || 0);
    if (act.extras.food) actTotal += (act.foodPrice || 0) * members;
    return sum + actTotal;
  }, 0);

  const advance = Math.round(total * 0.2);

  useEffect(() => {
    if (selectedActivities.length === 0 && !isSuccess) {
      navigate('/experiences');
    }

    socket.on('package_updated', (data) => {
      setTripUpdates(prev => [...prev, data.message]);
    });

    return () => socket.off('package_updated');
  }, [selectedActivities, isSuccess, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate real-time updates via Socket.io
    setTimeout(() => {
      socket.emit('update_package', { tripId: 'TEST_TRIP', message: 'Booking verified by local vendor...' });
    }, 1000);

    setTimeout(() => {
      socket.emit('update_package', { tripId: 'TEST_TRIP', message: 'Guide assigned: Rajesh Kumar' });
    }, 2500);

    // Simulate Payment Processing
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    toast.success("20% Advance Paid! Your experience is secured.");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-body">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-[3rem] p-12 max-w-2xl w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Adventure Locked!</h1>
          <p className="text-white/60 mb-8">Trip Code: #EXP-{Math.floor(Math.random()*1000000)}</p>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Live Updates</h3>
            <div className="space-y-3">
              {tripUpdates.map((update, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-emerald-400 font-medium">
                  <Sparkles size={14} /> {update}
                </div>
              ))}
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Loader2 size={14} className="animate-spin" /> Finalizing travel permits...
              </div>
            </div>
          </div>

          <button 
            onClick={() => { clearPackage(); navigate('/'); }}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-body pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Summary */}
          <div>
            <h1 className="text-4xl font-bold mb-8">Review Package</h1>
            <div className="space-y-4">
              {selectedActivities.map(act => (
                <div key={act._id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="flex justify-between font-bold mb-2">
                    <span>{act.name}</span>
                    <span>₹{act.price * members}</span>
                  </div>
                  <div className="flex gap-2">
                    {act.extras.guide && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20 uppercase font-bold">Guide Incl.</span>}
                    {act.extras.transport && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase font-bold">Cab Incl.</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Value</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Wallet size={18} /> Pay 20% Now
                  </div>
                  <span className="text-2xl font-black text-emerald-400">₹{advance.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-emerald-400/60">Pay the remaining ₹{(total - advance).toLocaleString("en-IN")} at the destination.</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] h-max relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px]" />
            <ShieldCheck className="text-emerald-500 mb-6" size={40} />
            <h2 className="text-2xl font-bold mb-2">Secure Booking</h2>
            <p className="text-white/40 text-sm mb-8">Confirming your booking triggers real-time coordination with local guides and transport partners.</p>

            <div className="space-y-6 mb-8">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-sm text-white/60 font-bold">
                <span>Razorpay Checkout</span>
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-white/5 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3"
            >
              {isProcessing ? <><Loader2 className="animate-spin" /> Securing Trip...</> : 'Confirm & Pay Advance'}
            </button>

            <div className="mt-6 flex items-center justify-center gap-3 text-white/20">
              <MessageSquare size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Coordination Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
