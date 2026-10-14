export interface Vehicle { id: string; manufacturer: string; model: string; year: number; mileage: number; fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' }
export type Symptom = 'AC not cooling' | 'Strange engine noise' | 'Brake noise' | 'Warning light' | 'Car not starting' | 'Other issue';
export interface Attachment { name: string; uri?: string; kind: 'photo' | 'video' | 'document' | 'sample' }
export interface ProblemReport { symptom: Symptom; description: string; occurs: string; warningSigns: string[]; followUp: string; attachment?: Attachment }
export interface Cause { title: string; explanation: string }
export interface Guidance { causes: Cause[]; questions: string[]; nextSteps: string[]; safety?: string }
export type RubricKey = 'explanation' | 'parts' | 'labour' | 'warranty' | 'fees' | 'garage';
export interface QuoteItem { id: string; label: string; kind: 'parts' | 'labour' | 'fees'; amount: number; explanation: string }
export interface Quotation { id: string; title: string; issue: string; vehicleLabel: string; garageName: string; garageLocation: string; repairDescription: string; items: QuoteItem[]; completeness: Record<RubricKey, boolean> }
export interface Review { author: string; stars: number; text: string; date: string }
export interface Garage { id: string; name: string; initials: string; location: string; initialEstimate: number; items: QuoteItem[]; rating: number; reviewCount: number; warrantyMonths: number; hours: number; parts: string; specialization: string; jobs: number; transparency: string[]; reviews: Review[] }
export type SortKey = 'price' | 'rating' | 'time' | 'warranty';
export interface Approval { id: string; at: string; type: 'base-approved' | 'additional-requested' | 'additional-approved' | 'additional-declined'; amount: number; authorizedTotal: number; note: string }
export type ExtraDecision = 'not-requested' | 'pending' | 'approved' | 'declined';
export interface Repair { id: string; garageId: string; vehicle: Vehicle; issue: string; baseTotal: number; authorizedTotal: number; approved: boolean; extra: ExtraDecision; stage: number; history: Approval[]; createdAt: string }
export interface RepairRecord { id: string; title: string; vehicle: Vehicle; garageName: string; total: number; completedAt: string; warrantyMonths: number; items: QuoteItem[]; approvals: Approval[]; notes: string[] }
export interface DemoState { version: 1; onboarded: boolean; vehicles: Vehicle[]; selectedVehicleId: string; report: ProblemReport; analyzed: boolean; repair: Repair | null; records: RepairRecord[]; questionsGenerated: boolean }
