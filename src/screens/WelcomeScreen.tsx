import React from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BRAND } from '../config/brand.ts';
import { colors } from '../design/tokens.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { Body, Button, Icon, Label } from '../components/ui.tsx';
export function WelcomeScreen() {
  const { dispatch } = useDemo();
  const { height } = useWindowDimensions(); const compact = height < 730;
  const start = () => dispatch({ type: 'ONBOARD' });
  return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><View style={[styles.inner, compact && { minHeight: 660 }]}>
    <View style={styles.top}><View style={styles.logo}><Icon name="scan-outline" size={24} color={colors.white}/></View><Text style={styles.brand}>{BRAND.name}</Text><Label color="#8CB6FF">INE 301 · CLASSROOM PROTOTYPE</Label></View>
    <View style={styles.hero}><View style={[styles.ring, compact && { width: 152, height: 152, borderRadius: 76 }]}><Icon name="car-sport-outline" size={compact ? 72 : 95} color={colors.white}/><View style={styles.badge}><Icon name="shield-checkmark" color={colors.white} size={25}/></View></View><Text style={[styles.headline, compact && { fontSize: 29, lineHeight: 35 }]}>{BRAND.tagline}</Text><Text style={styles.sub}>Your clearer path from first symptom to final approval.</Text></View>
    <View style={styles.benefits}>{[['document-text-outline','Understand every quote'],['git-compare-outline','Compare garage details'],['lock-closed-outline','Control repair costs']].map(([icon,text]) => <View key={text} style={styles.benefit}><Icon name={icon as any} color="#A9C8FF" size={21}/><Text style={styles.benefitText}>{text}</Text></View>)}</View>
    <View style={styles.buttons}><Button title="Get started" onPress={start} icon="arrow-forward"/><Button title="Explore demo as guest" onPress={start} variant="secondary"/><Body style={styles.note}>No account required · Fictional garage data · Example AED prices</Body></View>
  </View></ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.navy }, scroll: { flexGrow: 1, paddingHorizontal: 24 }, inner: { width: '100%', maxWidth: 500, alignSelf: 'center', flexGrow: 1, justifyContent: 'space-between', paddingTop: 25, paddingBottom: 20, gap: 20 }, top: { alignItems: 'flex-start', gap: 8 }, logo: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }, brand: { color: colors.white, fontSize: 23, fontWeight: '900', letterSpacing: -.6 }, hero: { alignItems: 'center', gap: 16 }, ring: { width: 190, height: 190, borderRadius: 95, borderWidth: 1, borderColor: '#43659F', backgroundColor: '#142540', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }, badge: { position: 'absolute', right: 2, bottom: 8, width: 50, height: 50, borderRadius: 18, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }, headline: { color: colors.white, fontSize: 34, lineHeight: 40, letterSpacing: -1, fontWeight: '900', textAlign: 'center' }, sub: { color: '#BCCAE1', fontSize: 15, lineHeight: 23, textAlign: 'center' }, benefits: { gap: 13 }, benefit: { flexDirection: 'row', gap: 13, alignItems: 'center' }, benefitText: { color: colors.white, fontSize: 15, fontWeight: '700' }, buttons: { gap: 10 }, note: { color: '#A7B8D3', textAlign: 'center', fontSize: 12 } });
