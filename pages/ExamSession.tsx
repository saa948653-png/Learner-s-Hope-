
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flag, AlertTriangle, Send, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { MOCK_EXAMS } from '../services/mockData';
import { UserAnswer, ExamAttempt } from '../types';

export default function ExamSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = MOCK_EXAMS.find(e => e.id === id);
  
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [timeLeft, setTimeLeft] = useState(exam ? exam.durationMinutes * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportedQuestions, setReportedQuestions] = useState<Set<string>>(new Set());
  const [cheatWarnings, setCheatWarnings] = useState(0);

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Security: Detect tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatWarnings(prev => prev + 1);
        console.warn("Security Alert: User switched tabs.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!exam || isSubmitting) return;
    setIsSubmitting(true);
    
    const userAnswers: UserAnswer[] = exam.questions.map(q => ({
      questionId: q.id,
      selectedOption: answers[q.id] ?? null,
      isCorrect: answers[q.id] === q.correctOption,
      timeSpentSeconds: 0 
    }));

    const score = userAnswers.reduce((acc, curr) => acc + (curr.isCorrect ? 1 : 0), 0);
    
    const attempt: ExamAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'u1',
      examId: exam.id,
      score,
      maxScore: exam.totalMarks,
      answers: userAnswers,
      completedAt: new Date().toISOString(),
      status: 'COMPLETED'
    };

    const existing = JSON.parse(localStorage.getItem('studyflow_attempts') || '[]');
    localStorage.setItem('studyflow_attempts', JSON.stringify([...existing, attempt]));

    // Small delay for professional feedback
    setTimeout(() => {
      navigate(`/result/${attempt.id}`);
    }, 1500);
  }, [exam, answers, navigate, isSubmitting]);

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

  const toggleReport = (id: string) => {
    setReportedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!exam) return <div className="p-12 text-center text-slate-500">Exam session could not be initialized.</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none">
      {/* Security Alert Modal */}
      {cheatWarnings > 0 && cheatWarnings < 3 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-bounce">
          <div className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <ShieldAlert size={20} />
            <span className="font-bold">Security Warning: Do not leave this tab. ({cheatWarnings}/3)</span>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl items-center justify-center text-white font-bold flex">
            {exam.title[0]}
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-slate-900 leading-tight truncate max-w-md">{exam.title}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Secure Proctoring Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            <Clock size={18} />
            <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => { if(confirm('Are you sure you want to finish and submit?')) handleSubmit(); }}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200"
          >
            {isSubmitting ? 'Finalizing...' : 'Finish Exam'}
            <Send size={18} />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-100 w-full sticky top-[73px] z-40">
        <div 
          className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8 pb-20">
          {exam.questions.map((q, idx) => (
            <div 
              key={q.id}
              ref={el => questionRefs.current[q.id] = el}
              className={`
                bg-white p-6 sm:p-10 rounded-[40px] border-2 transition-all duration-500
                ${answers[q.id] !== undefined ? 'border-indigo-100 shadow-xl' : 'border-white shadow-lg'}
              `}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-sm">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest block w-fit">
                      {q.topic}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Point weight: {q.weight}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleReport(q.id)}
                  className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${reportedQuestions.has(q.id) ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent'}`}
                >
                  <AlertCircle size={14} />
                  {reportedQuestions.has(q.id) ? 'Reported' : 'Report Error'}
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug mb-10">
                {q.content}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {q.options.map((option, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                    className={`
                      flex items-center gap-5 p-5 sm:p-6 rounded-3xl border-2 text-left transition-all group relative
                      ${answers[q.id] === oIdx 
                        ? 'bg-indigo-50/50 border-indigo-600 ring-4 ring-indigo-50' 
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-all shrink-0
                      ${answers[q.id] === oIdx ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}
                    `}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    <span className={`text-lg font-semibold flex-1 ${answers[q.id] === oIdx ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {option}
                    </span>
                    {answers[q.id] === oIdx && <CheckCircle2 size={24} className="text-indigo-600 animate-in zoom-in" />}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-slate-900 rounded-[48px] p-10 sm:p-16 text-white text-center shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4">Final Review</h3>
              <p className="text-slate-400 mb-10 max-w-md mx-auto text-lg">Verify your progress and answer status before submitting the script for evaluation.</p>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-14 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 mx-auto shadow-xl shadow-indigo-500/20"
              >
                {isSubmitting ? 'Authenticating...' : 'Complete & Submit'}
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-80 h-fit lg:sticky lg:top-24">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                Question Matrix
              </h3>
              <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full text-xs">
                {answeredCount}/{exam.questions.length}
              </span>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {exam.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`
                    w-full aspect-square rounded-2xl flex items-center justify-center font-black text-sm transition-all
                    ${answers[q.id] !== undefined ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'}
                    ${reportedQuestions.has(q.id) ? 'ring-2 ring-rose-500 ring-offset-2' : ''}
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
              <LegendItem color="bg-indigo-600" label="Attempted" />
              <LegendItem color="bg-slate-100 border border-slate-200" label="Pending" />
              <LegendItem color="border-2 border-rose-500" label="Flagged" />
            </div>

            <div className="mt-10 p-5 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
              <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20} />
              <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                Security mode is ON. Your session is monitored for tab-switching and external help.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
    <div className={`w-3.5 h-3.5 rounded-md ${color}`}></div> 
    {label}
  </div>
);
