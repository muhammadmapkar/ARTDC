import { sampleQuote } from '../data/mock.ts';
import type { Quotation, RubricKey, Vehicle } from '../models/index.ts';

export const rubric: { key: RubricKey; label: string; points: number; missing: string }[] = [
  { key: 'explanation', label: 'Repair clearly explained', points: 20, missing: 'The reason for this repair is not explained.' },
  { key: 'parts', label: 'Parts specified', points: 15, missing: 'The quote does not state whether the replacement part is original or aftermarket.' },
  { key: 'labour', label: 'Labour itemized', points: 20, missing: 'Labour is not shown as a separate charge.' },
  { key: 'warranty', label: 'Warranty mentioned', points: 20, missing: 'The warranty terms are missing.' },
  { key: 'fees', label: 'Additional charges disclosed', points: 10, missing: 'Additional fees or exclusions are not disclosed.' },
  { key: 'garage', label: 'Garage details provided', points: 15, missing: 'Garage contact details are missing.' },
];

export interface QuoteAnalysis {
  quote: Quotation;
  total: number;
  parts: number;
  labour: number;
  fees: number;
  score: number;
  missing: string[];
  questions: string[];
  concerns: string[];
}

export interface QuoteAnalysisService {
  analyzeSample(): Promise<QuoteAnalysis>;
  mechanicMessage(analysis: QuoteAnalysis): string;
}

/** Deterministic demonstration analysis of structured sample data, never an uploaded file. */
export function analyzeQuote(quote: Quotation): QuoteAnalysis {
  const sum = (kind: 'parts' | 'labour' | 'fees') => quote.items
    .filter(item => item.kind === kind)
    .reduce((total, item) => total + item.amount, 0);
  const parts = sum('parts');
  const labour = sum('labour');
  const fees = sum('fees');
  const missing = rubric.filter(item => !quote.completeness[item.key]).map(item => item.missing);
  const questions: string[] = [];
  if (!quote.completeness.parts) questions.push('Could you confirm whether the replacement part is original or aftermarket and state its brand?');
  if (!quote.completeness.warranty) questions.push('What written warranty covers the part and labour?');
  if (!quote.completeness.explanation) questions.push('What test result supports the proposed repair?');
  if (!quote.completeness.labour) questions.push('Could you separate the labour charge from the parts charge?');
  if (!quote.completeness.fees) questions.push('Are there any additional fees or exclusions?');
  if (!quote.completeness.garage) questions.push('Could you provide the garage name and contact details on the quotation?');
  questions.push('What test result supports replacing the AC compressor?');
  questions.push('Will you ask for my approval before any additional work?');
  return {
    quote, parts, labour, fees, total: parts + labour + fees,
    score: rubric.reduce((total, item) => total + (quote.completeness[item.key] ? item.points : 0), 0),
    missing, questions,
    concerns: [
      'Part category and warranty need clarification before approval.',
      'Ask for the diagnostic test result before accepting compressor replacement.',
      'The listed amount alone does not show whether a price is fair or inflated.',
    ],
  };
}

/** Fixed examples must never be relabelled as a quotation for another vehicle. */
export const isSampleQuoteVehicle = (vehicle: Vehicle): boolean =>
  `${vehicle.manufacturer} ${vehicle.model} ${vehicle.year}` === sampleQuote.vehicleLabel;

export const mockQuoteService: QuoteAnalysisService = {
  async analyzeSample() {
    return analyzeQuote(sampleQuote);
  },
  mechanicMessage(analysis) {
    return `Hello, ${analysis.questions.join(' ')} Thank you.`;
  },
};
