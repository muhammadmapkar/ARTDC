import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, Divider, H2, Info, KeyValue, Label, Loading, Page, SectionTitle } from '../components/ui.tsx';
import { en } from '../i18n/en.ts';
import type { QuoteAnalysis } from '../services/quote.ts';
import { isSampleQuoteVehicle, mockQuoteService } from '../services/quote.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { money } from '../utils/format.ts';
export function QuoteScreen() {
  const nav = useNavigation<any>(); const { state, dispatch } = useDemo(); const [analysis, setAnalysis] = useState<QuoteAnalysis | null>(null);
  const vehicle = state.vehicles.find(x => x.id === state.selectedVehicleId) ?? state.vehicles[0];
  useEffect(() => { let active = true; mockQuoteService.analyzeSample().then(result => { if (active) { setAnalysis(result); dispatch({ type: 'ANALYZE' }); } }); return () => { active = false; }; }, [dispatch]);
  if (!analysis) return <Loading/>;
  const { quote } = analysis;
  return <Page back eyebrow="Step 03 · quote analysis" title="Know what you're approving." subtitle={`${quote.vehicleLabel} · ${quote.issue}`}>
    <Info icon="sparkles-outline">{en.ai}. This is a fixed sample quotation.</Info>
    <Info tone="amber">The garage comparison profile describes a part category, but this sample quotation does not state it. Ask for that detail in writing before approval.</Info>
    {state.report.symptom !== 'AC not cooling' && <Info tone="amber">This sample quotation covers an AC concern. Your reported issue is {state.report.symptom}. Select the sample AC issue before using the approval journey.</Info>}
    {!isSampleQuoteVehicle(vehicle) && <Info tone="amber">Your selected vehicle is not the 2022 Toyota Corolla. This fixed quotation does not apply to it. Select the sample Corolla before the approval journey.</Info>}
    <Card dark><Label color="#A2C2FF">SAMPLE QUOTATION TOTAL</Label><Body style={{ fontSize: 36, lineHeight: 44, fontWeight: '900', color: 'white' }}>{money(analysis.total)}</Body><Body style={{ color: '#C5D1E3' }}>{quote.garageName} · {quote.garageLocation}</Body><Body style={{ color: '#C5D1E3', fontSize: 12 }}>Fictional classroom data</Body></Card>
    <Card><Label>PROPOSED WORK · SAMPLE</Label><Body>{quote.repairDescription}</Body></Card>
    <SectionTitle title="What each item means"/>
    {quote.items.map(item => <Card key={item.id}><KeyValue label={item.label} value={money(item.amount)} strong/><Body>{item.explanation}</Body></Card>)}
    <Card><H2>Cost breakdown</H2><KeyValue label="Parts" value={money(analysis.parts)}/><KeyValue label="Labour" value={money(analysis.labour)}/><KeyValue label="Additional fees" value={money(analysis.fees)}/><Divider/><KeyValue label="Total" value={money(analysis.total)} strong/></Card>
    <SectionTitle title="Details to clarify" caption="The quotation leaves these points open."/>
    {analysis.missing.map(missing => <Info key={missing} tone="amber" icon="alert-circle-outline">{missing}</Info>)}
    <Card><Label>HOW TO READ THIS</Label>{analysis.concerns.map(concern => <Body key={concern}>• {concern}</Body>)}</Card>
    <Button title="View Repair Protection Score" onPress={() => nav.navigate('Protection')} icon="arrow-forward"/>
  </Page>;
}
