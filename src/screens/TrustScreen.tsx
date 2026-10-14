import React from 'react';
import { Text, View } from 'react-native';
import { showNotice } from '../utils/feedback.ts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Body, Button, Card, H2, Icon, Info, KeyValue, Label, Page, Row, SectionTitle } from '../components/ui.tsx';
import { colors } from '../design/tokens.ts';
import { en } from '../i18n/en.ts';
import { garages, sampleQuote } from '../data/mock.ts';
import { totalForGarage } from '../services/garages.ts';
import { isSampleQuoteVehicle } from '../services/quote.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { money } from '../utils/format.ts';
import { hasCompleteProblemReport } from '../utils/report.ts';
export function TrustScreen() {
  const nav = useNavigation<any>(); const route = useRoute<any>(); const garage = garages.find(x => x.id === route.params?.garageId); const { state, dispatch } = useDemo();
  if (!garage) return <Page back title="Garage unavailable"><Info tone="red">This garage profile could not be found.</Info><Button title="Return to garages" onPress={() => nav.navigate('Tabs', { screen: 'Garages' })}/></Page>;
  const vehicle = state.vehicles.find(x => x.id === state.selectedVehicleId) ?? state.vehicles[0];
  const choose = () => { if (state.repair?.approved) { nav.navigate('Tracking'); return; } if (!isSampleQuoteVehicle(vehicle)) { showNotice('Sample Corolla quotation', 'This fixed garage quote is for a 2022 Toyota Corolla. Select the sample Corolla before approving it.'); nav.navigate('Vehicle'); return; } if (state.report.symptom !== 'AC not cooling') { showNotice('Sample AC scenario', 'This garage quote is for AC work. Select the sample AC issue before approving it.'); nav.navigate('Report'); return; } if (!hasCompleteProblemReport(state.report)) { showNotice('Report the concern first', 'Describe the AC concern or use the sample AC issue before approving a garage quote.'); nav.navigate('Report'); return; } dispatch({ type: 'SELECT_GARAGE', garageId: garage.id, at: new Date().toISOString() }); nav.navigate('QuoteLock'); };
  return <Page back eyebrow="Step 06 · trust passport" title={garage.name} subtitle={`${garage.location} · ${garage.specialization}`}>
    <Info tone="amber">All profile details, ratings, jobs, reviews and verification indicators here are simulated. No trade licence has been checked.</Info>
    <Card dark><Label color="#A2C2FF">DEMONSTRATION QUOTATION · {sampleQuote.vehicleLabel.toUpperCase()}</Label><Text style={{ fontSize: 36, fontWeight: '900', color: colors.white }}>{money(totalForGarage(garage))}</Text><Body style={{ color: '#C5D1E3' }}>Initial estimate {money(garage.initialEstimate)} · confirmed quote {money(totalForGarage(garage))}</Body></Card>
    <SectionTitle title="Trust indicators" caption="These fields help comparison; they do not guarantee repair quality."/>
    <Card><KeyValue label="Business verification" value="Simulated · unverified"/><KeyValue label="Rating" value={`${garage.rating.toFixed(1)} ★ · sample`}/><KeyValue label="Completed jobs" value={`${garage.jobs} · sample`}/><KeyValue label="Specialization" value={garage.specialization}/><KeyValue label="Part category" value={garage.parts}/><KeyValue label="Warranty" value={`${garage.warrantyMonths} months · demo terms`}/><KeyValue label="Completion" value={`${garage.hours} hours · estimate`}/></Card>
    <SectionTitle title="Pricing breakdown"/>
    <Card>{garage.items.map(item => <KeyValue key={item.id} label={item.label} value={money(item.amount)}/>)}<KeyValue label="Confirmed total" value={money(totalForGarage(garage))} strong/></Card>
    <SectionTitle title="Transparency notes"/><Card>{garage.transparency.map(item => <Row key={item} style={{ alignItems: 'flex-start' }}><Icon name="checkmark-circle-outline" color={colors.green} size={19}/><Body style={{ flex: 1 }}>{item}</Body></Row>)}</Card>
    <SectionTitle title="Sample review examples" caption={`The ${garage.reviewCount} review count and the examples below are fictional.`}/>
    {garage.reviews.map(review => <Card key={review.author}><Row style={{ alignItems: 'center' }}><Text style={{ fontWeight: '800', color: colors.navy, flex: 1 }}>{review.author}</Text><Text style={{ color: colors.amber, fontWeight: '800' }}>{'★'.repeat(review.stars)}</Text></Row><Body>“{review.text}”</Body><Body>{review.date}</Body></Card>)}
    <Button title={state.repair?.approved ? 'View authorized repair' : `Select ${garage.name}`} onPress={choose} icon="arrow-forward"/>
    <Info>{en.fictional}</Info>
  </Page>;
}
