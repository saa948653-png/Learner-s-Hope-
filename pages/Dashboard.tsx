
import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  Award, 
  Clock, 
  Target, 
  TrendingUp, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExamAttempt } from '../types';

export default function Dashboard() {
  // Mock performance data
  const attempts: ExamAttempt[] = JSON.parse(localStorage.getItem('studyflow_attempts') || '[]');
  
  const stats = useMemo(() => {
    const total = attempts.length;
    const avgScore = total > 0 ? (attempts.reduce((acc, curr) => acc + (curr.score / curr.maxScore), 0) / total) * 100 : 0;
    
    // Topic performance tracking (mock aggregation)
    const topicMistakes: Record<string, number> = {};
    attempts.forEach(a => {
      a.answers.forEach(ans => {
        if (!ans.isCorrect) {
          // In a real app we'd map questionId back to topic
          topicMistakes['DS'] = (topicMistakes['DS'] || 0) + 1;
        }
      });
    });

    return { total, avgScore: Math.round(avgScore), topicMistakes };
  }, [attempts]);

  const chartData = attempts.map((a, i) => ({
    name: `Ex ${i + 1}`,
    score: Math.round((a.score / a.maxScore) * 100),
  })).slice(-10);

  const topicData = [
    { name: 'Data Structures', score: 85, color: '#4f46e5' },
    { name: 'OS', score: 65, color: '#7c3aed' },
    { name: 'Networking', score: 72, color: '#2563eb' },
    { name: 'Databases', score: 90, color: '#0891b2' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Overview</h1>
          <p className="text-slate-500">Track your progress and target weak topics.</p>
        </div>
        <Link to="/exams" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 w-fit">
          Start New Exam
          <ArrowUpRight size={18} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Award} label="Total Exams" value={stats.total.toString()} trend="+2 this week" color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Target} label="Avg Accuracy" value={`${stats.avgScore}%`} trend="+5% from last" color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard icon={Clock} label="Study Time" value="12.5h" trend="On track" color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={TrendingUp} label="Current Rank" value="#42" trend="Top 5%" color="text-rose-600" bg="bg-rose-50" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold mb-6">Score Trend</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p>No exam data yet</p>
                <Link to="/exams" className="text-indigo-600 mt-2 hover:underline">Take your first test</Link>
              </div>
            )}
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold mb-6">Topic Mastery</h3>
          <div className="space-y-6">
            {topicData.map((topic) => (
              <div key={topic.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">{topic.name}</span>
                  <span className="text-sm font-bold text-slate-900">{topic.score}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${topic.score}%`, backgroundColor: topic.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Attempts</h3>
          <Link to="/history" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {attempts.length > 0 ? attempts.slice(-5).reverse().map((attempt) => (
            <div key={attempt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${attempt.score / attempt.maxScore >= 0.7 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <Award size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Attempt ID: {attempt.id.slice(0, 8)}</p>
                  <p className="text-xs text-slate-500">{new Date(attempt.completedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{attempt.score}/{attempt.maxScore}</p>
                <p className={`text-xs ${attempt.score / attempt.maxScore >= 0.7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {Math.round((attempt.score / attempt.maxScore) * 100)}% Accuracy
                </p>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-slate-400">
              Your recent performance will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, trend, color, bg }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
    <div className="flex items-center gap-1.5 text-xs">
      <TrendingUp size={14} className="text-emerald-500" />
      <span className="text-emerald-600 font-medium">{trend}</span>
    </div>
  </div>
);
