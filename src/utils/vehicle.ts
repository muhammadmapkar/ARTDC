import type { Vehicle } from '../models/index.ts';

export type VehicleFormResult = { vehicle: Vehicle; error?: never } | { vehicle?: never; error: string };

export function parseVehicleForm(form: Vehicle, yearText: string, mileageText: string, currentYear = new Date().getFullYear()): VehicleFormResult {
  const maxYear = currentYear + 1;
  const year = Number(yearText);
  const mileage = Number(mileageText.replaceAll(',', ''));
  if (!form.manufacturer.trim() || !form.model.trim() || !yearText.trim() || !mileageText.trim() ||
      !Number.isInteger(year) || year < 1990 || year > maxYear ||
      !Number.isInteger(mileage) || mileage < 0 || mileage > 1_000_000) {
    return { error: `Choose a make and model, and enter a valid year (1990–${maxYear}) and mileage (0–1,000,000 km).` };
  }
  return { vehicle: { ...form, year, mileage } };
}
