
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RefreshCcw, TrendingUp, Share2 } from 'lucide-react';
import { ExamAttempt, Exam } from '../types.ts';
import { MOCK_EXAMS } from '../services/mockData.ts';
import { getTopicInsight } from '../services/geminiService.ts';
import { db } from '../services/firebase.ts';
import { doc, getDoc } from 'firebase/firestore';

export default function ResultPage() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [insight, setInsight] = useState<string>('Generating AI intelligence...');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAttempt = async () => {
      if (!attemptId) return;
      try {
        const docRef = doc(db, "attempts", attemptId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ExamAttempt;
          setAttempt(data);
          const mistakes = data.answers.filter(a => !a.isCorrect).map(a => 'Question: ' + a.questionId);
          getTopicInsight(mistakes).then(setInsight);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attemptId]);

  if (loading) return <div className="p-24 text-center text-slate-400 animate-pulse font-bold">Synchronizing result data...</div>;
  if (!attempt) return <div className="p-12 text-center text-rose-500 font-bold underline">Attempt signature not found in cloud.</div>;

  const exam = MOCK_EXAMS.find(e => e.id === attempt.examId);
  const scorePercentage = Math.round((attempt.score / attempt.maxScore) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Performance Summary</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Evaluated Result Script</p>
          </div>
          <div className="flex items-center gap-12 text-center">
            <div><div className="text-5xl font-black text-indigo-400">{scorePercentage}%</div><div className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em] mt-2">Accuracy</div></div>
            <div className="w-px h-16 bg-white/10" />
            <div><div className="text-5xl font-black text-white">{attempt.score}/{attempt.maxScore}</div><div className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em] mt-2">Score</div></div>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
           <ResultStat icon={CheckCircle} label="Success" count={attempt.answers.filter(a => a.isCorrect).length} color="text-emerald-500" bg="bg-emerald-50" />
           <ResultStat icon={XCircle} label="Gaps" count={attempt.answers.filter(a => a.selectedOption !== null && !a.isCorrect).length} color="text-rose-500" bg="bg-rose-50" />
           <ResultStat icon={Clock} label="Skipped" count={attempt.answers.filter(a => a.selectedOption === null).length} color="text-slate-400" bg="bg-slate-100" />
        </div>
      </div>

      <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="flex items-start gap-8 relative z-10">
          <div className="p-5 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20"><TrendingUp size={36} /></div>
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-3">AI Diagnostic Response <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full">Pro Model</span></h2>
            <p className="text-xl text-indigo-100 leading-relaxed font-medium italic">"{insight}"</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/exams" className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all text-center shadow-lg">New Attempt</Link>
        <button className="p-5 bg-white border border-slate-200 rounded-3xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"><Share2 size={24}/></button>
      </div>
    </div>
  );
}

const ResultStat = ({ icon: Icon, label, count, color, bg }: any) => (
  <div className={`${bg} p-6 rounded-3xl flex items-center gap-6 border border-white/50`}>
    <div className={`w-14 h-14 rounded-2xl ${color} bg-white flex items-center justify-center shadow-sm`}><Icon size={28} /></div>
    <div><p className={`text-[10px] font-black uppercase tracking-widest ${color} opacity-70`}>{label}</p><p className="text-3xl font-black text-slate-800">{count}</p></div>
  </div>
);
