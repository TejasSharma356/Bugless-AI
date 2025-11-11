
import React from 'react';
import { PROGRAMMING_LANGUAGES } from '../constants';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { SparklesIcon } from './icons/SparklesIcon';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  isLoading: boolean;
  onReview: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language, setLanguage, isLoading, onReview }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Code Input</h2>
        <Select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          options={PROGRAMMING_LANGUAGES}
        />
      </div>
      <div className="flex-grow p-1">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-[400px] lg:h-full resize-none bg-black text-gray-300 font-mono text-sm p-4 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Paste your code here..."
          spellCheck="false"
        />
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-800">
        <button 
          onClick={onReview} 
          disabled={isLoading} 
          className="w-full bg-white text-black hover:bg-gray-100 font-medium px-4 py-3 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
             <>
              <SparklesIcon className="h-5 w-5 mr-2" />
              Review Code
            </>
          )}
        </button>
      </div>
    </Card>
  );
};
