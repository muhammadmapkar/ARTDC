import React, { useState } from 'react';
import { showNotice } from '../utils/feedback.ts';
import { useNavigation } from '@react-navigation/native';
import { ActionCard, Body, Button, Card, H2, Icon, Info, Label, Page, SectionTitle } from '../components/ui.tsx';
import { colors } from '../design/tokens.ts';
import { sampleQuote } from '../data/mock.ts';
import type { Attachment } from '../models/index.ts';
import { pickDocument, pickMedia } from '../services/nativeFiles.ts';
import { isSampleQuoteVehicle } from '../services/quote.ts';
import { useDemo } from '../state/DemoProvider.tsx';
export function AnalyzeScreen() {
  const nav = useNavigation<any>(); const [file, setFile] = useState<Attachment | null>(null); const { state } = useDemo();
  const vehicle = state.vehicles.find(x => x.id === state.selectedVehicleId) ?? state.vehicles[0];
  const attach = async (kind: 'media' | 'document') => { try { const selected = kind === 'media' ? await pickMedia() : await pickDocument(); if (selected) setFile(selected); } catch (e) { showNotice('Selection unavailable', e instanceof Error ? e.message : 'Choose the sample quote for the demo.'); } };
  return <Page eyebrow="Quote clarity" title="Understand the numbers." subtitle="Review a fictional example or choose a file to prepare for a future integration.">
    <Card dark><Icon name="document-text-outline" size={38} color="#94BAFF"/><Label color="#94BAFF">FEATURED CLASSROOM SCENARIO</Label><H2><Body style={{ color: colors.white, fontSize: 22, fontWeight: '800' }}>{sampleQuote.vehicleLabel} AC quotation</Body></H2><Body style={{ color: '#C5D1E3' }}>Part, labour and inspection · AED 1,100</Body><Button title="Open sample quotation" onPress={() => nav.navigate('Quote')} icon="arrow-forward"/></Card>
    {!isSampleQuoteVehicle(vehicle) && <Info tone="amber">This fixed classroom quote is for a 2022 Toyota Corolla, not your selected vehicle. Choose the sample Corolla before approving a garage quote.</Info>}
    <SectionTitle title="Bring your own quote" caption="File selection is local. Document extraction is not enabled."/>
    <ActionCard title="Choose image" description="Pick a quotation photo from your phone" icon="image-outline" onPress={() => attach('media')}/>
    <ActionCard title="Choose document" description="Pick a PDF or image document" icon="attach-outline" onPress={() => attach('document')}/>
    {file && <Card><Label>FILE SELECTED</Label><H2>{file.name}</H2><Info tone="amber">This file has not been read or analyzed. Open the sample quotation to see the simulated explanation.</Info><Button title="Remove selected file" onPress={() => setFile(null)} variant="ghost"/></Card>}
    <Info>Any sample analysis is simulated and based only on the fixed example data.</Info>
  </Page>;
}
