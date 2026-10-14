import { additionalWork, garages, repairStages, timelineNotes } from '../data/mock.ts';
import type { Approval, Garage, Repair, RepairRecord, Vehicle } from '../models/index.ts';
import { totalForGarage } from './garages.ts';
const event = (repair: Repair, type: Approval['type'], amount: number, authorizedTotal: number, note: string, at: string): Approval => ({ id: `${type}-${repair.history.length + 1}`, at, type, amount, authorizedTotal, note });
export interface RepairWorkflowService {
  create(garage: Garage, vehicle: Vehicle, issue: string, at: string): Repair;
  approve(repair: Repair, at: string): Repair;
  requestExtra(repair: Repair, at: string): Repair;
  decideExtra(repair: Repair, approved: boolean, at: string): Repair;
  advance(repair: Repair): Repair;
  toRecord(repair: Repair, at: string): RepairRecord;
}
export const mockRepairWorkflow: RepairWorkflowService = {
  create(garage, vehicle, issue, at) {
    const baseTotal = totalForGarage(garage);
    return { id: `demo-${garage.id}-${at}`, garageId: garage.id, vehicle: { ...vehicle }, issue, baseTotal, authorizedTotal: 0, approved: false, extra: 'not-requested', stage: 1, history: [], createdAt: at };
  },
  approve(repair, at) {
    if (repair.approved) return repair;
    const entry = event(repair, 'base-approved', repair.baseTotal, repair.baseTotal, 'Confirmed quotation approved by customer in demo.', at);
    return { ...repair, approved: true, authorizedTotal: repair.baseTotal, stage: 2, history: [...repair.history, entry] };
  },
  requestExtra(repair, at) {
    if (!repair.approved || repair.extra !== 'not-requested') return repair;
    const entry = event(repair, 'additional-requested', additionalWork.amount, repair.authorizedTotal, additionalWork.reason, at);
    return { ...repair, extra: 'pending', history: [...repair.history, entry] };
  },
  decideExtra(repair, approved, at) {
    if (repair.extra !== 'pending') return repair;
    const authorizedTotal = repair.baseTotal + (approved ? additionalWork.amount : 0);
    const entry = event(repair, approved ? 'additional-approved' : 'additional-declined', additionalWork.amount, authorizedTotal, approved ? 'Customer approved the added hose repair.' : 'Customer declined added work. Base authorization remains.', at);
    return { ...repair, extra: approved ? 'approved' : 'declined', authorizedTotal, history: [...repair.history, entry] };
  },
  advance(repair) {
    if (!repair.approved || repair.extra === 'not-requested' || repair.extra === 'pending') return repair;
    return { ...repair, stage: Math.min(repairStages.length - 1, repair.stage + 1) };
  },
  toRecord(repair, at) {
    if (!repair.approved || repair.extra === 'not-requested' || repair.extra === 'pending' || repair.stage !== repairStages.length - 1) throw new Error('Complete the authorized workflow before collection.');
    const garage = garages.find(x => x.id === repair.garageId);
    if (!garage) throw new Error('Garage not found.');
    return { id: repair.id, title: repair.issue === 'AC not cooling' ? 'Air conditioning repair' : repair.issue, vehicle: repair.vehicle, garageName: garage.name, total: repair.authorizedTotal, completedAt: at, warrantyMonths: garage.warrantyMonths, items: [...garage.items, ...(repair.extra === 'approved' ? additionalWork.items : [])], approvals: repair.history, notes: timelineNotes.slice(0, repair.stage + 1) };
  },
};
export const getGarage = (id: string) => garages.find(x => x.id === id);
