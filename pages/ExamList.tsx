
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, AlertCircle, Play } from 'lucide-react';
import { MOCK_EXAMS } from '../services/mockData';

export default function ExamList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Available Exams</h1>
          <p className="text-slate-500">Choose a topic to test your knowledge.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_EXAMS.map((exam) => (
          <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:border-indigo-300 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {exam.category}
                </span>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <Clock size={16} />
                  {exam.durationMinutes}m
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{exam.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{exam.description}</p>
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <BookOpen size={16} className="text-slate-400" />
                  {exam.questions.length} Questions
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <AlertCircle size={16} className="text-slate-400" />
                  {exam.totalMarks} Marks
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 italic">No time limit set for demo</span>
              <button 
                onClick={() => navigate(`/exam/${exam.id}`)}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all active:scale-95"
              >
                Start Exam
                <Play size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
