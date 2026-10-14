import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Body, Button, Card, Chip, H2, Icon, Info, KeyValue, Label, Page, Row, SectionTitle } from '../components/ui.tsx';
import { colors } from '../design/tokens.ts';
import { sampleQuote } from '../data/mock.ts';
import { en } from '../i18n/en.ts';
import type { SortKey } from '../models/index.ts';
import { mockGarageService, totalForGarage } from '../services/garages.ts';
import { isSampleQuoteVehicle } from '../services/quote.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { money, vehicleName } from '../utils/format.ts';
import { hasCompleteProblemReport } from '../utils/report.ts';
export function GaragesScreen() {
  const nav = useNavigation<any>(); const [sort, setSort] = useState<SortKey>('price'); const sorted = mockGarageService.list(sort);
  const { state } = useDemo(); const vehicle = state.vehicles.find(x => x.id === state.selectedVehicleId) ?? state.vehicles[0];
  const sorts: { key: SortKey; label: string }[] = [{ key: 'price', label: 'Lowest price' }, { key: 'rating', label: 'Best rating' }, { key: 'time', label: 'Fastest' }, { key: 'warranty', label: 'Longest warranty' }];
  return <Page eyebrow="Step 05 · compare" title="Compare what matters." subtitle={`Three fictional AC repair quotations for ${sampleQuote.vehicleLabel}.`}>
    <Info tone="amber">{en.fictional}</Info>
    {!isSampleQuoteVehicle(vehicle) && <Info tone="amber">Selected vehicle: {vehicleName(vehicle)} {vehicle.year}. These fixed Corolla examples do not apply to it. Select the sample Corolla before approving a quote.</Info>}
    {!isSampleQuoteVehicle(vehicle) && <Button title="Choose sample Corolla" onPress={() => nav.navigate('Vehicle')} variant="secondary"/>}
    {!hasCompleteProblemReport(state.report) && <Info tone="amber">You can compare these fictional profiles now. Report the AC concern before selecting a garage for quote approval.</Info>}
    {!hasCompleteProblemReport(state.report) && <Button title="Report sample AC issue" onPress={() => nav.navigate('Report')} variant="secondary"/>}
    <SectionTitle title="Sort garages"/><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{sorts.map(item => <Chip key={item.key} title={item.label} selected={sort === item.key} onPress={() => setSort(item.key)}/>)}</View>
    {sorted.map((garage, index) => <Card key={garage.id}>
      <Row style={{ alignItems: 'center' }}><View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.blueSoft, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '900', color: colors.blue }}>{garage.initials}</Text></View><View style={{ flex: 1 }}><H2>{garage.name}</H2><Body>{garage.location}</Body></View><Text style={{ color: colors.blue, fontWeight: '900', fontSize: 18 }}>{money(totalForGarage(garage))}</Text></Row>
      <Body>{garage.specialization}</Body><View style={{ height: 1, backgroundColor: colors.line }}/><KeyValue label="Part category" value={garage.parts}/><KeyValue label="Warranty" value={`${garage.warrantyMonths} month${garage.warrantyMonths === 1 ? '' : 's'}`}/><KeyValue label="Completion" value={`${garage.hours} hours (sample)`}/><KeyValue label="Rating" value={`${garage.rating.toFixed(1)} ★ · ${garage.reviewCount} sample reviews`}/><Button title="View Trust Passport" onPress={() => nav.navigate('Trust', { garageId: garage.id })} variant="secondary" icon="arrow-forward"/>
    </Card>)}
    <Card><SectionTitle title="Why do the quotes differ?"/><Body>Part category, part cost, labour, warranty and completion time all differ. The same AED 100 inspection fee appears in each example. Ask each garage to confirm the exact repair scope and part brand before deciding.</Body></Card>
  </Page>;
}
