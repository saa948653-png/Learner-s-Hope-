
import React from 'react';
import { History, Award, Calendar, Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExamAttempt } from '../types';
import { MOCK_EXAMS } from '../services/mockData';

export default function HistoryPage() {
  const attempts: ExamAttempt[] = JSON.parse(localStorage.getItem('studyflow_attempts') || '[]');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exam History</h1>
          <p className="text-slate-500">Review your past performance and improvements.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search exams..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Exam Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Score</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Accuracy</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {attempts.length > 0 ? [...attempts].reverse().map((attempt) => {
              const exam = MOCK_EXAMS.find(e => e.id === attempt.examId);
              const accuracy = Math.round((attempt.score / attempt.maxScore) * 100);
              
              return (
                <tr key={attempt.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        {exam?.category[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{exam?.title || 'Unknown Exam'}</p>
                        <p className="text-xs text-slate-400">ID: {attempt.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Calendar size={16} className="text-slate-300" />
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {attempt.score} <span className="text-slate-400 font-normal">/ {attempt.maxScore}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-[60px] h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{accuracy}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {attempt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/result/${attempt.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group-hover:shadow-lg"
                    >
                      View Report
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center">
                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <History size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No previous exam attempts found. Take your first exam to start tracking your progress!</p>
                    <Link to="/exams" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Browse Exams</Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
