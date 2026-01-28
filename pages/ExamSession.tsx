
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ShieldAlert, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { MOCK_EXAMS } from '../services/mockData.ts';
import { UserAnswer, ExamAttempt } from '../types.ts';
import { useAuth } from '../App.tsx';
import { db } from '../services/firebase.ts';
import { collection, addDoc } from 'firebase/firestore';

export default function ExamSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const exam = MOCK_EXAMS.find(e => e.id === id);
  
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [timeLeft, setTimeLeft] = useState(exam ? exam.durationMinutes * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportedQuestions, setReportedQuestions] = useState<Set<string>>(new Set());
  const [cheatWarnings, setCheatWarnings] = useState(0);

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatWarnings(prev => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!exam || isSubmitting || !user) return;
    setIsSubmitting(true);
    
    const userAnswers: UserAnswer[] = exam.questions.map(q => ({
      questionId: q.id,
      selectedOption: answers[q.id] ?? null,
      isCorrect: answers[q.id] === q.correctOption,
      timeSpentSeconds: 0 
    }));

    const score = userAnswers.reduce((acc, curr) => acc + (curr.isCorrect ? 1 : 0), 0);
    
    const attemptData = {
      userId: user.id,
      examId: exam.id,
      score,
      maxScore: exam.totalMarks,
      answers: userAnswers,
      completedAt: new Date().toISOString(),
      status: 'COMPLETED'
    };

    try {
      const docRef = await addDoc(collection(db, "attempts"), attemptData);
      navigate(`/result/${docRef.id}`);
    } catch (error) {
      console.error("Failed to save result:", error);
      alert("System error saving results. Please contact support.");
      setIsSubmitting(false);
    }
  }, [exam, answers, navigate, isSubmitting, user]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  const scrollToQuestion = (id: string) => {
    questionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (!exam) return <div className="p-12 text-center text-slate-500 font-bold">Session initialization failed.</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none">
      {cheatWarnings > 0 && cheatWarnings < 3 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-bounce">
          <div className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <ShieldAlert size={20} />
            <span className="font-bold">Security Alert: Tab switching detected! ({cheatWarnings}/3)</span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">{exam.title[0]}</div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight truncate max-w-md">{exam.title}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Proctoring: Active</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            <Clock size={18} />
            <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => { if(confirm('Finish and submit?')) handleSubmit(); }}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Syncing...' : 'Finish Exam'}
          </button>
        </div>
      </header>

      <div className="h-1.5 bg-slate-100 w-full sticky top-[73px] z-40">
        <div className="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 container mx-auto max-w-7xl p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8 pb-20">
          {exam.questions.map((q, idx) => (
            <div key={q.id} ref={el => questionRefs.current[q.id] = el} className={`bg-white p-10 rounded-[40px] border-2 transition-all ${answers[q.id] !== undefined ? 'border-indigo-100 shadow-xl' : 'border-white shadow-lg'}`}>
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-sm">{idx + 1}</span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{q.topic}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 leading-snug mb-10">{q.content}</h2>
              <div className="grid grid-cols-1 gap-4">
                {q.options.map((option, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                    className={`flex items-center gap-5 p-6 rounded-3xl border-2 text-left transition-all group ${answers[q.id] === oIdx ? 'bg-indigo-50/50 border-indigo-600 ring-4 ring-indigo-50' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${answers[q.id] === oIdx ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + oIdx)}</div>
                    <span className={`text-lg font-semibold flex-1 ${answers[q.id] === oIdx ? 'text-indigo-900' : 'text-slate-700'}`}>{option}</span>
                    {answers[q.id] === oIdx && <CheckCircle2 size={24} className="text-indigo-600 animate-in zoom-in" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="w-full lg:w-80 h-fit lg:sticky lg:top-24">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Navigation Map</h3>
            <div className="grid grid-cols-5 gap-3">
              {exam.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`w-full aspect-square rounded-2xl flex items-center justify-center font-black text-sm transition-all ${answers[q.id] !== undefined ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
