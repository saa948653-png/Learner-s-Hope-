
import React, { useState, useEffect } from 'react';
import { History, Calendar, Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExamAttempt } from '../types.ts';
import { MOCK_EXAMS } from '../services/mockData.ts';
import { useAuth } from '../App.tsx';
import { db } from '../services/firebase.ts';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function HistoryPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "attempts"), where("userId", "==", user.id), orderBy("completedAt", "desc"));
        const snap = await getDocs(q);
        setAttempts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamAttempt)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <div className="p-24 text-center font-bold text-slate-400">Loading Cloud Archives...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Cloud Exam History</h1>
          <p className="text-slate-500 font-medium">Verified historical performance logs.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Competency Group</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metrics</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attempts.length > 0 ? attempts.map((attempt) => {
                const exam = MOCK_EXAMS.find(e => e.id === attempt.examId);
                const accuracy = Math.round((attempt.score / attempt.maxScore) * 100);
                return (
                  <tr key={attempt.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">{exam?.title[0]}</div>
                        <div><p className="font-bold text-slate-900 leading-tight">{exam?.title}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{exam?.category}</p></div>
                      </div>
                    </td>
                    <td className="px-8 py-6"><div className="flex items-center gap-2 text-slate-600 font-bold text-sm"><Calendar size={16} className="text-slate-300" />{new Date(attempt.completedAt).toLocaleDateString()}</div></td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <span className="font-black text-slate-900 text-lg">{attempt.score}<span className="text-slate-300 text-sm font-bold">/{attempt.maxScore}</span></span>
                        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{accuracy}%</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right"><Link to={`/result/${attempt.id}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all">View Analytics <ArrowRight size={14} /></Link></td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={4} className="px-8 py-24 text-center font-bold text-slate-400">No telemetry records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
