import { garages } from '../data/mock.ts';
import type { Garage, SortKey } from '../models/index.ts';
export interface GarageComparisonService { list(sort: SortKey): Garage[] }
export const totalForGarage = (garage: Garage) => garage.items.reduce((n, item) => n + item.amount, 0);
export const mockGarageService: GarageComparisonService = {
  list(sort) {
    const output = [...garages];
    const compare: Record<SortKey, (a: Garage, b: Garage) => number> = {
      price: (a,b) => totalForGarage(a) - totalForGarage(b), rating: (a,b) => b.rating - a.rating,
      time: (a,b) => a.hours - b.hours, warranty: (a,b) => b.warrantyMonths - a.warrantyMonths,
    };
    return output.sort((a,b) => compare[sort](a,b) || a.name.localeCompare(b.name));
  },
};
