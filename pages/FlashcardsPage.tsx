
import React, { useState } from 'react';
import { 
  RotateCcw, 
  Check, 
  X, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
  known: boolean;
}

const MOCK_FLASHCARDS: Flashcard[] = [
  { id: '1', front: 'What is Time Complexity?', back: 'The computational complexity that describes the amount of time it takes to run an algorithm.', topic: 'DSA', known: false },
  { id: '2', front: 'Space Complexity of BFS?', back: 'O(V) where V is the number of vertices.', topic: 'Graph Theory', known: false },
  { id: '3', front: 'Explain OSI Layer 3', back: 'Network Layer: Responsible for packet forwarding including routing through intermediate routers.', topic: 'Networking', known: false },
];

export default function FlashcardsPage() {
  const [cards, setCards] = useState(MOCK_FLASHCARDS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleKnown = (known: boolean) => {
    const newCards = [...cards];
    newCards[currentIdx].known = known;
    setCards(newCards);
    if (currentIdx < cards.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setIsFlipped(false);
    }
  };

  const currentCard = cards[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Active Recall</h1>
          <p className="text-slate-500">Master concepts through spaced repetition.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
          <Plus size={20} />
          Create Card
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500" 
            style={{ width: `${((currentIdx + 1) / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
          {currentIdx + 1} / {cards.length}
        </span>
      </div>

      {/* Card Container */}
      <div className="perspective-1000 h-[400px]">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`
            relative w-full h-full cursor-pointer transition-all duration-700 preserve-3d
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] border border-slate-200 shadow-2xl flex flex-col items-center justify-center p-12 text-center group">
            <span className="absolute top-8 left-8 text-xs font-bold text-indigo-500 uppercase tracking-widest">
              {currentCard.topic}
            </span>
            <Sparkles size={32} className="text-indigo-100 mb-6 group-hover:text-indigo-200 transition-colors" />
            <h2 className="text-3xl font-bold text-slate-800 leading-tight">
              {currentCard.front}
            </h2>
            <p className="mt-12 text-slate-400 text-sm font-medium animate-pulse">Click to reveal answer</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-[40px] text-white rotate-y-180 flex flex-col items-center justify-center p-12 text-center shadow-2xl shadow-indigo-200">
            <h2 className="text-2xl font-medium text-indigo-50 leading-relaxed mb-12">
              {currentCard.back}
            </h2>
            
            <div className="flex gap-6 mt-4">
              <button 
                onClick={(e) => { e.stopPropagation(); handleKnown(false); }}
                className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-rose-500 border border-white/20 flex items-center justify-center transition-all group"
              >
                <X size={28} className="text-white group-hover:scale-110" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleKnown(true); }}
                className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-emerald-500 border border-white/20 flex items-center justify-center transition-all group"
              >
                <Check size={28} className="text-white group-hover:scale-110" />
              </button>
            </div>
            <p className="mt-8 text-indigo-200 text-xs font-bold uppercase tracking-widest">Mark as Mastered?</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
        >
          <RotateCcw size={20} />
          Flip Card
        </button>
        <button 
          onClick={() => setCurrentIdx(Math.min(cards.length - 1, currentIdx + 1))}
          className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
