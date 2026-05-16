import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Wallet, 
  TrendingUp, 
  Plus, 
  MapPin, 
  Calendar, 
  Home, 
  Coffee, 
  Bus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Settings2,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
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
      toast.success("Change request submitted! We'll contact you shortly.");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to submit request.");
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.put(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success("Booking cancelled.");
      fetchBookings();
    } catch (error) {
      toast.error("Cancellation failed.");
    }
  };

  const [expenses] = useState([
    { id: 1, title: 'Hostel Monthly Rent', amount: 8000, category: 'Housing', date: 'Today', type: 'expense' },
    { id: 2, title: 'Local Bus Pass', amount: 450, category: 'Transport', date: 'Yesterday', type: 'expense' },
    { id: 3, title: 'Mess Bill', amount: 2200, category: 'Food', date: '3 days ago', type: 'expense' },
    { id: 4, title: 'Scholarship Credit', amount: 5000, category: 'Income', date: '1 week ago', type: 'income' },
  ]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-slate-900 tracking-tight"
            >
              Student <span className="text-blue-600">Dashboard</span>
            </motion.h1>
            <p className="text-slate-500 mt-2 font-medium">Manage your stays and tracking your student budget</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Wallet className="size-6" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Current Balance</p>
              <p className="text-xl font-black text-slate-900">₹14,250</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COL: BOOKING HISTORY */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <History className="text-blue-500 size-6" /> Booking History
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />)}
              </div>
            ) : bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <motion.div 
                    key={booking._id}
                    layout
                    className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col"
                  >
                    <div className="relative h-48">
                      <img src={booking.bookingType === 'rental' ? (booking.vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600') : (booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600')} alt="Booking" className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-blue-600 shadow-sm">
                        {booking.bookingType === 'rental' ? (booking.vehicle?.category || 'Vehicle') : (booking.property?.type || 'Stay')}
                      </div>
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        booking.status === 'confirmed' || booking.status === 'active' ? 'bg-green-500 text-white' : 
                        booking.status === 'change_requested' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                        {booking.bookingType === 'rental' ? booking.vehicle?.name : (booking.property?.title || 'Unknown Stay')}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 text-xs mt-2 font-medium">
                        <MapPin size={14} className="text-blue-500" /> {booking.locationName}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs mt-1 font-medium">
                        <Calendar size={14} className="text-blue-500" /> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                      
                      {booking.bookingType === 'rental' && booking.status !== 'active' && !booking.otpVerified && (
                        <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-1">Pickup Verification OTP</p>
                          <p className="text-3xl font-black text-slate-900 tracking-[0.2em]">{booking.otp}</p>
                          <p className="text-[10px] text-slate-400 mt-2">Show this to the provider at pickup.</p>
                        </div>
                      )}

                      <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Paid</p>
                            <p className="text-xl font-black text-slate-900">₹{booking.price}</p>
                          </div>
                          {(booking.status === 'completed' || booking.status === 'active') && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-all">
                              <MessageSquare size={14} /> Review
                            </button>
                          )}
                        </div>

                        {booking.status === 'confirmed' && (
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => handleRequestChange(booking._id)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-amber-100 hover:text-amber-700 transition-all"
                            >
                              <Settings2 size={14} /> {booking.bookingType === 'rental' ? 'Modify Rental' : 'Request Change'}
                            </button>
                            <button 
                              onClick={() => handleCancel(booking._id)}
                              className="px-3 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <History size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No bookings yet</h3>
                <p className="text-slate-500 mt-2">Your travel history will appear here once you book a stay.</p>
              </div>
            )}

            {/* QUICK ACTIONS */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold">Need a different room?</h3>
                  <p className="text-blue-100 mt-1">If you don't like your stay, request a change and we'll fix it.</p>
                </div>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-8 py-3 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:scale-105 transition-all"
                >
                  Explore Stays
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COL: EXPENSE TRACKER */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <CreditCard className="text-blue-500 size-6" /> Expense Tracker
            </h2>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Housing Budget</p>
                  <p className="text-3xl font-black text-slate-900">₹12,000 <span className="text-sm text-slate-400 font-medium">/ mo</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-green-500 flex items-center justify-end gap-1">
                    <TrendingUp size={12} /> 12%
                  </p>
                  <p className="text-xs text-slate-400 font-medium italic">under budget</p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[65%]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span>Spent: ₹7,800</span>
                  <span>Remaining: ₹4,200</span>
                </div>
              </div>

              <div className="h-px bg-slate-50" />

              {/* RECENT EXPENSES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Activity</h4>
                  <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-xl flex items-center justify-center ${
                          exp.category === 'Housing' ? 'bg-orange-50 text-orange-500' :
                          exp.category === 'Transport' ? 'bg-blue-50 text-blue-500' :
                          exp.category === 'Food' ? 'bg-purple-50 text-purple-500' : 'bg-green-50 text-green-500'
                        }`}>
                          {exp.category === 'Housing' ? <Home size={18} /> :
                           exp.category === 'Transport' ? <Bus size={18} /> :
                           exp.category === 'Food' ? <Coffee size={18} /> : <TrendingUp size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{exp.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{exp.category} • {exp.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${exp.type === 'expense' ? 'text-slate-900' : 'text-green-600'}`}>
                          {exp.type === 'expense' ? '-' : '+'}₹{exp.amount}
                        </p>
                        {exp.type === 'expense' ? <ArrowUpRight size={12} className="text-red-400 ml-auto" /> : <ArrowDownRight size={12} className="text-green-400 ml-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-4 bg-slate-50 border border-slate-100 text-slate-600 font-bold rounded-2xl text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                <CreditCard size={16} /> View Full Statement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;


