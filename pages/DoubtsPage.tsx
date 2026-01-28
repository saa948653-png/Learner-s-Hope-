
import React, { useState } from 'react';
import { Send, User, MessageCircle, Clock, Sparkles, Filter } from 'lucide-react';
import { getAIDoubtResponse } from '../services/geminiService';

interface Doubt {
  id: string;
  userId: string;
  content: string;
  response?: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
}

export default function DoubtsPage() {
  const [doubts, setDoubts] = useState<Doubt[]>([
    { id: '1', userId: 'u1', content: 'Can someone explain the difference between Process and Thread?', status: 'RESOLVED', response: 'A process is a self-contained execution environment with its own memory space, while a thread is a smaller execution unit within a process that shares the same memory.', createdAt: '2023-10-24T10:00:00Z' },
  ]);
  const [newDoubt, setNewDoubt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoubt.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const doubtId = Math.random().toString();
    const tempDoubt: Doubt = {
      id: doubtId,
      userId: 'u1',
      content: newDoubt,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    setDoubts(prev => [tempDoubt, ...prev]);
    const question = newDoubt;
    setNewDoubt('');

    // AI auto-reply
    const aiResponse = await getAIDoubtResponse(question);
    setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, response: aiResponse, status: 'RESOLVED' } : d));
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expert Doubt Clearing</h1>
          <p className="text-slate-500">Instant AI solutions and community support.</p>
        </div>
      </div>

      {/* Ask Question Box */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-xl shadow-slate-100/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newDoubt}
            onChange={(e) => setNewDoubt(e.target.value)}
            placeholder="Type your doubt here... (e.g., 'How does the TCP 3-way handshake work?')"
            className="w-full min-h-[120px] p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-lg placeholder:text-slate-400"
          ></textarea>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-500" /> AI Response enabled</span>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Asking...' : 'Submit Question'}
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex gap-4">
          <button className="text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-4 -mb-4.5">Recent</button>
          <button className="text-sm font-bold text-slate-400 hover:text-slate-600 pb-4">My Doubts</button>
          <button className="text-sm font-bold text-slate-400 hover:text-slate-600 pb-4">Unanswered</button>
        </div>
        <button className="flex items-center gap-2 text-slate-400 text-sm hover:text-slate-600">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Doubts List */}
      <div className="space-y-6">
        {doubts.map((doubt) => (
          <div key={doubt.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-200 transition-all group">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <User size={24} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900">Student #u1</span>
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <Clock size={12} /> {new Date(doubt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">{doubt.content}</p>
                </div>
              </div>

              {doubt.response ? (
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 ml-12 relative">
                  <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={10} /> AI Tutor
                  </div>
                  <p className="text-indigo-900 leading-relaxed italic">"{doubt.response}"</p>
                  <div className="mt-4 pt-4 border-t border-indigo-100 flex items-center justify-between">
                    <span className="text-xs text-indigo-400 font-medium italic">Verified by System</span>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Mark as helpful</button>
                  </div>
                </div>
              ) : (
                <div className="ml-12 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center gap-3 text-slate-400 italic text-sm">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  Waiting for response...
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-6">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-wider">
                <MessageCircle size={16} /> 0 Comments
              </button>
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-wider">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
