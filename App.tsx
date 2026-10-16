import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { DemoProvider } from './src/state/DemoProvider.tsx';
import { AppNavigator } from './src/navigation/AppNavigator.tsx';
import { WebPhoneFrame } from './src/components/WebPhoneFrame.tsx';

export default function App() {
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><DemoProvider><StatusBar style="dark"/><WebPhoneFrame><AppNavigator/></WebPhoneFrame></DemoProvider></SafeAreaProvider></GestureHandlerRootView>;
}
