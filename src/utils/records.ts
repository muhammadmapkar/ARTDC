import type { RepairRecord } from '../models/index.ts';

/** Calendar-month expiry for fictional warranty reminders, calculated in UTC. */
export function warrantyEnd(record: RepairRecord): Date | null {
  if (record.warrantyMonths <= 0) return null;
  const completed = new Date(record.completedAt);
  if (Number.isNaN(completed.getTime())) return null;
  const year = completed.getUTCFullYear();
  const month = completed.getUTCMonth() + record.warrantyMonths;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(completed.getUTCDate(), lastDay);
  return new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
}

export function hasActiveWarranty(record: RepairRecord, at: Date = new Date()): boolean {
  const end = warrantyEnd(record);
  return end !== null && at.getTime() <= end.getTime();
}

export function latestRecordForVehicle(records: RepairRecord[], vehicleId: string): RepairRecord | undefined {
  return records
    .filter(record => record.vehicle.id === vehicleId)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
}
