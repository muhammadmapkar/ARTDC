import type { Vehicle } from '../models/index.ts';
export const money = (value: number) => `AED ${value.toLocaleString('en-US')}`;
export const vehicleName = (vehicle: Vehicle) => `${vehicle.manufacturer} ${vehicle.model}`;
export const dateLabel = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
