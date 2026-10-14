import type { Garage, ProblemReport, Quotation, RepairRecord, Symptom, Vehicle } from '../models/index.ts';
export const sampleUser = { name: 'Alex', location: 'Dubai', role: 'Guest demo' };
export const vehicles: Vehicle[] = [
  { id: 'corolla', manufacturer: 'Toyota', model: 'Corolla', year: 2022, mileage: 85000, fuel: 'Petrol' },
  { id: 'civic', manufacturer: 'Honda', model: 'Civic', year: 2021, mileage: 62000, fuel: 'Petrol' },
  { id: 'altima', manufacturer: 'Nissan', model: 'Altima', year: 2023, mileage: 34000, fuel: 'Petrol' },
];
export const vehicleModels: Record<string, string[]> = { Toyota: ['Corolla', 'Camry', 'RAV4'], Honda: ['Civic', 'Accord', 'CR-V'], Nissan: ['Altima', 'Sunny', 'Patrol'], Hyundai: ['Elantra', 'Tucson', 'Sonata'], Kia: ['Sportage', 'Cerato', 'Sorento'], Other: ['Other model'] };
export const symptoms: Symptom[] = ['AC not cooling', 'Strange engine noise', 'Brake noise', 'Warning light', 'Car not starting', 'Other issue'];
export const sampleReport: ProblemReport = { symptom: 'AC not cooling', description: 'The AC blows warm air even with the temperature set to cold. Air still comes through the vents.', occurs: 'All the time', warningSigns: [], followUp: 'Yes, airflow feels normal' };
export const followUps: Record<Symptom, { question: string; options: string[] }> = {
  'AC not cooling': { question: 'Is air still coming through the vents?', options: ['Yes, airflow feels normal', 'Airflow is weak', 'No air comes through'] },
  'Strange engine noise': { question: 'When does the sound happen?', options: ['While accelerating', 'While braking', 'While turning', 'At idle'] },
  'Brake noise': { question: 'Does the brake pedal feel different?', options: ['Pedal feels normal', 'Pedal feels soft', 'Braking feels weaker'] },
  'Warning light': { question: 'Is the warning light steady or flashing?', options: ['Steady', 'Flashing', 'Not sure'] },
  'Car not starting': { question: 'What happens when you try to start?', options: ['Clicking sound', 'Engine turns but does not start', 'Nothing happens'] },
  'Other issue': { question: 'Does this affect steering, braking or visibility?', options: ['Yes', 'No', 'Not sure'] },
};
const quoteItems = (parts: number, labour: number) => [
  { id: 'compressor', label: 'AC compressor', kind: 'parts' as const, amount: parts, explanation: 'The pump that circulates cooling fluid in the air conditioning system. A mechanic should test it before recommending replacement.' },
  { id: 'labour', label: 'Replacement labour', kind: 'labour' as const, amount: labour, explanation: 'The work to remove the old component, fit the replacement and check operation.' },
  { id: 'inspection', label: 'Inspection', kind: 'fees' as const, amount: 100, explanation: 'A separate charge for checking the AC system. Ask what tests are included and whether this fee is credited toward repairs.' },
];
export const sampleQuote: Quotation = { id: 'sample-ac', title: 'AC compressor replacement', issue: 'AC not cooling', vehicleLabel: 'Toyota Corolla 2022', garageName: 'Cedar Motor Lab', garageLocation: 'Ras Al Khor, Dubai', repairDescription: 'Proposed work: replace the AC compressor and test the cooling system afterward. This quote describes the work but does not include a test result proving the compressor has failed.', items: quoteItems(750, 250), completeness: { explanation: true, parts: false, labour: true, warranty: false, fees: true, garage: true } };
export const garages: Garage[] = [
  { id: 'dune', name: 'Dune Auto Care', initials: 'DA', location: 'Al Quoz, Dubai', initialEstimate: 800, items: quoteItems(550, 200), rating: 4.6, reviewCount: 84, warrantyMonths: 1, hours: 8, parts: 'Aftermarket', specialization: 'AC & Japanese vehicles', jobs: 340, transparency: ['Parts and labour separated', 'Fees included in demo quotation', 'Part brand to be confirmed'], reviews: [{ author: 'Sam K. · sample', stars: 5, text: 'They explained the work before asking me to approve.', date: '04 Oct 2026' }, { author: 'Noor A. · sample', stars: 4, text: 'Quick turnaround. I asked for the warranty in writing.', date: '21 Sep 2026' }] },
  { id: 'cedar', name: 'Cedar Motor Lab', initials: 'CM', location: 'Ras Al Khor, Dubai', initialEstimate: 1000, items: quoteItems(750, 250), rating: 4.9, reviewCount: 126, warrantyMonths: 6, hours: 24, parts: 'Original · demo claim', specialization: 'Toyota & AC systems', jobs: 580, transparency: ['Original part category stated', 'Parts and labour separated', 'Six-month written warranty offered'], reviews: [{ author: 'Maya R. · sample', stars: 5, text: 'Clear breakdown and a detailed handover checklist.', date: '07 Oct 2026' }, { author: 'Omar L. · sample', stars: 5, text: 'The warranty terms were easy to understand.', date: '27 Sep 2026' }] },
  { id: 'harbour', name: 'Harbour Auto Studio', initials: 'HA', location: 'Al Quoz, Dubai', initialEstimate: 850, items: quoteItems(650, 200), rating: 4.8, reviewCount: 98, warrantyMonths: 3, hours: 12, parts: 'Aftermarket', specialization: 'AC & everyday maintenance', jobs: 425, transparency: ['Parts and labour separated', 'All demo fees disclosed', 'Three-month written warranty offered'], reviews: [{ author: 'Leila M. · sample', stars: 5, text: 'I could review every cost before the work began.', date: '08 Oct 2026' }, { author: 'Ryan J. · sample', stars: 4, text: 'Helpful updates and clear collection notes.', date: '24 Sep 2026' }] },
];
export const additionalWork = { amount: 300, title: 'Replace damaged AC hose', reason: 'A damaged hose was identified during the simulated inspection. Ask for the test result and whether base repairs can be completed safely without it.', items: [
  { id: 'hose', label: 'Replacement AC hose', kind: 'parts' as const, amount: 220, explanation: 'A hose carries cooling fluid between AC components.' },
  { id: 'hose-labour', label: 'Hose fitting labour', kind: 'labour' as const, amount: 80, explanation: 'Work to fit and check the replacement hose.' },
] };
export const repairStages = ['Vehicle received', 'Inspection completed', 'Quote approved', 'Repair in progress', 'Repair completed', 'Ready for collection'];
export const timelineNotes = ['Vehicle checked in. Customer concern recorded.', 'AC inspection recorded. Supporting notes available.', 'Customer authorization recorded locally.', 'Only authorized work is included in this demonstration.', 'Authorized work marked complete; checks recorded in sample notes.', 'Demo invoice and repair record ready to review.'];
export const seedRecords: RepairRecord[] = [{ id: 'service-2026', title: 'Routine oil & filter service', vehicle: vehicles[0], garageName: 'Harbour Auto Studio', total: 320, completedAt: '2026-09-08T10:00:00.000Z', warrantyMonths: 0, items: [{ id: 'oil', label: 'Engine oil & filter', kind: 'parts', amount: 220, explanation: 'Fresh oil and filter for routine maintenance.' }, { id: 'service-labour', label: 'Service labour', kind: 'labour', amount: 100, explanation: 'Work to change the oil and filter.' }], approvals: [], notes: ['Fictional completed repair for classroom exploration.', 'Next routine service: 95,000 km or March 2027; check the vehicle manual.'] }];
