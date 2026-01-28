
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  Layers, 
  MessageCircle, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  ChevronRight,
  Bell,
  Search,
  ShieldAlert
} from 'lucide-react';
import { User, UserRole } from './types.ts';
import { auth, db } from './services/firebase.ts';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// --- Context & Auth ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Pages ---
import Dashboard from './pages/Dashboard.tsx';
import ExamList from './pages/ExamList.tsx';
import ExamSession from './pages/ExamSession.tsx';
import ResultPage from './pages/ResultPage.tsx';
import HistoryPage from './pages/HistoryPage.tsx';
import FlashcardsPage from './pages/FlashcardsPage.tsx';
import DoubtsPage from './pages/DoubtsPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Exam Center', icon: BookOpen, path: '/exams' },
    { label: 'Results & History', icon: History, path: '/history' },
    { label: 'Modular Recall', icon: Layers, path: '/flashcards' },
    { label: 'Expert Help', icon: MessageCircle, path: '/doubts' },
  ];

  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[101] w-72 bg-white border-r border-slate-200 transform transition-all duration-500
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 font-black text-2xl text-slate-900">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">SF</div>
            StudyFlow<span className="text-indigo-600">.</span>
          </Link>
        </div>
        
        <nav className="flex-1 mt-4 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group
                ${location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-3xl mb-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user.name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 text-rose-500 hover:bg-white hover:text-rose-600 rounded-2xl transition-all font-bold text-xs"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className={`h-20 px-8 flex items-center justify-between z-40 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200' : 'bg-transparent'}`}>
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 p-2 bg-white rounded-xl shadow-sm" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 w-72">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Quick find..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="p-2.5 text-slate-500 hover:text-indigo-600 rounded-2xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm">
              {user.name[0]}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user metadata from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // Initialize if missing (e.g., social login first time)
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || "Student",
            role: UserRole.STUDENT,
            avatar: firebaseUser.photoURL || undefined
          };
          await setDoc(doc(db, "users", firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-20 h-20 bg-indigo-600 rounded-[32px] animate-bounce flex items-center justify-center text-3xl font-black mb-8 shadow-2xl shadow-indigo-500/50">SF</div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-50">Syncing Cloud Data</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/" element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
          <Route path="/exams" element={user ? <Layout><ExamList /></Layout> : <Navigate to="/login" />} />
          <Route path="/exam/:id" element={user ? <ExamSession /> : <Navigate to="/login" />} />
          <Route path="/result/:attemptId" element={user ? <Layout><ResultPage /></Layout> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <Layout><HistoryPage /></Layout> : <Navigate to="/login" />} />
          <Route path="/flashcards" element={user ? <Layout><FlashcardsPage /></Layout> : <Navigate to="/login" />} />
          <Route path="/doubts" element={user ? <Layout><DoubtsPage /></Layout> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}
