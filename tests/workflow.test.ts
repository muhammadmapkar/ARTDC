import test from 'node:test';
import assert from 'node:assert/strict';
import { garages, sampleQuote, sampleReport, vehicles } from '../src/data/mock.ts';
import { mockGarageService, totalForGarage } from '../src/services/garages.ts';
import { analyzeQuote, rubric } from '../src/services/quote.ts';
import { mockRepairWorkflow } from '../src/services/workflow.ts';
import { freshDemo, reduceDemo } from '../src/state/demo.ts';

const at = '2026-10-12T10:00:00.000Z';
const readyDemo = () => ({ ...freshDemo(), report: { ...sampleReport } });
test('sample quote totals and documented completeness score', () => {
  const result = analyzeQuote(sampleQuote);
  assert.equal(result.parts, 750); assert.equal(result.labour, 250); assert.equal(result.fees, 100);
  assert.equal(result.total, 1100); assert.equal(result.score, 65);
  assert.equal(rubric.reduce((n, item) => n + item.points, 0), 100);
  assert.equal(result.missing.length, 2);
  assert.match(result.quote.repairDescription, /does not include a test result/i);
  assert.ok(result.concerns.some(concern => /diagnostic test result/i.test(concern)));
});
test('garage totals and four deterministic sort modes', () => {
  assert.deepEqual(garages.map(totalForGarage), [850, 1100, 950]);
  assert.deepEqual(mockGarageService.list('price').map(x => x.id), ['dune', 'harbour', 'cedar']);
  assert.deepEqual(mockGarageService.list('rating').map(x => x.id), ['cedar', 'harbour', 'dune']);
  assert.deepEqual(mockGarageService.list('time').map(x => x.id), ['dune', 'harbour', 'cedar']);
  assert.deepEqual(mockGarageService.list('warranty').map(x => x.id), ['cedar', 'harbour', 'dune']);
});
test('approved additional work raises authorized total and invoice items', () => {
  const garage = garages[2]; let repair = mockRepairWorkflow.create(garage, vehicles[0], 'AC not cooling', at);
  assert.equal(repair.authorizedTotal, 0); assert.equal(repair.baseTotal, 950);
  repair = mockRepairWorkflow.approve(repair, at); assert.equal(repair.authorizedTotal, 950);
  repair = mockRepairWorkflow.requestExtra(repair, at); assert.equal(repair.authorizedTotal, 950);
  repair = mockRepairWorkflow.decideExtra(repair, true, at); assert.equal(repair.authorizedTotal, 1250);
  repair = mockRepairWorkflow.advance(mockRepairWorkflow.advance(mockRepairWorkflow.advance(repair)));
  assert.equal(repair.stage, 5);
  const record = mockRepairWorkflow.toRecord(repair, at);
  assert.equal(record.items.reduce((n, x) => n + x.amount, 0), record.total);
  assert.equal(record.approvals.length, 3);
});
test('decline preserves authorization and excludes extra items', () => {
  let repair = mockRepairWorkflow.approve(mockRepairWorkflow.create(garages[2], vehicles[0], 'AC not cooling', at), at);
  repair = mockRepairWorkflow.requestExtra(repair, at);
  assert.equal(mockRepairWorkflow.advance(repair).stage, 2);
  repair = mockRepairWorkflow.decideExtra(repair, false, at);
  assert.equal(repair.authorizedTotal, 950);
  assert.equal(repair.history.at(-1)?.type, 'additional-declined');
  repair = mockRepairWorkflow.advance(mockRepairWorkflow.advance(mockRepairWorkflow.advance(repair)));
  assert.equal(mockRepairWorkflow.toRecord(repair, at).items.length, 3);
});
test('collection is idempotent, persists record in state, and reset restores demo', () => {
  let state = readyDemo();
  state = reduceDemo(state, { type: 'SELECT_GARAGE', garageId: 'harbour', at });
  state = reduceDemo(state, { type: 'APPROVE', at });
  state = reduceDemo(state, { type: 'REQUEST_EXTRA', at });
  state = reduceDemo(state, { type: 'DECIDE_EXTRA', approved: false, at });
  for (let i = 0; i < 3; i++) state = reduceDemo(state, { type: 'ADVANCE' });
  state = reduceDemo(state, { type: 'COLLECT', at });
  assert.equal(state.records.length, 2); assert.equal(state.records[0].total, 950); assert.equal(state.repair, null);
  state = reduceDemo(state, { type: 'COLLECT', at }); assert.equal(state.records.length, 2);
  state = reduceDemo(state, { type: 'RESET' }); assert.equal(state.records.length, 1); assert.equal(state.onboarded, false);
});
test('AC quotation cannot become an authorization for another symptom', () => {
  const state = { ...readyDemo(), report: { ...sampleReport, symptom: 'Brake noise' as const } };
  const next = reduceDemo(state, { type: 'SELECT_GARAGE', garageId: 'harbour', at });
  assert.equal(next.repair, null);
});

