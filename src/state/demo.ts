import { garages, seedRecords, vehicles } from '../data/mock.ts';
import type { DemoState, ProblemReport, Vehicle } from '../models/index.ts';
import { mockRepairWorkflow } from '../services/workflow.ts';
import { isSampleQuoteVehicle } from '../services/quote.ts';
import { hasCompleteProblemReport } from '../utils/report.ts';
export const freshDemo = (): DemoState => ({ version: 1, onboarded: false, vehicles: vehicles.map(x => ({ ...x })), selectedVehicleId: 'corolla', report: { symptom: 'AC not cooling', description: '', occurs: '', warningSigns: [], followUp: '' }, analyzed: false, repair: null, records: seedRecords.map(x => ({ ...x })), questionsGenerated: false });
export type DemoAction =
  | { type: 'HYDRATE'; state: DemoState } | { type: 'ONBOARD' } | { type: 'SELECT_VEHICLE'; id: string } | { type: 'SAVE_VEHICLE'; vehicle: Vehicle }
  | { type: 'REPORT'; report: ProblemReport } | { type: 'ANALYZE' } | { type: 'GENERATE_QUESTIONS' }
  | { type: 'SELECT_GARAGE'; garageId: string; at: string } | { type: 'APPROVE'; at: string }
  | { type: 'REQUEST_EXTRA'; at: string } | { type: 'DECIDE_EXTRA'; approved: boolean; at: string }
  | { type: 'ADVANCE' } | { type: 'COLLECT'; at: string } | { type: 'NEW_JOURNEY' } | { type: 'RESET' };
export function reduceDemo(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'HYDRATE': return action.state;
    case 'ONBOARD': return { ...state, onboarded: true };
    case 'SELECT_VEHICLE': return state.vehicles.some(x => x.id === action.id) ? { ...state, selectedVehicleId: action.id } : state;
    case 'SAVE_VEHICLE': return { ...state, vehicles: state.vehicles.some(x => x.id === action.vehicle.id) ? state.vehicles.map(x => x.id === action.vehicle.id ? action.vehicle : x) : [...state.vehicles, action.vehicle], selectedVehicleId: action.vehicle.id };
    case 'REPORT': return { ...state, report: action.report, analyzed: false, questionsGenerated: false };
    case 'ANALYZE': return { ...state, analyzed: true };
    case 'GENERATE_QUESTIONS': return { ...state, questionsGenerated: true };
    case 'SELECT_GARAGE': {
      if (state.repair?.approved || state.report.symptom !== 'AC not cooling' || !hasCompleteProblemReport(state.report)) return state;
      const selected = garages.find(x => x.id === action.garageId);
      const vehicle = state.vehicles.find(x => x.id === state.selectedVehicleId);
      if (!selected || !vehicle || !isSampleQuoteVehicle(vehicle)) return state;
      return { ...state, repair: mockRepairWorkflow.create(selected, vehicle, state.report.symptom, action.at) };
    }
    case 'APPROVE': return state.repair ? { ...state, repair: mockRepairWorkflow.approve(state.repair, action.at) } : state;
    case 'REQUEST_EXTRA': return state.repair ? { ...state, repair: mockRepairWorkflow.requestExtra(state.repair, action.at) } : state;
    case 'DECIDE_EXTRA': return state.repair ? { ...state, repair: mockRepairWorkflow.decideExtra(state.repair, action.approved, action.at) } : state;
    case 'ADVANCE': return state.repair ? { ...state, repair: mockRepairWorkflow.advance(state.repair) } : state;
    case 'COLLECT': {
      if (!state.repair || state.repair.stage !== 5 || !state.repair.approved || (state.repair.extra === 'not-requested' || state.repair.extra === 'pending')) return state;
      if (state.records.some(x => x.id === state.repair!.id)) return state;
      const record = mockRepairWorkflow.toRecord(state.repair, action.at);
      return { ...state, records: [record, ...state.records], repair: null };
    }
    case 'NEW_JOURNEY': return state.repair?.approved ? state : { ...state, report: freshDemo().report, analyzed: false, repair: null, questionsGenerated: false };
    case 'RESET': return freshDemo();
  }
}
