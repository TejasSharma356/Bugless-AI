import React, { useRef, useState, useEffect } from 'react';
import type { AnalysisResult, Issue } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { DownloadIcon } from './icons/DownloadIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { BugIcon } from './icons/BugIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

declare const jspdf: any;
declare const html2canvas: any;
declare const Prism: any;

interface ResultPanelProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  language: string;
}

const getScoreColor = (score: number): string => {
  if (score >= 85) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

const IssueItem: React.FC<{ issue: Issue }> = ({ issue }) => {
  const issueTypeMap: Record<Issue['type'], { color: string; className: string }> = {
    Logic: { color: 'red', className: 'border-red-500/20 bg-red-500/10' },
    Performance: { color: 'purple', className: 'border-purple-500/20 bg-purple-500/10' },
    Readability: { color: 'blue', className: 'border-blue-500/20 bg-blue-500/10' },
    Security: { color: 'yellow', className: 'border-yellow-500/20 bg-yellow-500/10' },
    Style: { color: 'gray', className: 'border-gray-500/20 bg-gray-500/10' },
  };
  const typeStyle = issueTypeMap[issue.type] || issueTypeMap['Style'];

  return (
    <div className={`p-4 rounded-lg border ${typeStyle.className} mb-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
           <Badge color={typeStyle.color as any}>{issue.type}</Badge>
           <span className="ml-3 text-sm font-mono text-gray-400">Line: {issue.line}</span>
        </div>
      </div>
      <p className="mt-2 text-gray-300">{issue.message}</p>
    </div>
  );
};


const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const color = getScoreColor(score);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="text-gray-800" strokeWidth="10" fill="transparent" />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${color}`}>
                {score}
            </div>
        </div>
    );
};

export const ResultPanel: React.FC<ResultPanelProps> = ({ result, isLoading, error, language }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'code'>('report');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result && activeTab === 'code' && typeof Prism !== 'undefined') {
      setTimeout(() => Prism.highlightAll(), 0);
    }
  }, [result, activeTab]);

  const handleDownloadPdf = () => {
    if (!reportRef.current || typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') return;

    const { jsPDF } = jspdf;
    
    html2canvas(reportRef.current, { backgroundColor: '#1E1E1E', scale: 2 }).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Bugless-Report.pdf');
    });
  };

  const handleCopyCode = () => {
    if (result?.editedCode) {
      navigator.clipboard.writeText(result.editedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const prismLanguage = language === 'html' ? 'markup' : language;

  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <svg className="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg text-gray-400">Analyzing your code...</p>
        <p className="text-sm text-gray-500">This might take a moment.</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-6">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <BugIcon className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-red-400">Analysis Failed</h3>
        <p className="mt-2 text-gray-400">{error}</p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex flex-col items-center justify-center text-center h-full min-h-[400px] p-6">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">Awaiting Analysis</h3>
        <p className="mt-2 text-gray-400">Enter your code and click "Review Code" to see the AI-powered analysis here.</p>
      </Card>
    );
  }
  
  return (
    <div className="flex flex-col space-y-6">
        <Card>
            <div className="p-6 bg-black" ref={reportRef}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-white">Code Quality Report</h2>
                        <p className={`mt-1 text-lg font-semibold ${getScoreColor(result.score)}`}>Overall Score</p>
                    </div>
                    <ScoreCircle score={result.score} />
                </div>
                
                <div className="mt-8 border-b border-gray-800">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('report')}
                            className={`${activeTab === 'report' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Issues & Suggestions
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`${activeTab === 'code' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Corrected Code
                        </button>
                    </nav>
                </div>
                
                <div className="mt-6 min-h-[300px]">
                    {activeTab === 'report' && (
                        <div>
                            <div>
                                <h3 className="text-lg font-semibold text-white flex items-center"><BugIcon className="h-5 w-5 mr-2 text-cyan-400"/>Identified Issues</h3>
                                <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {result.issues.length > 0 ? (
                                        result.issues.map((issue, index) => <IssueItem key={index} issue={issue} />)
                                    ) : (
                                        <p className="text-gray-400 italic">No issues found. Great job!</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-white flex items-center"><LightBulbIcon className="h-5 w-5 mr-2 text-cyan-400"/>Suggestions</h3>
                                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-300">
                                    {result.suggestions.map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {activeTab === 'code' && (
                        <div className="relative">
                            <Button
                                variant="secondary"
                                className="absolute top-3 right-3 z-10 px-2 py-1 text-xs"
                                onClick={handleCopyCode}
                            >
                                <ClipboardIcon className="h-4 w-4 mr-1.5" />
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                            <pre className={`language-${prismLanguage} rounded-md max-h-96 overflow-auto !bg-black`}>
                                <code className={`language-${prismLanguage} font-mono text-sm`}>
                                    {result.editedCode}
                                </code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 border-t border-gray-800">
                <Button onClick={handleDownloadPdf} variant="secondary" className="w-full">
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Download PDF Report
                </Button>
            </div>
        </Card>
    </div>
  );
};