test('reported warning signs prompt stopping safely across symptom types', async () => {
  const { mockDiagnosticService } = await import('../src/services/diagnostic.ts');
  const report = {
    ...freshDemo().report,
    symptom: 'AC not cooling' as const,
    warningSigns: ['Smoke or burning smell'],
  };
  const result = await mockDiagnosticService.assess(report);
  assert.match(result.safety ?? '', /Stop driving when it is safe/i);
  const ordinary = await mockDiagnosticService.assess({ ...report, warningSigns: [] });
  assert.equal(ordinary.safety, undefined);
});

test('mock mechanic message asks about missing sample quote fields', async () => {
  const { mockQuoteService } = await import('../src/services/quote.ts');
  const analysis = await mockQuoteService.analyzeSample();
  const message = mockQuoteService.mechanicMessage(analysis);
  assert.match(message, /original or aftermarket/i);
  assert.match(message, /written warranty/i);
  assert.match(message, /approval before any additional work/i);
});

test('warranty reminders expire and recent activity follows the selected vehicle', async () => {
  const { hasActiveWarranty, latestRecordForVehicle, warrantyEnd } = await import('../src/utils/records.ts');
  const base = freshDemo().records[0];
  const monthEnd = { ...base, completedAt: '2026-01-31T10:00:00.000Z', warrantyMonths: 1 };
  assert.equal(warrantyEnd(monthEnd)?.toISOString(), '2026-02-28T23:59:59.999Z');
  assert.equal(hasActiveWarranty(monthEnd, new Date('2026-02-28T12:00:00.000Z')), true);
  assert.equal(hasActiveWarranty(monthEnd, new Date('2026-03-01T00:00:00.000Z')), false);
  const civicRecord = { ...base, id: 'civic-record', vehicle: vehicles[1], completedAt: '2026-10-20T10:00:00.000Z' };
  assert.equal(latestRecordForVehicle([base, civicRecord], vehicles[0].id)?.id, base.id);
  assert.equal(latestRecordForVehicle([base, civicRecord], vehicles[1].id)?.id, civicRecord.id);
});

test('vehicle form requires year and mileage before continuing', async () => {
  const { parseVehicleForm } = await import('../src/utils/vehicle.ts');
  const vehicle = vehicles[0];
  assert.ok(parseVehicleForm(vehicle, '', '85000', 2026).error);
  assert.ok(parseVehicleForm(vehicle, '2022', '', 2026).error);
  assert.ok(parseVehicleForm(vehicle, '2028', '85000', 2026).error);
  assert.ok(parseVehicleForm(vehicle, '2022', '-1', 2026).error);
  const valid = parseVehicleForm(vehicle, '2022', '85,000', 2026);
  assert.equal(valid.vehicle?.mileage, 85000);
});

test('saved demo restores approved choices and rejects incomplete state', async () => {
  const { parseStoredDemo } = await import('../src/state/storage.ts');
  let state = reduceDemo(readyDemo(), { type: 'SELECT_GARAGE', garageId: 'harbour', at });
  state = reduceDemo(state, { type: 'APPROVE', at });
  state = reduceDemo(state, { type: 'REQUEST_EXTRA', at });
  state = reduceDemo(state, { type: 'DECIDE_EXTRA', approved: true, at });
  assert.deepEqual(parseStoredDemo(JSON.stringify(state)), state);
  assert.throws(() => parseStoredDemo(JSON.stringify({ ...state, vehicles: [] })));
  assert.throws(() => parseStoredDemo(JSON.stringify({ ...state, selectedVehicleId: 'missing' })));
  assert.throws(() => parseStoredDemo(JSON.stringify({ ...state, report: null })));
  assert.throws(() => parseStoredDemo(JSON.stringify({ ...state, repair: { ...state.repair, stage: 20 } })));
});

