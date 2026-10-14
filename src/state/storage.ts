import { symptoms } from '../data/mock.ts';
import type { Approval, DemoState, ProblemReport, QuoteItem, Repair, RepairRecord, Vehicle } from '../models/index.ts';

const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string';
const amount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const date = (value: unknown): value is string => text(value) && !Number.isNaN(Date.parse(value));
const textArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(text);

function vehicle(value: unknown): value is Vehicle {
  return object(value) && text(value.id) && value.id.length > 0 &&
    text(value.manufacturer) && text(value.model) &&
    Number.isInteger(value.year) && amount(value.mileage) &&
    ['Petrol', 'Diesel', 'Hybrid', 'Electric'].includes(String(value.fuel));
}

function report(value: unknown): value is ProblemReport {
  return object(value) && symptoms.includes(value.symptom as ProblemReport['symptom']) &&
    text(value.description) && text(value.occurs) && textArray(value.warningSigns) && text(value.followUp) &&
    (value.attachment === undefined || (object(value.attachment) && text(value.attachment.name) &&
      ['photo', 'video', 'document', 'sample'].includes(String(value.attachment.kind)) &&
      (value.attachment.uri === undefined || text(value.attachment.uri))));
}

function quoteItem(value: unknown): value is QuoteItem {
  return object(value) && text(value.id) && text(value.label) &&
    ['parts', 'labour', 'fees'].includes(String(value.kind)) && amount(value.amount) && text(value.explanation);
}

function approval(value: unknown): value is Approval {
  return object(value) && text(value.id) && date(value.at) &&
    ['base-approved', 'additional-requested', 'additional-approved', 'additional-declined'].includes(String(value.type)) &&
    amount(value.amount) && amount(value.authorizedTotal) && text(value.note);
}

function repair(value: unknown): value is Repair {
  return object(value) && text(value.id) && text(value.garageId) && vehicle(value.vehicle) && text(value.issue) &&
    amount(value.baseTotal) && amount(value.authorizedTotal) && typeof value.approved === 'boolean' &&
    ['not-requested', 'pending', 'approved', 'declined'].includes(String(value.extra)) &&
    Number.isInteger(value.stage) && amount(value.stage) && (value.stage as number) <= 5 &&
    Array.isArray(value.history) && value.history.every(approval) && date(value.createdAt);
}

function record(value: unknown): value is RepairRecord {
  return object(value) && text(value.id) && text(value.title) && vehicle(value.vehicle) &&
    text(value.garageName) && amount(value.total) && date(value.completedAt) &&
    Number.isInteger(value.warrantyMonths) && amount(value.warrantyMonths) &&
    Array.isArray(value.items) && value.items.every(quoteItem) &&
    Array.isArray(value.approvals) && value.approvals.every(approval) && textArray(value.notes);
}

/** Rejects incomplete or incompatible local state before any screen reads it. */
export function parseStoredDemo(raw: string): DemoState {
  const value: unknown = JSON.parse(raw);
  if (!object(value) || value.version !== 1 || typeof value.onboarded !== 'boolean' ||
      !Array.isArray(value.vehicles) || value.vehicles.length === 0 || !value.vehicles.every(vehicle) ||
      !text(value.selectedVehicleId) || !value.vehicles.some((item: Vehicle) => item.id === value.selectedVehicleId) ||
      !report(value.report) || typeof value.analyzed !== 'boolean' ||
      (value.repair !== null && !repair(value.repair)) ||
      !Array.isArray(value.records) || !value.records.every(record) ||
      typeof value.questionsGenerated !== 'boolean') {
    throw new Error('Invalid saved demo');
  }
  return value as unknown as DemoState;
}
