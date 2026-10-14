import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { showNotice } from '../utils/feedback.ts';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, Chip, Field, H2, Info, Label, Page, Row, SectionTitle } from '../components/ui.tsx';
import { vehicleModels } from '../data/mock.ts';
import { colors } from '../design/tokens.ts';
import type { Vehicle } from '../models/index.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { vehicleName } from '../utils/format.ts';
import { parseVehicleForm } from '../utils/vehicle.ts';
export function VehicleScreen() {
  const nav = useNavigation<any>(); const { state, dispatch } = useDemo(); const selected = state.vehicles.find(v => v.id === state.selectedVehicleId) ?? state.vehicles[0];
  const [form, setForm] = useState<Vehicle>({ ...selected }); const [year, setYear] = useState(String(selected.year)); const [mileage, setMileage] = useState(String(selected.mileage)); const [error, setError] = useState('');
  const choose = (v: Vehicle) => { dispatch({ type: 'SELECT_VEHICLE', id: v.id }); setForm({ ...v }); setYear(String(v.year)); setMileage(String(v.mileage)); setError(''); };
  const save = (showConfirmation = true): boolean => {
    const result = parseVehicleForm(form, year, mileage);
    if (!result.vehicle) { setError(result.error); return false; }
    dispatch({ type: 'SAVE_VEHICLE', vehicle: result.vehicle });
    setError('');
    if (showConfirmation) showNotice('Vehicle saved', 'Your selected vehicle is now used across the demo.');
    return true;
  };
  return <Page back eyebrow="Your vehicle" title="Make the advice relevant." subtitle="Select a sample vehicle or edit the details below.">
    <SectionTitle title="Sample vehicles"/><View style={{ gap: 9 }}>{state.vehicles.map(v => <Card key={v.id} style={{ padding: 13, borderColor: selected.id === v.id ? colors.blue : colors.line }}><Row style={{ alignItems: 'center' }}><View style={{ flex: 1 }}><Text style={{ color: colors.navy, fontSize: 16, fontWeight: '800' }}>{vehicleName(v)}</Text><Body>{v.year} · {v.mileage.toLocaleString()} km · {v.fuel}</Body></View><Button title={selected.id === v.id ? 'Selected' : 'Select'} onPress={() => choose(v)} variant={selected.id === v.id ? 'secondary' : 'ghost'} compact/></Row></Card>)}</View>
    <Button title="Add another vehicle" icon="add-outline" onPress={() => { const v: Vehicle = { id: `custom-${Date.now()}`, manufacturer: 'Toyota', model: 'Corolla', year: 2022, mileage: 0, fuel: 'Petrol' }; setForm(v); setYear('2022'); setMileage('0'); setError(''); }} variant="ghost"/>
    <SectionTitle title={form.id.startsWith('custom-') ? 'Add a vehicle' : 'Edit selected vehicle'}/>
    <Label>MANUFACTURER</Label><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{Object.keys(vehicleModels).map(make => <Chip key={make} title={make} selected={form.manufacturer === make} onPress={() => setForm({ ...form, manufacturer: make, model: vehicleModels[make][0] })}/>)}</View>
    <Label>MODEL</Label><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{(vehicleModels[form.manufacturer] ?? vehicleModels.Other).map(model => <Chip key={model} title={model} selected={form.model === model} onPress={() => setForm({ ...form, model })}/>)}</View>
    <Field label="Year" value={year} onChangeText={setYear} keyboardType="number-pad" placeholder="2022"/><Field label="Mileage (km)" value={mileage} onChangeText={setMileage} keyboardType="number-pad" placeholder="85000"/>
    <Label>FUEL TYPE</Label><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{(['Petrol','Diesel','Hybrid','Electric'] as const).map(fuel => <Chip key={fuel} title={fuel} selected={form.fuel === fuel} onPress={() => setForm({ ...form, fuel })}/>)}</View>
    {error ? <Info tone="red">{error}</Info> : null}<Button title="Save vehicle" onPress={() => save()} icon="checkmark-outline"/>
    <Button title="Continue to report a problem" onPress={() => { if (save(false)) nav.navigate('Report'); }} variant="secondary" icon="arrow-forward"/>
    {state.repair?.approved ? <Info>Changing the selected vehicle does not alter an existing repair authorization. Its vehicle details are saved with that record.</Info> : null}
  </Page>;
}
