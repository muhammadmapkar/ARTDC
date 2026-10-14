import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActionCard, Body, Button, Card, H2, Icon, Info, KeyValue, Label, Page, Row, SectionTitle } from '../components/ui.tsx';
import { colors } from '../design/tokens.ts';
import { sampleUser } from '../data/mock.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { getGarage } from '../services/workflow.ts';
import { money, vehicleName } from '../utils/format.ts';
import { latestRecordForVehicle } from '../utils/records.ts';
export function HomeScreen() {
  const nav = useNavigation<any>(); const { state } = useDemo(); const vehicle = state.vehicles.find(x => x.id === state.selectedVehicleId) ?? state.vehicles[0]; const garage = state.repair && getGarage(state.repair.garageId); const recentRecord = latestRecordForVehicle(state.records, vehicle.id);
  return <Page eyebrow="Your repair companion" title={`Good day, ${sampleUser.name}.`} subtitle="A clearer decision starts here.">
    <Card dark><Row style={{ alignItems: 'center' }}><View style={{ flex: 1 }}><Label color="#9FC0FF">SELECTED VEHICLE</Label><Text style={{ color: colors.white, fontSize: 23, fontWeight: '800' }}>{vehicleName(vehicle)}</Text><Text style={{ color: '#B9C6D9', marginTop: 5 }}>{vehicle.year} · {vehicle.mileage.toLocaleString()} km · {vehicle.fuel}</Text></View><Icon name="car-sport-outline" color="#9FC0FF" size={45}/></Row><Button title="Change or edit vehicle" onPress={() => nav.navigate('Vehicle')} variant="secondary" compact/></Card>
    <SectionTitle title="What would you like to do?"/><ActionCard title="Diagnose a problem" description="Describe symptoms and get preliminary guidance" icon="pulse-outline" onPress={() => nav.navigate('Report')}/><ActionCard title="Analyze a repair quote" description="Understand costs and missing details" icon="document-text-outline" onPress={() => nav.navigate('Quote')}/><ActionCard title="Compare garages" description="Review scope, parts, warranty and timing" icon="git-compare-outline" onPress={() => nav.navigate('Tabs', { screen: 'Garages' })}/><ActionCard title="Track my repair" description="See approvals and progress updates" icon="time-outline" onPress={() => nav.navigate('Tracking')}/>
    <SectionTitle title="Current repair"/>
    {state.repair ? <Card><Row style={{ alignItems: 'center' }}><View style={{ flex: 1 }}><Label>{state.repair.approved ? 'AUTHORIZATION RECORDED' : 'AWAITING YOUR APPROVAL'}</Label><H2>{state.repair.issue}</H2><Body>{garage?.name} · {vehicleName(state.repair.vehicle)}</Body></View><Icon name="shield-checkmark-outline" size={28}/></Row><KeyValue label="Authorized total" value={state.repair.approved ? money(state.repair.authorizedTotal) : 'None yet'}/><Button title={state.repair.approved ? 'View repair progress' : 'Review Quote Lock'} onPress={() => nav.navigate(state.repair?.approved ? 'Tracking' : 'QuoteLock')} variant="secondary"/></Card> : <Info>Begin the AC sample journey to create a repair authorization record.</Info>}
    <SectionTitle title="Recent activity"/><Card><H2>{recentRecord?.title ?? 'No completed repairs yet'}</H2><Body>{recentRecord ? `${recentRecord.garageName} · ${money(recentRecord.total)}` : 'Your completed repair history will appear here.'}</Body><Button title="View my garage" onPress={() => nav.navigate('Tabs', { screen: 'My Garage' })} variant="ghost" compact/></Card>
  </Page>;
}
