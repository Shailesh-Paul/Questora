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
import ExpenseManagement from './ExpenseManagement';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [walletBalance, setWalletBalance] = useState(0);

  // Filter bookings for Trip Receipts (Activities and Properties)
  const itineraryBookings = bookings.filter(b => b.type === 'activity' || b.property);
  
  // Calculate dynamic expenses
  const totalTravelSpend = itineraryBookings.reduce((sum, b) => sum + (b.price || b.estimatedPrice || 0), 0);
  const budget = 25000; // Example budget
  const budgetPercent = Math.min((totalTravelSpend / budget) * 100, 100);
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBookings(data);

      // Fetch recommendations
      const recRes = await axios.get(`${API_BASE_URL}/properties/recommended`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRecommendations(recRes.data.slice(0, 4)); // Get top 4

      // Fetch Wallet Balance
      try {
        const walletRes = await axios.get(`${API_BASE_URL}/wallet`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setWalletBalance(walletRes.data.balance || 0);
      } catch (wErr) {
        console.error('Failed to fetch wallet in student dashboard', wErr);
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
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
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === 'overview' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Overview & Tickets
              </button>
              <button 
                onClick={() => setActiveTab('expenses')} 
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === 'expenses' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                AI Expense Ledger
              </button>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Wallet className="size-6" />
              </div>
              <div className="pr-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Virtual Wallet Balance</p>
                <p className="text-xl font-black text-emerald-500">₹{walletBalance.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'expenses' ? (
          <ExpenseManagement />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COL: BOOKING HISTORY */}
            <div className="lg:col-span-2 space-y-8">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <History className="text-blue-500 size-6" /> Trip Receipts
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />)}
              </div>
            ) : itineraryBookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {itineraryBookings.map((booking) => (
                  <motion.div 
                    key={booking._id}
                    layout
                    className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 relative group"
                  >
                    {/* Receipt Tear Edge Effect */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSItMTAiIHI9IjEwIiBmaWxsPSIjZjhmOWZhIi8+PC9zdmc+')] z-10 opacity-50" />
                    
                    <div className="p-8 pb-6 border-b-2 border-dashed border-slate-200 flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                        <img src={booking.type === 'activity' ? 'https://images.pexels.com/photos/1032156/pexels-photo-1032156.jpeg?auto=compress&cs=tinysrgb&w=600' : (booking.property?.images?.[0] || 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800')} alt="Booking" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 text-center md:text-left w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div>
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2">
                              {booking.type === 'activity' ? 'Activity Booking' : 'Accommodation'}
                            </span>
                            <h3 className="text-2xl font-black text-slate-900 line-clamp-1">
                              {booking.type === 'activity' ? booking.itemName : (booking.property?.title || 'External Booking')}
                            </h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm mt-2 font-medium capitalize">
                              <MapPin size={16} className="text-slate-400" /> {booking.type === 'activity' ? booking.destinationId : booking.locationName || 'Travel Destination'}
                            </div>
                          </div>
                          
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                            <p className="text-3xl font-black text-emerald-500">₹{(booking.price || booking.estimatedPrice || 0).toLocaleString("en-IN")}</p>
                            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              booking.status === 'confirmed' || booking.paymentStatus === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {booking.paymentStatus === 'completed' && !booking.status ? 'Payment Confirmed' : (booking.status || 'Pending')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8 bg-slate-50 flex flex-col md:flex-row gap-8 justify-between items-center">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-sm">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                          <p className="font-bold text-slate-900">{booking.customerName || booking.userId?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aadhar ID</p>
                          <p className="font-bold text-slate-900">{booking.aadharNumber ? `****${booking.aadharNumber.slice(-4)}` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Travel Dates</p>
                          <p className="font-bold text-slate-900">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requirements</p>
                          <p className="font-bold text-slate-900 truncate">{booking.customRequirements || 'None'}</p>
                        </div>
                      </div>
                      
                      <button className="shrink-0 flex items-center justify-center size-12 bg-white border border-slate-200 rounded-2xl shadow-sm text-blue-600 hover:bg-blue-50 transition-colors">
                        <ArrowDownRight size={20} />
                      </button>
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
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Travel Spend</p>
                  <p className="text-3xl font-black text-slate-900">₹{totalTravelSpend.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-sm font-bold text-blue-500">₹{budget.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${budgetPercent > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${budgetPercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span>{budgetPercent.toFixed(1)}% Used</span>
                  <span>Remaining: ₹{Math.max(budget - totalTravelSpend, 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="h-px bg-slate-50" />

              {/* DYNAMIC EXPENSES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Transactions</h4>
                </div>

                <div className="space-y-3">
                  {itineraryBookings.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No transactions yet.</p>
                  ) : itineraryBookings.slice(0, 5).map((exp) => (
                    <div key={exp._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-xl flex items-center justify-center ${
                          exp.type === 'activity' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                        }`}>
                          {exp.type === 'activity' ? <History size={18} /> : <Home size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 line-clamp-1">{exp.type === 'activity' ? exp.itemName : (exp.property?.title || 'Stay')}</p>
                          <p className="text-[10px] text-slate-400 font-medium capitalize">{exp.type} • {new Date(exp.createdAt || exp.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          -₹{(exp.price || exp.estimatedPrice || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('expenses')}
                className="w-full py-4 bg-slate-50 border border-slate-100 text-slate-600 font-bold rounded-2xl text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard size={16} /> Open Smart Expense Dashboard
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;


