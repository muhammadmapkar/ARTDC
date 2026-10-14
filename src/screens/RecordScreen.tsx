import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Body, Button, Card, Divider, H2, Info, KeyValue, Label, Page, SectionTitle } from '../components/ui.tsx';
import { useDemo } from '../state/DemoProvider.tsx';
import { dateLabel, money, vehicleName } from '../utils/format.ts';
export function RecordScreen() {
  const nav = useNavigation<any>(); const route = useRoute<any>(); const { state } = useDemo(); const record = state.records.find(x => x.id === route.params?.recordId);
  if (!record) return <Page back title="Record unavailable"><Info tone="red">This repair record could not be found.</Info><Button title="View my garage" onPress={() => nav.navigate('Tabs', { screen: 'My Garage' })}/></Page>;
  return <Page back eyebrow="Completed repair" title={record.title} subtitle={`${vehicleName(record.vehicle)} ${record.vehicle.year} · ${dateLabel(record.completedAt)}`}>
    <Info>Fictional invoice and repair notes for classroom demonstration. No real garage issued this document.</Info>
    <Card dark><Label color="#A2C2FF">FINAL RECORDED COST</Label><Body style={{ color: 'white', fontSize: 36, lineHeight: 44, fontWeight: '900' }}>{money(record.total)}</Body><Body style={{ color: '#C5D1E3' }}>{record.garageName}</Body></Card>
    <SectionTitle title="Sample invoice"/><Card>{record.items.map(item => <KeyValue key={item.id} label={item.label} value={money(item.amount)}/>)}<Divider/><KeyValue label="Total" value={money(record.total)} strong/></Card>
    <SectionTitle title="Approval record"/><Card>{record.approvals.length ? record.approvals.map(entry => <Card key={entry.id} style={{ padding: 12 }}><Label>{entry.type.replaceAll('-', ' ').toUpperCase()}</Label><Body>{entry.note}</Body><KeyValue label="Authorized total" value={money(entry.authorizedTotal)}/><Body style={{ fontSize: 12 }}>{new Date(entry.at).toLocaleString()}</Body></Card>) : <Body>No Quote Lock approvals were captured for this sample service.</Body>}</Card>
    <SectionTitle title="Repair notes"/><Card>{record.notes.map((note, i) => <Body key={`${i}-${note}`}>• {note}</Body>)}</Card>
    <Button title="Back to my garage" onPress={() => nav.navigate('Tabs', { screen: 'My Garage' })} variant="secondary"/>
  </Page>;
}
