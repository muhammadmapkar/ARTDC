import React, { createContext, useContext } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors } from '../design/tokens.ts';

const PhoneViewportContext = createContext<number | null>(null);
export function usePhoneViewportHeight() { return useContext(PhoneViewportContext); }

/** Desktop web presentation shell. Native apps and phone browsers stay full screen. */
export function WebPhoneFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'web' || width < 650) {
    return <PhoneViewportContext.Provider value={height}><View style={styles.fullScreen}>{children}</View></PhoneViewportContext.Provider>;
  }

  const phoneHeight = Math.min(844, Math.max(520, height - 70));
  const phoneWidth = Math.min(400, Math.round(phoneHeight * 0.49));
  return <View style={styles.desktopCanvas}>
    <View style={[styles.phone, { width: phoneWidth, height: phoneHeight }]}>
      <PhoneViewportContext.Provider value={phoneHeight - 16}><View style={styles.screen}>{children}</View></PhoneViewportContext.Provider>
    </View>
    <Text style={styles.caption}>REPAIRLENS · INTERACTIVE PROTOTYPE</Text>
  </View>;
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, minHeight: 0, backgroundColor: colors.background },
  desktopCanvas: { flex: 1, minHeight: 0, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: '#EAF0F8' },
  phone: { borderWidth: 8, borderColor: colors.navy, borderRadius: 40, overflow: 'hidden', backgroundColor: colors.background, shadowColor: colors.navy, shadowOpacity: 0.22, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 16 },
  screen: { flex: 1, minHeight: 0, overflow: 'hidden', backgroundColor: colors.background },
  caption: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
});
