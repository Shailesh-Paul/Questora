import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Upload, 
  Users, 
  PieChart as PieIcon, 
  Plus, 
  Check, 
  RefreshCw, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Tag, 
  Calendar, 
  FileText,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const CATEGORY_COLORS = {
  travel: '#3b82f6',
  hotel: '#8b5cf6',
  activity: '#10b981',
  rentals: '#f59e0b',
  food: '#ef4444',
  shopping: '#ec4899',
  transport: '#06b6d4'
};

const CATEGORIES = ['travel', 'hotel', 'activity', 'rentals', 'food', 'shopping', 'transport'];

export default function ExpenseManagement() {
  // Budget & State
  const [budget, setBudget] = useState(25000);
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forms & Loading Sub-states
  const [manualAmount, setManualAmount] = useState('');
  const [manualCategory, setManualCategory] = useState('food');
  const [manualDesc, setManualDesc] = useState('');
  const [manualPaidBy, setManualPaidBy] = useState('');
  const [nlpText, setNlpText] = useState('');
  const [nlpLoading, setNlpLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  
  // Splits
  const [splitEmails, setSplitEmails] = useState('');
  const [splitAmount, setSplitAmount] = useState('');
  const [splitCategory, setSplitCategory] = useState('food');
  const [splitDesc, setSplitDesc] = useState('');

  // AI Insights
  const [aiInsights, setAiInsights] = useState({ insights: [], overallGrade: 'Loading...' });
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Wallet top-up amount
  const [topupAmount, setTopupAmount] = useState('');
  const [topupLoading, setTopupLoading] = useState(false);

  const { user } = useAuth();
  const token = user?.token;
  const currentUserId = user?._id;

  // Load all dashboard data
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch Wallet
      const walletRes = await fetch(`${API_BASE_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWallet(walletData);
      }

      // 2. Fetch Expenses
      const expensesRes = await fetch(`${API_BASE_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);
      }
    } catch (err) {
      console.error('Error fetching expense dashboard data:', err);
      toast.error('Failed to load expense records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  // Compute stats
  const totalSpent = useMemo(() => {
    // Total spent is the sum of expenses paid by current user (excluding external shares they split)
    return expenses.reduce((sum, exp) => {
      // Find out if this expense is owned by current user
      const isOwner = exp.userId && (typeof exp.userId === 'object' ? exp.userId._id === currentUserId : exp.userId === currentUserId);
      // For simplicity, sum all expenses they paid up front
      return sum + exp.amount;
    }, 0);
  }, [expenses]);

  const budgetProgress = useMemo(() => {
    if (budget <= 0) return 0;
    return Math.min(100, Math.round((totalSpent / budget) * 100));
  }, [totalSpent, budget]);

  // Fetch AI Insights
  const fetchAiInsights = async () => {
    if (!expenses.length) {
      setAiInsights({ insights: ["Add some expenses first to let the AI Coach analyze your travel habits!"], overallGrade: "N/A" });
      return;
    }
    setInsightsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ai-expenses/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ expenses, budget })
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsights(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load AI Insights');
    } finally {
      setInsightsLoading(false);
    }
  };

  useEffect(() => {
    if (expenses.length > 0) {
      fetchAiInsights();
    }
  }, [expenses, budget]);

  // Direct Simulated Wallet Credit (Fast Testing)
  const handleDirectCredit = async () => {
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }
    setTopupLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/wallet/direct-credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: amt })
      });
      if (res.ok) {
        const updated = await res.json();
        setWallet({ balance: updated.balance, transactions: updated.transactions });
        setTopupAmount('');
        toast.success(`Successfully credited ₹${amt} to your Wallet!`);
      } else {
        toast.error('Top-up failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error simulating top-up');
    } finally {
      setTopupLoading(false);
    }
  };

  // Razorpay Wallet Top-up integration
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayTopup = async () => {
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    setTopupLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load. Try the Simulation button!');
      setTopupLoading(false);
      return;
    }

    try {
      const orderRes = await fetch(`${API_BASE_URL}/wallet/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: amt })
      });

      if (!orderRes.ok) throw new Error('Failed to initiate order');
      const { order } = await orderRes.json();

      const options = {
        key: 'rzp_test_SnQQo0BjlwDtYq', // Test API Key
        amount: order.amount,
        currency: order.currency,
        name: 'WeekendWander Travel Wallet',
        description: 'Fund virtual wallet for travel split ledgers',
        order_id: order.id,
        handler: async (response) => {
          try {
            const confirmRes = await fetch(`${API_BASE_URL}/wallet/confirm-topup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                amount: amt,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id
              })
            });

            if (confirmRes.ok) {
              const updated = await confirmRes.json();
              setWallet({ balance: updated.balance, transactions: updated.transactions });
              setTopupAmount('');
              toast.success(`Successfully credited ₹${amt} to your Wallet!`);
            } else {
              toast.error('Failed to confirm transaction credit');
            }
          } catch (confirmErr) {
            console.error(confirmErr);
            toast.error('Error confirming payment');
          }
        },
        prefill: {
          name: 'Traveler',
          email: 'traveler@questora.com'
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      console.error(err);
      toast.error('Razorpay startup error. Fallback to Simulator Credit!');
    } finally {
      setTopupLoading(false);
    }
  };

  // Submit Manual Cash Expense
  const handleAddManual = async (e) => {
    e.preventDefault();
    const amt = parseFloat(manualAmount);
    if (isNaN(amt) || amt <= 0 || !manualDesc) {
      toast.error('Please enter a valid amount and description');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/expenses/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amt,
          category: manualCategory,
          description: manualDesc,
          paidBy: manualPaidBy || user?.name || 'Me'
        })
      });

      if (res.ok) {
        const { expense } = await res.json();
        setExpenses([expense, ...expenses]);
        setManualAmount('');
        setManualDesc('');
        setManualPaidBy('');
        toast.success('Cash expense added!');
      } else {
        toast.error('Failed to save expense');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding expense');
    }
  };

  // Submit Split Expense
  const handleAddSplit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(splitAmount);
    if (isNaN(amt) || amt <= 0 || !splitDesc || !splitEmails) {
      toast.error('All split fields are required');
      return;
    }

    const emailList = splitEmails.split(',').map(em => em.trim()).filter(Boolean);
    if (!emailList.length) {
      toast.error('Please enter at least one valid user email');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/expenses/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amt,
          category: splitCategory,
          description: splitDesc,
          splitEmails: emailList
        })
      });

      if (res.ok) {
        const { expense } = await res.json();
        setExpenses([expense, ...expenses]);
        setSplitAmount('');
        setSplitDesc('');
        setSplitEmails('');
        toast.success(`Bill split equally! You logged a share of ₹${expense.amount}`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Splitting failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error split bill');
    }
  };

  // Settle outstanding split bill via virtual ledger transfer
  const handleSettle = async (expenseId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/expenses/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ expenseId })
      });

      if (res.ok) {
        toast.success('Split ledger settled via virtual wallet!');
        loadData(); // Reload both wallet balance and expenses feed
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Settlement failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error settling split ledger');
    }
  };

  // AI Autocomplete Smart NLP Parse
  const handleNLPParse = async () => {
    if (!nlpText) {
      toast.error('Type a sentence (e.g. "dinner at restaurant for 1500")');
      return;
    }
    setNlpLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ai-expenses/nlp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: nlpText })
      });

      if (res.ok) {
        const parsed = await res.json();
        setManualAmount(parsed.amount);
        setManualCategory(parsed.category);
        setManualDesc(parsed.description);
        setNlpText('');
        toast.success('AI parsed! Form autocompleted.');
      } else {
        toast.error('AI parse failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('AI NLP Offline or Rate Limited');
    } finally {
      setNlpLoading(false);
    }
  };

  // AI OCR Receipt Scanner (Convert image to base64, send to OpenAI Vision)
  const handleOCRFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const res = await fetch(`${API_BASE_URL}/ai-expenses/ocr`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64String })
        });

        if (res.ok) {
          const parsed = await res.json();
          setManualAmount(parsed.amount || '');
          setManualCategory(parsed.category || 'shopping');
          setManualDesc(`${parsed.merchant || 'OCR Store'} - ${parsed.description || 'Receipt Scan'}`);
          toast.success('AI OCR Scan Complete! Details loaded.');
        } else {
          toast.error('OCR analysis failed');
        }
      } catch (err) {
        console.error(err);
        toast.error('Vision OCR Offline or Rate Limited');
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Recharts Category Data Formatting
  const categoryChartData = useMemo(() => {
    const totals = {};
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

    return Object.keys(totals).map(cat => ({
      name: cat.toUpperCase(),
      value: totals[cat],
      color: CATEGORY_COLORS[cat] || '#8b5cf6'
    }));
  }, [expenses]);

  // Recharts Timeline Data Formatting
  const timelineChartData = useMemo(() => {
    // Group by date
    const dates = {};
    expenses.forEach(e => {
      const d = new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dates[d] = (dates[d] || 0) + e.amount;
    });

    // Sort chronologically (simple reverse array sorting for visualization)
    return Object.keys(dates).map(d => ({
      date: d,
      amount: dates[d]
    })).reverse();
  }, [expenses]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 text-slate-900 rounded-[3rem] shadow-sm border border-slate-100/50 mt-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <span className="px-3 py-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 inline-block shadow-md">
            Travel Finance Hub
          </span>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            Smart Expense Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Seamless virtual wallets, group splitting, and real-time AI spending diagnostics.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="px-4 border-r border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Budget</p>
            {showBudgetEdit ? (
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={budget} 
                  onChange={(e) => setBudget(Number(e.target.value))}
                  onBlur={() => setShowBudgetEdit(false)}
                  className="w-20 font-black text-slate-900 border-b border-indigo-500 outline-none" 
                  autoFocus
                />
              </div>
            ) : (
              <p 
                onClick={() => setShowBudgetEdit(true)} 
                className="text-lg font-black text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                ₹{budget.toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <div className="px-4 border-r border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Spent</p>
            <p className="text-lg font-black text-indigo-600">₹{totalSpent.toLocaleString("en-IN")}</p>
          </div>
          <div className="px-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Wallet Balance</p>
            <p className="text-lg font-black text-emerald-500">₹{(wallet.balance || 0).toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* TOP ROW: WALLET CARD & BUDGET CIRCULAR METER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* VIRTUAL WALLET CONTAINER */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Prepaid Virtual Travel Card</p>
              <h2 className="text-sm font-semibold text-slate-300">Virtual Wallet Balance</h2>
              <p className="text-5xl font-black mt-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-violet-300">
                ₹{(wallet.balance || 0).toLocaleString("en-IN")}
              </p>
            </div>
            
            <div className="flex flex-col gap-3 shrink-0">
              <input 
                type="number" 
                placeholder="Top-up Amount"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none text-sm w-44"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleRazorpayTopup}
                  disabled={topupLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <DollarSign size={14} /> Gateway
                </button>
                <button 
                  onClick={handleDirectCredit}
                  disabled={topupLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <Sparkles size={14} /> Simulate
                </button>
              </div>
            </div>
          </div>

          {/* WALLET TRANSACTIONS FEED */}
          <div className="relative z-10 pt-6">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Recent Wallet Transactions</h3>
            {wallet.transactions && wallet.transactions.length > 0 ? (
              <div className="space-y-3 max-h-36 overflow-y-auto pr-2">
                {wallet.transactions.slice(0, 4).map((tx, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        tx.type === 'deposit' || tx.type === 'split_receive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'split_receive' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-black ${
                      tx.type === 'deposit' || tx.type === 'split_receive' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'split_receive' ? '+' : '-'}₹{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No wallet transactions logged yet. Top up your virtual account!
              </div>
            )}
          </div>
        </div>

        {/* BUDGET CIRCULAR RADIAL RING */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl rounded-full" />
          
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trip Budget Progress</h3>
          
          <div className="relative size-40 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="size-full rotate-[-90deg]">
              <circle 
                cx="80" 
                cy="80" 
                r="64" 
                className="stroke-slate-100 fill-none" 
                strokeWidth="10" 
              />
              <circle 
                cx="80" 
                cy="80" 
                r="64" 
                className={`fill-none transition-all duration-1000 ${
                  budgetProgress >= 80 ? 'stroke-red-500 animate-[pulse_2s_infinite]' : budgetProgress >= 50 ? 'stroke-amber-500' : 'stroke-indigo-500'
                }`}
                strokeWidth="10" 
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * budgetProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{budgetProgress}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Exhausted</span>
            </div>
          </div>

          <div className="mt-6">
            {budgetProgress >= 80 ? (
              <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl text-xs font-bold border border-red-100">
                <AlertTriangle size={16} /> Budget Scarcity Alert!
              </div>
            ) : (
              <p className="text-xs font-medium text-slate-500">
                You've remaining <span className="font-bold text-indigo-600">₹{(budget - totalSpent).toLocaleString("en-IN")}</span> for this trip.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* CORE ROW: EXPENDITURE ENTRY FORMS & AI SCANNING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* MANUAL CASH EXPENSE + NLP AI PREFILL */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <Sparkles className="text-violet-500" size={20} /> AI Expense Autocomplete
            </h2>
            <div className="size-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
              <Lightbulb size={16} />
            </div>
          </div>

          <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 mb-6 flex gap-3">
            <textarea 
              rows="2" 
              placeholder="e.g. Paid 850 for river rafting adventure tickets in rishikesh"
              value={nlpText}
              onChange={(e) => setNlpText(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-xs text-violet-950 placeholder-violet-400 font-medium resize-none"
            />
            <button 
              onClick={handleNLPParse}
              disabled={nlpLoading}
              className="px-4 bg-violet-500 hover:bg-violet-600 rounded-xl text-white text-xs font-bold uppercase tracking-widest shrink-0 transition-colors flex items-center justify-center"
            >
              {nlpLoading ? <RefreshCw size={14} className="animate-spin" /> : 'Autofill'}
            </button>
          </div>

          <form onSubmit={handleAddManual} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Expense Amount</label>
                <input 
                  type="number" 
                  placeholder="₹ Amount"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                <select 
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white outline-none text-sm transition-colors capitalize"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Expenditure Details</label>
                <input 
                  type="text" 
                  placeholder="What did you buy?"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Paid By (Who spent this?)</label>
                <input 
                  type="text" 
                  placeholder={user?.name || "Ramesh, Suresh..."}
                  value={manualPaidBy}
                  onChange={(e) => setManualPaidBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white outline-none text-sm transition-colors"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-indigo-100"
            >
              Add Cash Transaction
            </button>
          </form>
        </div>

        {/* OCR RECEIPT SCANNER ZONE */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-1">
              <Upload className="text-indigo-500" size={20} /> AI Receipt Scanner (OCR)
            </h2>
            <p className="text-slate-400 text-xs font-semibold mb-6">
              Drop an invoice receipt, and GPT-4o-mini Vision will automatically digest amount and category values.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/20 group relative overflow-hidden min-h-48">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleOCRFile}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {ocrLoading ? (
              <div className="flex flex-col items-center">
                <RefreshCw className="animate-spin text-indigo-500 mb-3" size={32} />
                <p className="text-xs font-bold text-slate-600">AI Vision Engine analyzing receipt...</p>
                <p className="text-[10px] text-slate-400 mt-1">This takes roughly 2-3 seconds</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="size-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <p className="text-xs font-bold text-slate-600">Upload Receipt Screenshot</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG formats supported</p>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider justify-center">
            <Sparkles size={14} className="text-indigo-500" /> Integrated directly with GPT Vision
          </div>
        </div>

      </div>

      {/* NEW SECTION: GROUP SPLITTING SYSTEM (Splitwise-style) */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="text-emerald-500" size={20} /> Group Split Ledgers
          </h2>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
            Virtual Wallet Settle
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create split form */}
          <form onSubmit={handleAddSplit} className="lg:col-span-1 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Emails to split with (comma separated)</label>
              <input 
                type="text" 
                placeholder="friend1@questora.com, friend2@questora.com"
                value={splitEmails}
                onChange={(e) => setSplitEmails(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white outline-none text-sm transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Bill Amount</label>
                <input 
                  type="number" 
                  placeholder="₹ Amount"
                  value={splitAmount}
                  onChange={(e) => setSplitAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                <select 
                  value={splitCategory}
                  onChange={(e) => setSplitCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white outline-none text-sm transition-colors capitalize"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
              <input 
                type="text" 
                placeholder="Rafting bills, Cafe dinner, etc."
                value={splitDesc}
                onChange={(e) => setSplitDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white outline-none text-sm transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg"
            >
              Split Equally
            </button>
          </form>

          {/* Splitting ledger list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Split ledger feed</h3>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {expenses.filter(e => e.isSplit).length > 0 ? (
                expenses.filter(e => e.isSplit).map((exp) => {
                  // Determine if the current user paid this or is a recipient of split
                  const isPaidByMe = exp.userId && (typeof exp.userId === 'object' ? exp.userId._id === currentUserId : exp.userId === currentUserId);
                  
                  // Check user settlement share status
                  let myShareStatus = null;
                  if (!isPaidByMe && exp.splits) {
                    const myShare = exp.splits.find(s => s.userId && (typeof s.userId === 'object' ? s.userId._id === currentUserId : s.userId === currentUserId));
                    if (myShare) {
                      myShareStatus = myShare;
                    }
                  }

                  return (
                    <div key={exp._id} className="p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100 relative group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <span className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider">
                          {exp.category}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-2">{exp.description}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-1">
                          Total bill: <span className="font-bold text-slate-900">₹{exp.amount}</span> Paid by{' '}
                          <span className="font-bold text-indigo-500">{isPaidByMe ? 'You' : exp.userId?.name || 'Friend'}</span>
                        </p>
                        
                        {/* Splits breakdown list */}
                        <div className="flex gap-2 flex-wrap mt-3">
                          {exp.splits.map((s, idx) => (
                            <span key={idx} className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              s.isSettled ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {s.userId?.name || 'Participant'}: ₹{s.amount} {s.isSettled ? '✓' : '⏰'}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-2 w-full md:w-auto">
                        {isPaidByMe ? (
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Splits</p>
                            <p className="text-sm font-black text-emerald-500">
                              +₹{exp.splits.filter(s => !s.isSettled).reduce((sum, s) => sum + s.amount, 0)}
                            </p>
                          </div>
                        ) : myShareStatus ? (
                          <div className="flex items-center gap-4 justify-between w-full md:w-auto">
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Share</p>
                              <p className="text-sm font-black text-red-500">₹{myShareStatus.amount}</p>
                            </div>
                            
                            {!myShareStatus.isSettled ? (
                              <button 
                                onClick={() => handleSettle(exp._id)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm"
                              >
                                Settle Share
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-100 flex items-center gap-1.5">
                                <Check size={12} strokeWidth={3} /> Settled
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <div className="size-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-3">
                    <Users size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">No split ledger accounts found</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Split expenditures with friends instantly</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* RECHARTS CATEGORY BREAKDOWN PIE CHART */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 lg:col-span-1 min-h-[380px] flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <PieIcon size={16} /> Category breakdown
          </h3>
          
          <div className="flex-1 flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-xs">Add expenses to visualize breakdown</p>
            )}
          </div>

          {/* Custom Labels List */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {categoryChartData.map((d, i) => (
              <span key={i} className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 flex items-center gap-1.5 capitalize text-slate-600">
                <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name.toLowerCase()}: ₹{d.value}
              </span>
            ))}
          </div>
        </div>

        {/* AREA CHART FOR TIMELINE SPENDING */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 lg:col-span-2 min-h-[380px] flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp size={16} /> Expenditure Timeline
          </h3>

          <div className="flex-1 flex items-center justify-center w-full">
            {timelineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={timelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-xs">Add expenses to visualize timeline data</p>
            )}
          </div>
        </div>

      </div>

      {/* DYNAMIC AI INSIGHTS COACH */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm mb-12">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-violet-500">
          <Lightbulb size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-violet-500 text-white rounded-2xl shadow-md">
                <Sparkles size={20} />
              </span>
              <div>
                <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">AI Companion Advice</p>
                <h3 className="text-xl font-black text-slate-900">Personalized Travel Advisor Insights</h3>
              </div>
            </div>
            
            <div className="px-4 py-1.5 bg-white border border-violet-100 rounded-full text-xs font-black text-violet-600 shadow-sm flex items-center gap-1.5">
              Grade: <span className="text-indigo-600">{aiInsights.overallGrade}</span>
            </div>
          </div>

          {insightsLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-6 bg-violet-200/20 rounded-lg animate-pulse" />)}
            </div>
          ) : aiInsights.insights && aiInsights.insights.length > 0 ? (
            <ul className="space-y-4">
              {aiInsights.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <span className="mt-1 flex-shrink-0 text-violet-500">•</span>
                  <p>{insight}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 font-medium italic">
              AI Coach is analyzing your logs. Insights will update automatically when you record your next expenditure.
            </p>
          )}
        </div>
      </div>

      {/* ALL EXPENSES HISTORY FEED */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Master Expense Feed</h3>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : expenses.length > 0 ? (
          <div className="space-y-4">
            {expenses.map((exp) => (
              <div key={exp._id} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-base shadow-sm font-semibold"
                    style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#6366f1' }}
                  >
                    {exp.category === 'food' ? '🍔' : exp.category === 'hotel' ? '🏨' : exp.category === 'activity' ? '🛶' : exp.category === 'shopping' ? '🛍️' : exp.category === 'transport' ? '🚗' : exp.category === 'rentals' ? '🛵' : '✈️'}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{exp.description}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase mt-1">
                      <span className="capitalize">{exp.category}</span>
                      <span>•</span>
                      <span>{new Date(exp.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={exp.type === 'online' ? 'text-indigo-500' : 'text-slate-500'}>{exp.type}</span>
                      {exp.type === 'cash' && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-black">Paid by: {exp.paidBy || exp.userId?.name || 'Me'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900">₹{exp.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl">
            <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Your Travel Wallet is empty!</h3>
            <p className="text-slate-400 text-xs mt-1">Cash entries and payment bookings will compile here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
