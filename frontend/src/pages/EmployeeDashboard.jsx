import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  ShieldCheck, 
  History, 
  CreditCard, 
  TrendingUp, 
  Plus, 
  MapPin, 
  Calendar, 
  Building2, 
  Car, 
  Laptop,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Receipt,
  Settings2,
  XCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChange = async (bookingId) => {
    try {
      await axios.put(`${API_BASE_URL}/bookings/${bookingId}/request-change`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success("Executive change request logged. Our concierge will contact you.");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to log request.");
    }
  };

  const [expenses] = useState([
    { id: 1, title: 'Corporate Suite Rent', amount: 45000, category: 'Housing', date: 'Today', type: 'expense', reimbursed: false },
    { id: 2, title: 'Executive Car Rental', amount: 12000, category: 'Travel', date: 'Yesterday', type: 'expense', reimbursed: true },
    { id: 3, title: 'Client Dinner - Taj', amount: 5500, category: 'Meals', date: '3 days ago', type: 'expense', reimbursed: true },
    { id: 4, title: 'Travel Allowance', amount: 15000, category: 'Income', date: '1 week ago', type: 'income', reimbursed: true },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Briefcase className="size-5 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Executive Portal</span>
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight">Professional <span className="text-indigo-400">Dashboard</span></h1>
            <p className="text-slate-400 mt-2 font-medium">Manage corporate housing and business travel expenses</p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-3xl border border-white/10 shadow-2xl">
            <div className="size-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
              <BarChart3 className="size-6" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Pending Reimbursement</p>
              <p className="text-xl font-black text-white">₹45,000</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COL: BOOKING HISTORY */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <History className="text-indigo-400 size-6" /> Corporate Bookings
              </h2>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2].map(i => <div key={i} className="h-48 bg-slate-900 rounded-[2rem] animate-pulse" />)}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <motion.div 
                    key={booking._id}
                    layout
                    className="bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 flex flex-col md:flex-row gap-6 p-4"
                  >
                    <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
                      <img src={booking.type === 'activity' ? 'https://images.pexels.com/photos/1032156/pexels-photo-1032156.jpeg?auto=compress&cs=tinysrgb&w=600' : (booking.property?.images?.[0] || 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800')} alt={booking.property?.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 py-2 pr-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full">
                            {booking.type === 'activity' ? 'Activity' : (booking.property?.type || 'Corporate Stay')}
                          </span>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            booking.status === 'confirmed' || booking.paymentStatus === 'completed' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 
                            booking.status === 'change_requested' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {booking.paymentStatus === 'completed' && !booking.status ? 'Confirmed' : (booking.status || 'Confirmed')}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mt-4">{booking.type === 'activity' ? booking.itemName : (booking.property?.title || 'Unknown Stay')}</h3>
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium capitalize">
                            <MapPin size={14} className="text-indigo-400" /> {booking.type === 'activity' ? booking.destinationId : booking.locationName}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                            <Calendar size={14} className="text-indigo-400" /> {new Date(booking.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Corporate Rate</p>
                          <p className="text-xl font-black">₹{booking.price?.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          {booking.status === 'confirmed' && (
                            <button 
                              onClick={() => handleRequestChange(booking._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-white transition-all"
                            >
                              <Settings2 size={14} /> Change Stay
                            </button>
                          )}
                          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20">
                            <FileText size={14} /> Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-900 rounded-[2.5rem] border border-dashed border-white/10">
                <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                  <Briefcase size={40} />
                </div>
                <h3 className="text-xl font-bold text-white">No active corporate bookings</h3>
                <p className="text-slate-500 mt-2">Book a premium suite to start tracking your business travel.</p>
              </div>
            )}

            {/* UPGRADE BANNER */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden border border-white/10">
              <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-indigo-400/20 rounded-full blur-[100px]" />
              <div className="relative z-10 max-w-md">
                <ShieldCheck className="size-10 mb-4 text-indigo-300" />
                <h3 className="text-2xl font-bold leading-tight">Elevate your business stay.</h3>
                <p className="text-indigo-100/70 mt-2 text-sm">Access exclusive airport lounges and chauffeur services for your next executive trip.</p>
                <button 
                   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                   className="mt-8 px-8 py-3 bg-white text-indigo-700 font-black rounded-2xl hover:bg-indigo-50 transition-all text-sm uppercase tracking-wider"
                >
                  Explore Perks
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COL: EXPENSE TRACKER */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CreditCard className="text-indigo-400 size-6" /> Tax & Expenses
            </h2>

            <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl p-8 space-y-8">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fiscal Year Spending</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-white">₹1,24,500</p>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-md">
                    <TrendingUp size={10} /> +8%
                  </span>
                </div>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Reimbursed</p>
                  <p className="text-lg font-black text-emerald-400">₹79,500</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Tax Savings</p>
                  <p className="text-lg font-black text-indigo-400">₹12,200</p>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* RECENT EXPENSES */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Live Ledger</h4>
                  <button className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          exp.category === 'Housing' ? 'bg-amber-500/10 text-amber-500' :
                          exp.category === 'Travel' ? 'bg-blue-500/10 text-blue-500' :
                          exp.category === 'Meals' ? 'bg-purple-500/10 text-purple-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {exp.category === 'Housing' ? <Building2 size={20} /> :
                           exp.category === 'Travel' ? <Car size={20} /> :
                           exp.category === 'Meals' ? <Laptop size={20} /> : <TrendingUp size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{exp.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{exp.category}</p>
                            {exp.reimbursed && (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-sm font-black uppercase">REIMBURSED</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${exp.type === 'expense' ? 'text-white' : 'text-emerald-400'}`}>
                          {exp.type === 'expense' ? '-' : '+'}₹{exp.amount.toLocaleString()}
                        </p>
                        {exp.type === 'expense' ? <ArrowUpRight size={12} className="text-slate-600 ml-auto" /> : <ArrowDownRight size={12} className="text-emerald-500 ml-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 bg-indigo-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20">
                  <Receipt size={16} /> Generate Tax Report
                </button>
                <button className="w-full py-4 bg-transparent border border-white/10 text-slate-400 font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                  Sync with Corporate Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;


