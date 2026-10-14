import React from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, Divider, H2, Info, KeyValue, Label, Page, SectionTitle } from '../components/ui.tsx';
import { additionalWork } from '../data/mock.ts';
import { colors } from '../design/tokens.ts';
import { en } from '../i18n/en.ts';
import { getGarage } from '../services/workflow.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { dateLabel, money } from '../utils/format.ts';
export function QuoteLockScreen() {
  const nav = useNavigation<any>(); const { state, dispatch } = useDemo(); const repair = state.repair; const garage = repair && getGarage(repair.garageId);
  if (!repair || !garage) return <Page back title="Choose a garage first"><Info>Compare fictional garages to create a quote approval record.</Info><Button title="Compare garages" onPress={() => nav.navigate('Tabs', { screen: 'Garages' })}/></Page>;
  return <Page back eyebrow="Step 07 · quote lock" title="Your decision, on record." subtitle={`${garage.name} · ${repair.vehicle.manufacturer} ${repair.vehicle.model} ${repair.vehicle.year}`}>
    <Info>{en.authorization}</Info>
    <Card dark><Label color="#A2C2FF">CURRENT AUTHORIZED TOTAL</Label><Text style={{ color: colors.white, fontSize: 38, fontWeight: '900' }}>{repair.approved ? money(repair.authorizedTotal) : 'Not approved'}</Text><Body style={{ color: '#C5D1E3' }}>{repair.approved ? `Confirmed base quote ${money(repair.baseTotal)}` : 'No work has been authorized in the demo.'}</Body></Card>
    <Card><H2>Quotation review</H2><KeyValue label="Initial estimate" value={money(garage.initialEstimate)}/><KeyValue label="Confirmed quotation" value={money(repair.baseTotal)}/><KeyValue label="Difference to confirm" value={money(repair.baseTotal - garage.initialEstimate)}/><Divider/>{garage.items.map(item => <KeyValue key={item.id} label={item.label} value={money(item.amount)}/>)}<Info tone="amber">Ask the garage to explain the difference from the initial estimate before approving.</Info></Card>
    {!repair.approved && <Button title={`Approve repair · ${money(repair.baseTotal)}`} onPress={() => dispatch({ type: 'APPROVE', at: new Date().toISOString() })} icon="checkmark-circle-outline"/>}
    {repair.approved && repair.extra === 'not-requested' && <Card><Label>NEXT DEMO EVENT</Label><H2>Additional repair request</H2><Body>During a simulated inspection, the garage identifies another component. Open the request to decide before this work is added.</Body><Button title="Show additional request" onPress={() => dispatch({ type: 'REQUEST_EXTRA', at: new Date().toISOString() })} variant="secondary" icon="add-circle-outline"/></Card>}
    {repair.extra === 'pending' && <Card style={{ borderColor: colors.amber }}><Label color={colors.amber}>AWAITING YOUR DECISION</Label><H2>{additionalWork.title}</H2><Body>{additionalWork.reason}</Body>{additionalWork.items.map(item => <KeyValue key={item.id} label={item.label} value={money(item.amount)}/>)}<Divider/><KeyValue label="Additional request" value={money(additionalWork.amount)} strong/><KeyValue label="Proposed new total" value={money(repair.baseTotal + additionalWork.amount)} strong/><Button title="Approve additional work" onPress={() => dispatch({ type: 'DECIDE_EXTRA', approved: true, at: new Date().toISOString() })} icon="checkmark-outline"/><Button title="Decline additional work" onPress={() => dispatch({ type: 'DECIDE_EXTRA', approved: false, at: new Date().toISOString() })} variant="ghost" icon="close-outline"/></Card>}
    {repair.extra === 'approved' && <Info tone="green">Additional AED 300 approved. Your authorized total is now {money(repair.authorizedTotal)}.</Info>}
    {repair.extra === 'declined' && <Info tone="amber">Additional work declined. Your authorized total remains {money(repair.authorizedTotal)}. The sample repair record will contain only the base work.</Info>}
    <SectionTitle title="Approval history" caption="Local time and totals recorded for this demonstration."/>
    <Card>{repair.history.length ? repair.history.map(entry => <Card key={entry.id} style={{ padding: 12, backgroundColor: colors.background }}><Label>{entry.type.replaceAll('-', ' ').toUpperCase()}</Label><Body>{entry.note}</Body><KeyValue label="Authorized after event" value={money(entry.authorizedTotal)}/><Body style={{ fontSize: 12 }}>{new Date(entry.at).toLocaleString()}</Body></Card>) : <Body>No approvals recorded yet.</Body>}</Card>
    {repair.approved && (repair.extra === 'approved' || repair.extra === 'declined') && <Button title="Track this repair" onPress={() => nav.navigate('Tracking')} variant="secondary" icon="arrow-forward"/>}
  </Page>;
}
