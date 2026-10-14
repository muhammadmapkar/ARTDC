import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, H2, Info, Label, Loading, Page, SectionTitle } from '../components/ui.tsx';
import { en } from '../i18n/en.ts';
import type { Guidance } from '../models/index.ts';
import { mockDiagnosticService } from '../services/diagnostic.ts';
import { useDemo } from '../state/DemoProvider.tsx';
export function GuidanceScreen() {
  const nav = useNavigation<any>(); const { state } = useDemo(); const [guidance, setGuidance] = useState<Guidance | null>(null);
  useEffect(() => { let active = true; mockDiagnosticService.assess(state.report).then(result => { if (active) setGuidance(result); }); return () => { active = false; }; }, [state.report]);
  if (!guidance) return <Loading/>;
  const criticalSigns = state.report.warningSigns.some(x => x !== 'None noticed');
  return <Page back eyebrow="Step 02 · preliminary guidance" title="A starting point, not a diagnosis." subtitle={`You reported: ${state.report.symptom}.`}>
    <Info icon="sparkles-outline">{en.ai}</Info>
    {(guidance.safety || criticalSigns) && <Info tone="red" icon="warning-outline">{guidance.safety ?? 'A warning sign was reported. If the car feels unsafe, stop driving safely and seek qualified assistance.'}</Info>}
    <SectionTitle title="What could be involved" caption="A mechanic must inspect the vehicle to confirm the cause."/>
    {guidance.causes.map((cause, i) => <Card key={cause.title}><Label>POSSIBILITY {String(i + 1).padStart(2, '0')}</Label><H2>{cause.title}</H2><Body>{cause.explanation}</Body></Card>)}
    <SectionTitle title="Ask a mechanic"/>
    <Card>{guidance.questions.map((question, i) => <Body key={question}>{i + 1}. {question}</Body>)}</Card>
    <SectionTitle title="Next steps"/>
    <Card>{guidance.nextSteps.map((step, i) => <Body key={step}>{i + 1}. {step}</Body>)}</Card>
    <Info tone="amber">{en.guidance}</Info>
    <Button title="Analyze a sample quotation" onPress={() => nav.navigate('Quote')} icon="arrow-forward"/>
  </Page>;
}
