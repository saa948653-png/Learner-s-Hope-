
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight, 
  RefreshCcw, 
  TrendingUp,
  Share2
} from 'lucide-react';
import { ExamAttempt, Exam } from '../types';
import { MOCK_EXAMS } from '../services/mockData';
import { getTopicInsight } from '../services/geminiService';

export default function ResultPage() {
  const { attemptId } = useParams();
  const [insight, setInsight] = useState<string>('Loading AI insight...');
  
  const attempt: ExamAttempt = JSON.parse(localStorage.getItem('studyflow_attempts') || '[]')
    .find((a: any) => a.id === attemptId);

  const exam: Exam | undefined = attempt ? MOCK_EXAMS.find(e => e.id === attempt.examId) : undefined;

  useEffect(() => {
    if (attempt) {
      const mistakes = attempt.answers.filter(a => !a.isCorrect).map(a => 'Topic ID: ' + a.questionId);
      getTopicInsight(mistakes).then(setInsight);
    }
  }, [attempt]);

  if (!attempt || !exam) return <div className="p-12 text-center">Attempt details not found.</div>;

  const scorePercentage = Math.round((attempt.score / attempt.maxScore) * 100);
  const correctCount = attempt.answers.filter(a => a.isCorrect).length;
  const wrongCount = attempt.answers.filter(a => a.selectedOption !== null && !a.isCorrect).length;
  const skippedCount = attempt.answers.filter(a => a.selectedOption === null).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in zoom-in-95 duration-500">
      {/* Performance Summary Header */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="bg-indigo-600 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Exam Result</h1>
            <p className="opacity-80 font-medium">{exam.title}</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-black">{scorePercentage}%</div>
              <div className="text-xs uppercase font-bold opacity-70 tracking-widest mt-1">Total Score</div>
            </div>
            <div className="w-px h-12 bg-white/20 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl font-black">{attempt.score}/{attempt.maxScore}</div>
              <div className="text-xs uppercase font-bold opacity-70 tracking-widest mt-1">Marks Obtained</div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase">Correct</p>
              <p className="text-2xl font-black text-emerald-900">{correctCount}</p>
            </div>
          </div>
          <div className="bg-rose-50 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-600 uppercase">Incorrect</p>
              <p className="text-2xl font-black text-rose-900">{wrongCount}</p>
            </div>
          </div>
          <div className="bg-slate-100 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-400 rounded-xl flex items-center justify-center text-white">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Skipped</p>
              <p className="text-2xl font-black text-slate-900">{skippedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <TrendingUp size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              AI Study Assistant Insight
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase">Beta</span>
            </h2>
            <p className="text-indigo-50 leading-relaxed text-lg italic">"{insight}"</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <button 
          onClick={() => window.location.href = '#/exams'}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
        >
          <RefreshCcw size={20} />
          Retake Exam
        </button>
        {wrongCount > 0 && (
          <button 
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-rose-600 text-rose-600 rounded-2xl font-bold hover:bg-rose-50 transition-all shadow-sm"
          >
            Practice Mistakes
            <XCircle size={20} />
          </button>
        )}
        <button className="flex items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
          <Share2 size={24} />
        </button>
      </div>

      {/* Question Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 font-bold text-slate-900 uppercase tracking-widest text-sm">
          Detailed Analysis
        </div>
        <div className="divide-y divide-slate-100">
          {exam.questions.map((q, idx) => {
            const userAns = attempt.answers.find(a => a.questionId === q.id);
            const isCorrect = userAns?.isCorrect;
            const isSkipped = userAns?.selectedOption === null;

            return (
              <div key={q.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-slate-400 font-bold">#{idx + 1}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-2 leading-relaxed">{q.content}</h4>
                    <div className="flex gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                        {q.topic}
                      </span>
                      {isCorrect ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded">Correct</span>
                      ) : isSkipped ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded">Skipped</span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-rose-100 text-rose-600 rounded">Incorrect</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className={`
                      p-3 rounded-xl text-sm flex items-center gap-3 border
                      ${oIdx === q.correctOption ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-100 text-slate-500'}
                      ${userAns?.selectedOption === oIdx && oIdx !== q.correctOption ? 'bg-rose-50 border-rose-200 text-rose-800' : ''}
                    `}>
                      <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/50 font-bold border border-inherit">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                      {oIdx === q.correctOption && <CheckCircle size={16} className="ml-auto text-emerald-500" />}
                      {userAns?.selectedOption === oIdx && oIdx !== q.correctOption && <XCircle size={16} className="ml-auto text-rose-500" />}
                    </div>
                  ))}
                </div>
                
                {(!isCorrect || isSkipped) && (
                  <div className="mt-4 pl-8 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Explanation</p>
                    <p className="text-sm text-slate-600 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
