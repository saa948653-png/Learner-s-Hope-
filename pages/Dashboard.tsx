
import React, { useMemo, useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Award, Clock, Target, TrendingUp, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App.tsx';
import { db } from '../services/firebase.ts';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { ExamAttempt } from '../types.ts';

export default function Dashboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "attempts"), 
          where("userId", "==", user.id),
          orderBy("completedAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamAttempt));
        setAttempts(fetched);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  const stats = useMemo(() => {
    const total = attempts.length;
    const avgScore = total > 0 ? (attempts.reduce((acc, curr) => acc + (curr.score / curr.maxScore), 0) / total) * 100 : 0;
    return { total, avgScore: Math.round(avgScore) };
  }, [attempts]);

  const chartData = [...attempts].reverse().map((a, i) => ({
    name: `Exam ${i + 1}`,
    score: Math.round((a.score / a.maxScore) * 100),
  }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Cloud Performance Hub</h1>
          <p className="text-slate-500 font-medium">Hello, {user?.name}. Here is your academic telemetry.</p>
        </div>
        <Link to="/exams" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
          New Exam <ArrowUpRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Award} label="Exams Taken" value={stats.total.toString()} trend="All Time" color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Target} label="Avg Accuracy" value={`${stats.avgScore}%`} trend="Overall" color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard icon={Clock} label="Session Time" value="Active" trend="Real-time" color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={TrendingUp} label="Rank status" value="Top 10%" trend="Global" color="text-rose-600" bg="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Learning Trajectory</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p className="font-bold">No telemetry data available.</p>
                <Link to="/exams" className="text-indigo-600 mt-2 font-bold hover:underline">Complete an exam to begin</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[32px] text-white flex flex-col justify-between shadow-xl shadow-indigo-100">
           <div>
             <h3 className="text-xl font-bold mb-2">Mastery Index</h3>
             <p className="text-indigo-100 text-sm font-medium">Your progress across all core competencies is currently being indexed by AI.</p>
           </div>
           <div className="py-8 space-y-4">
             <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1"><span>Topic Sync</span><span>82%</span></div>
             <div className="h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white w-[82%] rounded-full shadow-[0_0_10px_white]"></div></div>
           </div>
           <Link to="/history" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-bold group">
             Detailed Logs <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, trend, color, bg }: any) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-200 transition-all hover:shadow-xl hover:-translate-y-1 group">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-2xl ${bg} ${color} group-hover:scale-110 transition-transform`}><Icon size={24} /></div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trend}</div>
  </div>
);
