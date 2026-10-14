import React from 'react';
import { Text, View } from 'react-native';
import { showNotice } from '../utils/feedback.ts';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, H2, Icon, Info, KeyValue, Label, Page, Row, SectionTitle } from '../components/ui.tsx';
import { colors } from '../design/tokens.ts';
import { en } from '../i18n/en.ts';
import { repairStages, timelineNotes } from '../data/mock.ts';
import { getGarage } from '../services/workflow.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { money } from '../utils/format.ts';
export function TrackingScreen() {
  const nav = useNavigation<any>(); const { state, dispatch } = useDemo(); const repair = state.repair; const garage = repair && getGarage(repair.garageId);
  if (!repair || !garage) return <Page back title="No active repair"><Info>Choose a garage and approve its quotation to create a tracked repair.</Info><Button title="Compare garages" onPress={() => nav.navigate('Tabs', { screen: 'Garages' })}/><Button title="View completed history" variant="secondary" onPress={() => nav.navigate('Tabs', { screen: 'My Garage' })}/></Page>;
  const next = () => { dispatch({ type: 'ADVANCE' }); };
  const collect = () => { dispatch({ type: 'COLLECT', at: new Date().toISOString() }); nav.navigate('Tabs', { screen: 'My Garage' }); };
  return <Page back eyebrow="Step 08 · repair tracking" title="Follow the work." subtitle={`${repairStages[repair.stage]} · ${garage.name}`}>
    <Info>{en.prototype}. Progress is simulated; there is no garage connectivity.</Info>
    <Card dark><Label color="#A2C2FF">AUTHORIZED REPAIR</Label><Text style={{ color: colors.white, fontSize: 36, fontWeight: '900' }}>{repair.approved ? money(repair.authorizedTotal) : 'Awaiting approval'}</Text><Body style={{ color: '#C5D1E3' }}>Expected completion: {garage.hours} hours after work starts · sample estimate</Body></Card>
    {!repair.approved && <Button title="Review quotation approval" onPress={() => nav.navigate('QuoteLock')} icon="arrow-forward"/>}
    {repair.approved && repair.extra === 'not-requested' && <Card><H2>Next: additional work request</H2><Body>The fixed classroom garage scenario includes a separate AED 300 request. Review it before the repair timeline advances.</Body><Button title="Review additional request" onPress={() => { dispatch({ type: 'REQUEST_EXTRA', at: new Date().toISOString() }); nav.navigate('QuoteLock'); }} icon="arrow-forward"/></Card>}
    {repair.extra === 'pending' && <Info tone="amber">Additional work needs your decision before the sample timeline moves forward.</Info>}
    {repair.extra === 'pending' && <Button title="Decide on additional work" onPress={() => nav.navigate('QuoteLock')} icon="arrow-forward"/>}
    <SectionTitle title="Repair timeline" caption="Tap an available sample note to inspect what was recorded."/>
    <Card>{repairStages.map((stage, index) => <View key={stage} style={{ flexDirection: 'row', gap: 13, minHeight: 72 }}><View style={{ alignItems: 'center', width: 24 }}><Icon name={index <= repair.stage ? 'checkmark-circle' : 'ellipse-outline'} color={index <= repair.stage ? colors.blue : colors.slate} size={24}/>{index < repairStages.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: index < repair.stage ? colors.blue : colors.line }}/>}</View><View style={{ flex: 1, paddingBottom: 13 }}><Text style={{ color: index <= repair.stage ? colors.navy : colors.muted, fontWeight: '800', fontSize: 15 }}>{stage}</Text><Body style={{ fontSize: 12 }}>{index <= repair.stage ? timelineNotes[index] : 'Upcoming demo stage'}</Body>{index <= repair.stage && index === 1 && <Button title="View inspection note" compact variant="secondary" onPress={() => showNotice('Sample inspection note', 'AC airflow is present. Compressor operation needs confirmation in this simulated record. No real inspection occurred.')}/>}</View></View>)}</Card>
    <Card><H2>Repair notes</H2><Body>{timelineNotes[repair.stage]}</Body><KeyValue label="Garage" value={garage.name}/><KeyValue label="Approved price" value={repair.approved ? money(repair.authorizedTotal) : 'None yet'}/><KeyValue label="Additional work" value={repair.extra.replaceAll('-', ' ')}/><Info>Evidence shown here is sample text only. No real garage attachments were received.</Info></Card>
    {repair.approved && (repair.extra === 'approved' || repair.extra === 'declined') && repair.stage < repairStages.length - 1 && <Button title={`Demo next stage: ${repairStages[repair.stage + 1]}`} onPress={next} icon="arrow-forward"/>}
    {repair.approved && (repair.extra === 'approved' || repair.extra === 'declined') && repair.stage === repairStages.length - 1 && <Button title="Collect & save repair history" onPress={collect} icon="checkmark-circle-outline"/>}
    {repair.approved && <Button title="View approval history" onPress={() => nav.navigate('QuoteLock')} variant="ghost"/>}
  </Page>;
}
