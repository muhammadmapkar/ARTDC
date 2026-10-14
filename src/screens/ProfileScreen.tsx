import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActionCard, Body, Button, Card, H2, Info, Label, Page, SectionTitle } from '../components/ui.tsx';
import { BRAND } from '../config/brand.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { confirmAction } from '../utils/feedback.ts';
export function ProfileScreen() {
  const nav = useNavigation<any>(); const { state, dispatch, storageError } = useDemo();
  const reset = () => confirmAction('Reset classroom demo?', 'This restores the sample Corolla and clears saved demo decisions and completed demo repairs on this device.', 'Reset demo', () => dispatch({ type: 'RESET' }));
  return <Page eyebrow="Guest profile" title="Your demo controls." subtitle="Explore freely. All activity stays on this device.">
    <Card dark><Label color="#A2C2FF">{BRAND.name.toUpperCase()}</Label><Body style={{ color: 'white', fontSize: 23, fontWeight: '800' }}>{BRAND.tagline}</Body><Body style={{ color: '#C5D1E3' }}>INE 301 · Assignment 1 mobile prototype</Body></Card>
    <SectionTitle title="Your settings"/><ActionCard title="Manage vehicles" description="Select or edit the vehicle used in the demo" icon="car-outline" onPress={() => nav.navigate('Vehicle')}/><ActionCard title="Repair history" description="See sample invoices and saved approvals" icon="receipt-outline" onPress={() => nav.navigate('Tabs', { screen: 'My Garage' })}/>
    <Card><H2>Prototype data</H2><Body>Diagnostic and quotation explanations are simulated. Garage profiles, verification indicators, prices and reviews are fictional. No payments, garage connectivity or document extraction are active.</Body><Body>English text is implemented. Arabic localization and right-to-left layout are future work.</Body></Card>
    {storageError && <Info tone="amber">A saved demo could not be restored or local storage is unavailable. The sample state is shown; changes may not persist.</Info>}
    <SectionTitle title="Classroom setup"/><Body>Reset before presenting to restore the welcome screen, sample Corolla, AC journey and original history.</Body><Button title="Reset Demo" onPress={reset} variant="danger" icon="refresh-outline"/>
  </Page>;
}
