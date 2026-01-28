
import React, { useState, useEffect } from 'react';
import { Send, User, MessageCircle, Clock, Sparkles } from 'lucide-react';
import { getAIDoubtResponse } from '../services/geminiService.ts';
import { useAuth } from '../App.tsx';
import { db } from '../services/firebase.ts';
import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';

interface Doubt {
  id: string;
  userId: string;
  content: string;
  response?: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
}

export default function DoubtsPage() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [newDoubt, setNewDoubt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "doubts"), where("userId", "==", user.id), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDoubts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doubt)));
    });
    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoubt.trim() || isSubmitting || !user) return;

    setIsSubmitting(true);
    const questionText = newDoubt;
    setNewDoubt('');

    try {
      const docRef = await addDoc(collection(db, "doubts"), {
        userId: user.id,
        content: questionText,
        status: 'OPEN',
        createdAt: new Date().toISOString()
      });

      // AI Logic
      const aiResponse = await getAIDoubtResponse(questionText);
      await updateDoc(doc(db, "doubts", docRef.id), {
        response: aiResponse,
        status: 'RESOLVED'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900">AI Expert Doubt Clearing</h1>
        <p className="text-slate-500 font-medium">Submit queries for professional AI evaluation.</p>
      </div>

      <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={newDoubt}
            onChange={(e) => setNewDoubt(e.target.value)}
            placeholder="Type your academic query here..."
            className="w-full min-h-[140px] p-8 bg-slate-50 border-none rounded-[32px] focus:ring-4 focus:ring-indigo-100 transition-all text-xl font-medium placeholder:text-slate-300"
          ></textarea>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Sparkles size={16} className="text-amber-500" /> AI Engine Ready</div>
            <button disabled={isSubmitting} type="submit" className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
              {isSubmitting ? 'Syncing...' : 'Transmit Query'} <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {doubts.map((doubt) => (
          <div key={doubt.id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:border-indigo-200 transition-all">
            <div className="p-8">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">{user?.name[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-900">{user?.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={12} className="inline mr-1" />{new Date(doubt.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">{doubt.content}</p>
                </div>
              </div>

              {doubt.response ? (
                <div className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 ml-12 relative shadow-inner">
                  <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">AI Tutor Node</div>
                  <p className="text-indigo-900 text-lg leading-relaxed font-medium italic">"{doubt.response}"</p>
                </div>
              ) : (
                <div className="ml-12 p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center gap-4 text-slate-400 font-bold italic">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div> Processing query...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
