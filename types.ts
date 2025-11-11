export interface Issue {
  line: number;
  type: 'Logic' | 'Performance' | 'Readability' | 'Security' | 'Style';
  message: string;
}

export interface AnalysisResult {
  issues: Issue[];
  suggestions: string[];
  score: number;
  editedCode: string;
}

export interface ReviewHistoryItem {
  id: string;
  date: string;
  language: string;
  code: string;
  result: AnalysisResult;
}
