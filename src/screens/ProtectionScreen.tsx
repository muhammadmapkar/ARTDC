import React, { useMemo, useState } from 'react';
import { Share, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, H2, Icon, Info, KeyValue, Label, Page, Row, SectionTitle } from '../components/ui.tsx';
import { colors } from '../design/tokens.ts';
import { en } from '../i18n/en.ts';
import { copyText } from '../services/nativeFiles.ts';
import { analyzeQuote, mockQuoteService, rubric } from '../services/quote.ts';
import { sampleQuote } from '../data/mock.ts';
import { useDemo } from '../state/DemoProvider.tsx';
export function ProtectionScreen() {
  const nav = useNavigation<any>(); const { state, dispatch } = useDemo(); const analysis = useMemo(() => analyzeQuote(sampleQuote), []); const [copyMessage, setCopyMessage] = useState('');
  const message = mockQuoteService.mechanicMessage(analysis);
  const copy = async () => { try { const ok = await copyText(message); setCopyMessage(ok ? 'Copied to clipboard.' : 'Clipboard is unavailable in this Expo client. You can read or copy the message shown below.'); } catch { setCopyMessage('Clipboard is unavailable in this Expo client. You can read or copy the message shown below.'); } };
  return <Page back eyebrow="Step 04 · documentation check" title="Spot the missing details." subtitle="The score measures quotation completeness only.">
    <Card dark><Label color="#A2C2FF">REPAIR PROTECTION SCORE</Label><Row style={{ alignItems: 'baseline' }}><Text style={{ fontSize: 58, fontWeight: '900', color: 'white' }}>{analysis.score}</Text><Text style={{ fontSize: 23, color: '#AFC6E8', fontWeight: '800' }}>/100</Text></Row><Body style={{ color: '#C5D1E3' }}>Based on six visible documentation fields. It does not rate honesty or repair quality.</Body><View style={{ height: 8, borderRadius: 8, backgroundColor: '#354463', overflow: 'hidden' }}><View style={{ width: `${analysis.score}%`, height: 8, backgroundColor: '#70ABFF' }}/></View></Card>
    <SectionTitle title="Documentation checklist"/>
    <Card>{rubric.map(item => <Row key={item.key} style={{ alignItems: 'center', paddingVertical: 5 }}><Icon name={sampleQuote.completeness[item.key] ? 'checkmark-circle' : 'alert-circle'} color={sampleQuote.completeness[item.key] ? colors.green : colors.amber} size={20}/><Body style={{ flex: 1, color: colors.text }}>{item.label}</Body><Text style={{ fontWeight: '800', color: sampleQuote.completeness[item.key] ? colors.green : colors.amber }}>{sampleQuote.completeness[item.key] ? `+${item.points}` : 'Missing'}</Text></Row>)}</Card>
    {analysis.missing.map(m => <Info key={m} tone="amber">{m}</Info>)}
    <Button title="Generate questions for mechanic" onPress={() => dispatch({ type: 'GENERATE_QUESTIONS' })} icon="chatbubble-ellipses-outline"/>
    {state.questionsGenerated && <Card><Label>EXAMPLE MESSAGE · SIMULATED AI</Label><Text selectable style={{ color: colors.text, fontSize: 15, lineHeight: 23 }}>{message}</Text><Button title="Copy message" onPress={copy} variant="secondary" icon="copy-outline"/><Button title="Share message" onPress={() => Share.share({ message }).catch(() => setCopyMessage('Sharing is unavailable on this device. Select the message above to copy it manually.'))} variant="ghost" icon="share-outline"/>{copyMessage ? <Info tone={copyMessage.startsWith('Copied') ? 'green' : 'amber'}>{copyMessage}</Info> : null}</Card>}
    <Info>{en.ai}. Scoring is deterministic; missing fields simply lose their listed points.</Info>
    <Button title="Compare fictional garages" onPress={() => nav.navigate('Tabs', { screen: 'Garages' })} variant="secondary" icon="arrow-forward"/>
  </Page>;
}
