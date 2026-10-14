import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, space } from '../design/tokens.ts';
import { BRAND } from '../config/brand.ts';
import { en } from '../i18n/en.ts';

export function Icon({ name, size = 22, color = colors.blue }: { name: React.ComponentProps<typeof Ionicons>['name']; size?: number; color?: string }) { return <Ionicons name={name} size={size} color={color} />; }
export function Label({ children, color = colors.blue }: { children: React.ReactNode; color?: string }) { return <Text style={[styles.label, { color }]}>{children}</Text>; }
export function H1({ children }: { children: React.ReactNode }) { return <Text style={styles.h1}>{children}</Text>; }
export function H2({ children }: { children: React.ReactNode }) { return <Text style={styles.h2}>{children}</Text>; }
export function Body({ children, style }: { children: React.ReactNode; style?: any }) { return <Text style={[styles.body, style]}>{children}</Text>; }
export function Card({ children, style, dark = false }: { children: React.ReactNode; style?: ViewStyle | ViewStyle[]; dark?: boolean }) { return <View style={[styles.card, dark && styles.darkCard, style]}>{children}</View>; }
export function Divider() { return <View style={styles.divider} />; }
export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) { return <View style={[styles.row, style]}>{children}</View>; }
export function Button({ title, onPress, variant = 'primary', icon, disabled = false, compact = false }: { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: React.ComponentProps<typeof Ionicons>['name']; disabled?: boolean; compact?: boolean }) {
  const style = variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : variant === 'danger' ? styles.danger : styles.ghost;
  const color = variant === 'primary' || variant === 'danger' ? colors.white : variant === 'secondary' ? colors.blue : colors.text;
  return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, style, compact && styles.compact, disabled && styles.disabled, pressed && { opacity: 0.78 }]}>
    {icon && <Icon name={icon} color={color} size={19} />}<Text style={[styles.buttonText, { color }]}>{title}</Text>
  </Pressable>;
}
export function Chip({ title, selected, onPress, icon }: { title: string; selected: boolean; onPress: () => void; icon?: React.ComponentProps<typeof Ionicons>['name'] }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [styles.chip, selected && styles.selectedChip, pressed && { opacity: .72 }]}>
    {icon && <Icon name={icon} size={16} color={selected ? colors.white : colors.muted} />}<Text style={[styles.chipText, selected && { color: colors.white }]}>{title}</Text>
  </Pressable>;
}
export function Field({ label, value, onChangeText, placeholder, multiline, keyboardType, error }: { label: string; value: string; onChangeText: (text: string) => void; placeholder?: string; multiline?: boolean; keyboardType?: KeyboardTypeOptions; error?: string }) {
  return <View style={{ gap: 7 }}><Text style={styles.fieldLabel}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.slate} multiline={multiline} keyboardType={keyboardType} style={[styles.input, multiline && { minHeight: 110, textAlignVertical: 'top' }, error && { borderColor: colors.red }]} />{error && <Text style={styles.error}>{error}</Text>}</View>;
}
export function Info({ children, tone = 'blue', icon = 'information-circle-outline' }: { children: React.ReactNode; tone?: 'blue' | 'amber' | 'green' | 'red'; icon?: React.ComponentProps<typeof Ionicons>['name'] }) {
  const bg = tone === 'amber' ? colors.amberSoft : tone === 'green' ? colors.greenSoft : tone === 'red' ? colors.redSoft : colors.blueSoft;
  const fg = tone === 'amber' ? colors.amber : tone === 'green' ? colors.green : tone === 'red' ? colors.red : colors.blue;
  return <View style={[styles.info, { backgroundColor: bg }]}><Icon name={icon} color={fg} size={20}/><Text style={[styles.infoText, { color: fg }]}>{children}</Text></View>;
}
export function Loading() { return <View style={styles.loading}><ActivityIndicator color={colors.blue} size="large"/><Body>Opening your local demo…</Body></View>; }
export function Page({ eyebrow, title, subtitle, children, back = false, right }: { eyebrow?: string; title: string; subtitle?: string; children: React.ReactNode; back?: boolean; right?: React.ReactNode }) {
  const nav = useNavigation<any>();
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
    <View style={styles.inner}>
      <Row style={{ alignItems: 'center', marginBottom: 22 }}>
        {back ? <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => nav.canGoBack() ? nav.goBack() : nav.navigate('Tabs', { screen: 'Home' })} style={styles.back}><Icon name="arrow-back" color={colors.navy}/></Pressable> : <View style={styles.brandMark}><Icon name="scan-outline" color={colors.white} size={18}/></View>}
        <Text style={styles.brandText}>{BRAND.name.toUpperCase()}</Text><View style={{ flex: 1 }}/>{right}
      </Row>
      {eyebrow && <Label>{eyebrow.toUpperCase()}</Label>}
      <H1>{title}</H1>
      {subtitle && <Body style={{ marginTop: 8, marginBottom: 8 }}>{subtitle}</Body>}
      <View style={{ gap: 16, marginTop: 22 }}>{children}</View>
      <Text style={styles.bottomNote}>{en.prototype} · Fictional data</Text>
    </View>
  </ScrollView></SafeAreaView>;
}
export function ActionCard({ title, description, icon, onPress, tint = colors.blue }: { title: string; description: string; icon: React.ComponentProps<typeof Ionicons>['name']; onPress: () => void; tint?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: .78 }]}><View style={[styles.actionIcon, { backgroundColor: tint + '16' }]}><Icon name={icon} color={tint}/></View><View style={{ flex: 1 }}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDesc}>{description}</Text></View><Icon name="arrow-forward" color={colors.slate} size={19}/></Pressable>;
}
export function KeyValue({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <Row style={{ alignItems: 'center', paddingVertical: 5 }}><Text style={styles.kvLabel}>{label}</Text><Text style={[styles.kvValue, strong && { fontWeight: '800', fontSize: 18 }]}>{value}</Text></Row>; }
export function SectionTitle({ title, caption }: { title: string; caption?: string }) { return <View style={{ gap: 3, marginTop: 6 }}><H2>{title}</H2>{caption && <Body>{caption}</Body>}</View>; }
const styles = StyleSheet.create({
  safe: { flex: 1, minHeight: 0, backgroundColor: colors.background }, scroll: { flex: 1, minHeight: 0 }, page: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 42 }, inner: { width: '100%', maxWidth: 540, alignSelf: 'center' },
  brandMark: { width: 30, height: 30, backgroundColor: colors.blue, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 }, brandText: { fontSize: 12, fontWeight: '900', color: colors.navy, letterSpacing: 2.1 },
  back: { width: 44, height: 44, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 8 }, h1: { fontSize: 32, lineHeight: 38, fontWeight: '800', color: colors.navy, letterSpacing: -0.8 }, h2: { fontSize: 19, lineHeight: 25, fontWeight: '800', color: colors.navy }, body: { fontSize: 15, lineHeight: 23, color: colors.muted },
  card: { backgroundColor: colors.white, borderRadius: radius.md, borderColor: colors.line, borderWidth: 1, padding: 20, gap: 12 }, darkCard: { backgroundColor: colors.navy, borderColor: colors.navy }, divider: { height: 1, backgroundColor: colors.line, marginVertical: 4 }, row: { flexDirection: 'row', gap: 10 },
  button: { minHeight: 52, borderRadius: 15, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }, primary: { backgroundColor: colors.blue }, secondary: { backgroundColor: colors.blueSoft }, ghost: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line }, danger: { backgroundColor: colors.red }, compact: { minHeight: 44, alignSelf: 'flex-start' }, disabled: { opacity: .42 }, buttonText: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  chip: { minHeight: 42, borderRadius: 13, paddingHorizontal: 13, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 6 }, selectedChip: { backgroundColor: colors.blue, borderColor: colors.blue }, chipText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  fieldLabel: { fontSize: 13, color: colors.text, fontWeight: '800' }, input: { minHeight: 52, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, color: colors.text, fontSize: 15 }, error: { color: colors.red, fontSize: 12, fontWeight: '600' },
  info: { borderRadius: 15, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }, infoText: { fontSize: 13, lineHeight: 20, flex: 1, fontWeight: '600' }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: colors.background },
  action: { flexDirection: 'row', minHeight: 90, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, alignItems: 'center', gap: 13, padding: 15 }, actionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, actionTitle: { fontSize: 15, fontWeight: '800', color: colors.navy }, actionDesc: { fontSize: 12, lineHeight: 18, color: colors.muted, marginTop: 3 },
  kvLabel: { flex: 1, fontSize: 14, color: colors.muted }, kvValue: { fontSize: 14, color: colors.text, fontWeight: '700', textAlign: 'right', flexShrink: 1 }, bottomNote: { color: colors.slate, fontSize: 10, letterSpacing: 1, textAlign: 'center', marginTop: 34 },
});
