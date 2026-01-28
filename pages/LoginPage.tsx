
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../App';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation of secure login
    setTimeout(() => {
      login(email || 'student@studyflow.pro');
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Visual Side */}
      <div className="hidden md:flex flex-1 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-2 font-bold text-3xl">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600">S</div>
          StudyFlow Pro
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-5xl font-black leading-tight">Elevate Your Study Experience.</h2>
          <p className="text-xl text-indigo-100 font-medium leading-relaxed">
            Access secure exams, AI-powered analytics, and modular revision tools designed for peak academic performance.
          </p>
          <div className="flex items-center gap-12 pt-8">
            <div>
              <p className="text-3xl font-black">15k+</p>
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-black">1.2M+</p>
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Exams Taken</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-indigo-200 text-sm font-semibold">
          <ShieldCheck size={20} />
          Enterprise-grade security standards applied.
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Securely access your study dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest block ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-sm font-medium text-slate-600">Keep me signed in for 30 days</label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In 
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-4 pt-4">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? <button className="text-indigo-600 font-bold hover:underline">Create Account</button>
            </p>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-bold uppercase tracking-widest">Or continue with</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Google
              </button>
              <button className="py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
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
