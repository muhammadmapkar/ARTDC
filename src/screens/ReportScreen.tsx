import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { showNotice } from '../utils/feedback.ts';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, Chip, Field, Info, Label, Page, SectionTitle } from '../components/ui.tsx';
import { followUps, sampleReport, symptoms } from '../data/mock.ts';
import type { Attachment, ProblemReport, Symptom } from '../models/index.ts';
import { pickMedia } from '../services/nativeFiles.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { vehicleName } from '../utils/format.ts';
import { hasCompleteProblemReport } from '../utils/report.ts';
export function ReportScreen() {
  const nav = useNavigation<any>(); const { state, dispatch } = useDemo(); const [report, setReport] = useState<ProblemReport>({ ...state.report }); const [error, setError] = useState('');
  const selected = state.vehicles.find(x => x.id === state.selectedVehicleId) ?? state.vehicles[0]; const follow = followUps[report.symptom];
  const update = (patch: Partial<ProblemReport>) => setReport(r => ({ ...r, ...patch }));
  const attach = async () => { try { const file = await pickMedia(); if (file) update({ attachment: file }); } catch (e) { showNotice('Attachment unavailable', e instanceof Error ? e.message : 'Try the sample issue instead.'); } };
  const go = () => { if (!hasCompleteProblemReport(report)) { setError('Add a description, timing and answer the follow-up question.'); return; } dispatch({ type: 'REPORT', report: { ...report, description: report.description.trim() } }); nav.navigate('Guidance'); };
  return <Page back eyebrow="Step 01 · understand" title="What is your car telling you?" subtitle={`${vehicleName(selected)} · ${selected.year}`}>
    <Card><Label>ISSUE</Label><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{symptoms.map(s => <Chip key={s} title={s} selected={report.symptom === s} onPress={() => update({ symptom: s, followUp: '' })}/>)}</View></Card>
    <Field label="Describe what you notice" value={report.description} onChangeText={description => update({ description })} multiline placeholder="For example: The AC blows warm air even on the coldest setting."/>
    <SectionTitle title="When does it happen?"/><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{['All the time', 'After driving', 'When starting', 'Only sometimes'].map(occurs => <Chip key={occurs} title={occurs} selected={report.occurs === occurs} onPress={() => update({ occurs })}/>)}</View>
    <Card><Label>FOLLOW-UP QUESTION · SIMULATED AI</Label><Text style={{ color: '#132139', fontSize: 16, fontWeight: '800' }}>{follow.question}</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{follow.options.map(answer => <Chip key={answer} title={answer} selected={report.followUp === answer} onPress={() => update({ followUp: answer })}/>)}</View></Card>
    <SectionTitle title="Warning signs" caption="Select any that apply."/><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{['Smoke or burning smell', 'Fluid leaking', 'Red warning light', 'Loss of power', 'None noticed'].map(sign => <Chip key={sign} title={sign} selected={report.warningSigns.includes(sign)} onPress={() => update({ warningSigns: report.warningSigns.includes(sign) ? report.warningSigns.filter(x => x !== sign) : sign === 'None noticed' ? [sign] : [...report.warningSigns.filter(x => x !== 'None noticed'), sign] })}/>)}</View>
    <Button title={report.attachment ? `Attached: ${report.attachment.name}` : 'Attach photo or video'} onPress={attach} variant="ghost" icon="attach-outline"/><Info>Attachments are kept only in this local demo. No image or video is analyzed.</Info>
    {error && <Info tone="red">{error}</Info>}
    <Button title="See preliminary guidance" onPress={go} icon="arrow-forward"/>
    <Button title="Use sample AC issue" onPress={() => { setReport({ ...sampleReport }); setError(''); }} variant="secondary"/>
  </Page>;
}
