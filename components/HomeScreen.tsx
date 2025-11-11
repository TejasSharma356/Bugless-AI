import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './Navbar';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { getHistory } from '../services/historyService';
import type { ReviewHistoryItem } from '../types';
import { PROGRAMMING_LANGUAGES } from '../constants';


const getScoreColor = (score: number): string => {
  if (score >= 85) return 'text-green-400 border-green-400';
  if (score >= 60) return 'text-yellow-400 border-yellow-400';
  return 'text-red-400 border-red-400';
};

const HistoryItemCard: React.FC<{item: ReviewHistoryItem, onSelect: () => void}> = ({ item, onSelect }) => {
    const languageLabel = PROGRAMMING_LANGUAGES.find(l => l.value === item.language)?.label || item.language;
    return (
        <div 
            className="bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors cursor-pointer" 
            onClick={onSelect}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="font-semibold text-white">{languageLabel}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(item.date).toLocaleString()}</p>
                    </div>
                    <div className={`text-lg font-bold ${getScoreColor(item.result.score)}`}>
                       {item.result.score}
                    </div>
                </div>
                <pre className="mt-3 bg-black p-3 rounded text-xs text-gray-400 overflow-hidden h-20 font-mono">
                    <code>{item.code.substring(0, 150)}</code>
                </pre>
            </div>
        </div>
    );
};


interface HomeScreenProps {
  user: User;
  onStartReview: () => void;
  onSelectHistoryItem: (item: ReviewHistoryItem) => void;
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user, onStartReview, onSelectHistoryItem, onNavigateToProfile, onNavigateToSettings }) => {
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const userHistory = await getHistory(user.uid);
      setHistory(userHistory);
      setIsLoading(false);
    }
    fetchHistory();
  }, [user.uid]);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar user={user} onNavigateToProfile={onNavigateToProfile} onNavigateToSettings={onNavigateToSettings} />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Welcome Back, {user.displayName || 'Developer'}</h1>
            <p className="mt-2 text-gray-400">Start a new analysis or review your past activity.</p>
          </div>
          <button 
            onClick={onStartReview} 
            className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Start New Review
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Review History</h2>
          {isLoading ? (
            <p className="text-gray-400">Loading history...</p>
          ) : history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map(item => (
                <HistoryItemCard key={item.id} item={item} onSelect={() => onSelectHistoryItem(item)} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg text-center py-12 px-6">
               <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
              <h3 className="mt-4 text-xl font-semibold text-white">No Reviews Yet</h3>
              <p className="mt-2 text-gray-400">Your completed code reviews will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
