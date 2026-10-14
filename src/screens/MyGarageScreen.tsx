import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, H2, Icon, Info, KeyValue, Label, Page, Row, SectionTitle } from '../components/ui.tsx';
import { colors } from '../design/tokens.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { dateLabel, money, vehicleName } from '../utils/format.ts';
import { hasActiveWarranty, warrantyEnd } from '../utils/records.ts';
export function MyGarageScreen() {
  const nav = useNavigation<any>(); const { state } = useDemo(); const vehicle = state.vehicles.find(x => x.id === state.selectedVehicleId) ?? state.vehicles[0]; const records = state.records.filter(x => x.vehicle.id === vehicle.id); const spending = records.reduce((n, r) => n + r.total, 0);
  const withWarranty = records.filter(record => hasActiveWarranty(record));
  const isSampleCorolla = vehicle.manufacturer === 'Toyota' && vehicle.model === 'Corolla';
  return <Page eyebrow="My garage" title="Your car, one clear record." subtitle="Invoices, approvals and reminders for the selected vehicle.">
    <Card dark><Label color="#A2C2FF">SELECTED VEHICLE</Label><Text style={{ color: 'white', fontSize: 23, fontWeight: '800' }}>{vehicleName(vehicle)}</Text><Body style={{ color: '#C5D1E3' }}>{vehicle.year} · {vehicle.mileage.toLocaleString()} km · {vehicle.fuel}</Body><Button title="Manage vehicles" onPress={() => nav.navigate('Vehicle')} variant="secondary" compact/></Card>
    <Row><Card style={{ flex: 1, padding: 14 }}><Label>TOTAL RECORDED</Label><Text style={{ fontSize: 23, color: colors.navy, fontWeight: '900' }}>{money(spending)}</Text><Body style={{ fontSize: 12 }}>{records.length} completed {records.length === 1 ? 'repair' : 'repairs'}</Body></Card><Card style={{ flex: 1, padding: 14 }}><Label>ACTIVE WARRANTY</Label><Text style={{ fontSize: 23, color: colors.navy, fontWeight: '900' }}>{withWarranty.length}</Text><Body style={{ fontSize: 12 }}>sample reminders</Body></Card></Row>
    {state.repair && state.repair.vehicle.id === vehicle.id && <Card><Label>ACTIVE REPAIR</Label><H2>{state.repair.issue}</H2><Body>{state.repair.approved ? `Authorized ${money(state.repair.authorizedTotal)}` : 'Awaiting approval'}</Body><Button title="Track active repair" onPress={() => nav.navigate('Tracking')} variant="secondary"/></Card>}
    <SectionTitle title="Repair history" caption="Completed records appear here with invoice details."/>
    {records.length ? records.map(record => <Card key={record.id}><Row style={{ alignItems: 'center' }}><View style={{ width: 36, height: 36, backgroundColor: colors.blueSoft, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}><Icon name="receipt-outline" size={20}/></View><View style={{ flex: 1 }}><H2>{record.title}</H2><Body>{record.garageName} · {dateLabel(record.completedAt)}</Body></View><Text style={{ color: colors.navy, fontWeight: '800' }}>{money(record.total)}</Text></Row><Button title="View repair & invoice" onPress={() => nav.navigate('Record', { recordId: record.id })} variant="secondary"/></Card>) : <Info>No completed repairs are recorded for this vehicle yet.</Info>}
    <SectionTitle title="Reminders"/>
    <Card><Label>MAINTENANCE</Label><Body>{isSampleCorolla ? 'For the sample Corolla: review routine service around 95,000 km or March 2027. Follow the manufacturer schedule for your actual vehicle.' : 'Check the manufacturer schedule for this vehicle. Add a real service plan when one is available.'}</Body></Card>
    {withWarranty.length === 0 && <Info>No active sample warranty reminders for this vehicle.</Info>}
    {withWarranty.map(record => { const end = warrantyEnd(record)!; return <Card key={record.id}><Label>WARRANTY REMINDER · SAMPLE</Label><H2>{record.title}</H2><Body>{record.garageName} · {record.warrantyMonths} months shown in the demo record</Body><KeyValue label="Example end date" value={dateLabel(end.toISOString())}/></Card>; })}
  </Page>;
}