test('fixed Corolla quotes cannot be relabelled or approved for another vehicle', async () => {
  const { isSampleQuoteVehicle, mockQuoteService } = await import('../src/services/quote.ts');
  const analysis = await mockQuoteService.analyzeSample();
  assert.equal(analysis.quote.vehicleLabel, sampleQuote.vehicleLabel);
  assert.equal(isSampleQuoteVehicle(vehicles[0]), true);
  assert.equal(isSampleQuoteVehicle(vehicles[1]), false);
  assert.equal(isSampleQuoteVehicle({ ...vehicles[0], year: 2023 }), false);
  let state = reduceDemo(readyDemo(), { type: 'SELECT_VEHICLE', id: vehicles[1].id });
  state = reduceDemo(state, { type: 'SELECT_GARAGE', garageId: 'harbour', at });
  assert.equal(state.repair, null);
});

test('classroom repair cannot progress before the additional-work decision', () => {
  let repair = mockRepairWorkflow.create(garages[2], vehicles[0], 'AC not cooling', at);
  repair = mockRepairWorkflow.approve(repair, at);
  assert.equal(repair.stage, 2);
  assert.equal(mockRepairWorkflow.advance(repair).stage, 2);
  assert.throws(() => mockRepairWorkflow.toRecord({ ...repair, stage: 5 }, at));
  let state = reduceDemo(readyDemo(), { type: 'SELECT_GARAGE', garageId: 'harbour', at });
  state = reduceDemo(state, { type: 'APPROVE', at });
  state = reduceDemo(state, { type: 'ADVANCE' });
  assert.equal(state.repair?.stage, 2);
  state = reduceDemo(state, { type: 'COLLECT', at });
  assert.equal(state.records.length, 1);
  assert.ok(state.repair);
});

test('picker result normalization handles cancellation and selected files', async () => {
  const { documentAttachment, mediaAttachment } = await import('../src/services/attachments.ts');
  assert.equal(mediaAttachment({ canceled: true, assets: null }), null);
  assert.equal(documentAttachment({ canceled: true, assets: null }), null);
  assert.deepEqual(mediaAttachment({ canceled: false, assets: [{ uri: 'file:///demo/ac.mov', fileName: 'ac.mov', type: 'video' }] }), {
    name: 'ac.mov', uri: 'file:///demo/ac.mov', kind: 'video',
  });
  assert.deepEqual(mediaAttachment({ canceled: false, assets: [{ uri: 'file:///demo/vent.jpg', type: 'image' }] }), {
    name: 'vent.jpg', uri: 'file:///demo/vent.jpg', kind: 'photo',
  });
  assert.deepEqual(documentAttachment({ canceled: false, assets: [{ uri: 'file:///demo/quote.pdf', name: 'quote.pdf' }] }), {
    name: 'quote.pdf', uri: 'file:///demo/quote.pdf', kind: 'document',
  });
});

test('garage approval requires a completed problem report', async () => {
  const { hasCompleteProblemReport } = await import('../src/utils/report.ts');
  assert.equal(hasCompleteProblemReport(freshDemo().report), false);
  assert.equal(hasCompleteProblemReport(sampleReport), true);
  const withoutReport = reduceDemo(freshDemo(), { type: 'SELECT_GARAGE', garageId: 'harbour', at });
  assert.equal(withoutReport.repair, null);
  const incomplete = { ...readyDemo(), report: { ...sampleReport, followUp: '' } };
  assert.equal(reduceDemo(incomplete, { type: 'SELECT_GARAGE', garageId: 'harbour', at }).repair, null);
  assert.ok(reduceDemo(readyDemo(), { type: 'SELECT_GARAGE', garageId: 'harbour', at }).repair);
});
