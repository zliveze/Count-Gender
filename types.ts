export interface GenderData {
  male: number;
  female: number;
  unknown: number;
  total: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  data: GenderData;
  sourcePreview: string;
}

export enum AnalysisMode {
  SIMPLE = 'SIMPLE', // Local string matching
  SMART = 'SMART',   // AI Gemini analysis
}
