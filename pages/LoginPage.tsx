
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/firebase.ts';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail,
  FacebookAuthProvider
} from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message.replace('Firebase:', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError(null);
    try {
      const authProvider = provider === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
      await signInWithPopup(auth, authProvider);
      navigate('/');
    } catch (err: any) {
      setError(err.message.replace('Firebase:', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError(null);
    } catch (err: any) {
      setError(err.message.replace('Firebase:', ''));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Brand Side */}
      <div className="hidden md:flex flex-1 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-2 font-bold text-3xl">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600">S</div>
          StudyFlow Pro
        </div>
        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-5xl font-black leading-tight">Elevate Your Study Experience.</h2>
          <p className="text-xl text-indigo-100 font-medium">Access secure exams and AI-powered analytics designed for peak performance.</p>
        </div>
        <div className="relative z-10 flex items-center gap-4 text-indigo-200 text-sm font-semibold">
          <ShieldCheck size={20} />
          Enterprise-grade security standards applied.
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Log in to your student cloud account</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 text-sm animate-in shake duration-300">
              <AlertCircle className="shrink-0" size={18} />
              <p>{error}</p>
            </div>
          )}

          {resetSent && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-600 text-sm">
              <ShieldCheck className="shrink-0" size={18} />
              <p>Password reset link sent to your email!</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest block ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-xs font-bold text-indigo-600 hover:underline">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <>Sign In <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="text-center space-y-4 pt-4">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
            </p>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-bold uppercase tracking-widest">Or social login</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleSocialLogin('google')} className="py-3 bg-white border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Google
              </button>
              <button onClick={() => handleSocialLogin('facebook')} className="py-3 bg-white border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2">
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="FB" />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
