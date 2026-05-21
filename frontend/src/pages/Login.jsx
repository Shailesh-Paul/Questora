import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      const userRole = result.user?.role;
      if (userRole === 'student') navigate('/student-dashboard');
      else if (userRole === 'employee') navigate('/employee-dashboard');
      else if (userRole === 'admin') navigate('/admin');
      else navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
          <p className="text-slate-500 mt-2">Access your personalized dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 size-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 size-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-600 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-slate-300" />
              Remember me
            </label>
            <Link to="/forgot-password" size="sm" className="text-blue-600 font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              <>
                Sign In
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
