import React, { useState, useCallback, useEffect } from 'react';
import { User } from 'firebase/auth';
import { CodeEditor } from './CodeEditor';
import { Navbar } from './Navbar';
import { ResultPanel } from './ResultPanel';
import { analyzeCode } from '../services/geminiService';
import { saveToHistory } from '../services/historyService';
import type { AnalysisResult, ReviewHistoryItem } from '../types';
import { PROGRAMMING_LANGUAGES } from '../constants';
import { Button } from './ui/Button';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface CodeReviewAppProps {
    user: User;
    onNavigateHome: () => void;
    initialState?: ReviewHistoryItem | null;
    onNavigateToProfile?: () => void;
    onNavigateToSettings?: () => void;
}

export const CodeReviewApp: React.FC<CodeReviewAppProps> = ({ user, onNavigateHome, initialState, onNavigateToProfile, onNavigateToSettings }) => {
    const [reviewId, setReviewId] = useState<string | null>(null);
    const [code, setCode] = useState<string>('function greet(name) {\n  console.log("Hello, " + name);\n}');
    const [language, setLanguage] = useState<string>(PROGRAMMING_LANGUAGES[0].value);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialState) {
            setReviewId(initialState.id);
            setCode(initialState.code);
            setLanguage(initialState.language);
            setResult(initialState.result);
            setError(null);
            setIsLoading(false);
        } else {
            // Reset for a new review
            setReviewId(new Date().toISOString()); // Create a new ID for this session
            setCode('function greet(name) {\n  console.log("Hello, " + name);\n}');
            setLanguage(PROGRAMMING_LANGUAGES[0].value);
            setResult(null);
            setError(null);
            setIsLoading(false);
        }
    }, [initialState]);

    const handleReviewCode = useCallback(async () => {
        if (!code.trim()) {
            setError("Code cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const analysisResult = await analyzeCode(language, code);
            setResult(analysisResult);
            
            const newHistoryItem: ReviewHistoryItem = {
              id: reviewId || new Date().toISOString(),
              date: new Date().toISOString(),
              language,
              code,
              result: analysisResult,
            };
            await saveToHistory(user.uid, newHistoryItem);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    }, [code, language, reviewId, user.uid]);

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar user={user} onNavigateToProfile={onNavigateToProfile} onNavigateToSettings={onNavigateToSettings} />
            <main className="px-6 lg:px-12 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button 
                            onClick={onNavigateHome}
                            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeftIcon className="h-5 w-5 mr-2" />
                            Back to Home
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            language={language}
                            setLanguage={setLanguage}
                            isLoading={isLoading}
                            onReview={handleReviewCode}
                        />
                        <ResultPanel result={result} isLoading={isLoading} error={error} language={language} />
                    </div>
                </div>
            </main>
        </div>
    );
};
