import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../design/tokens.ts';
import { useDemo } from '../state/DemoProvider.tsx';
import { Icon, Loading } from '../components/ui.tsx';
import { WelcomeScreen } from '../screens/WelcomeScreen.tsx';
import { HomeScreen } from '../screens/HomeScreen.tsx';
import { VehicleScreen } from '../screens/VehicleScreen.tsx';
import { ReportScreen } from '../screens/ReportScreen.tsx';
import { GuidanceScreen } from '../screens/GuidanceScreen.tsx';
import { AnalyzeScreen } from '../screens/AnalyzeScreen.tsx';
import { QuoteScreen } from '../screens/QuoteScreen.tsx';
import { ProtectionScreen } from '../screens/ProtectionScreen.tsx';
import { GaragesScreen } from '../screens/GaragesScreen.tsx';
import { TrustScreen } from '../screens/TrustScreen.tsx';
import { QuoteLockScreen } from '../screens/QuoteLockScreen.tsx';
import { TrackingScreen } from '../screens/TrackingScreen.tsx';
import { MyGarageScreen } from '../screens/MyGarageScreen.tsx';
import { RecordScreen } from '../screens/RecordScreen.tsx';
import { ProfileScreen } from '../screens/ProfileScreen.tsx';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const tabIcons: Record<string, React.ComponentProps<typeof Icon>['name']> = { Home: 'home-outline', Analyze: 'scan-outline', Garages: 'business-outline', 'My Garage': 'car-outline', Profile: 'person-circle-outline' };
function MainTabs() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 6);
  return <Tabs.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.blue, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginBottom: 5 }, tabBarStyle: { height: 64 + bottomPadding, paddingTop: 7, paddingBottom: bottomPadding, backgroundColor: colors.white, borderTopColor: colors.line }, tabBarIcon: ({ color, size }) => <Icon name={tabIcons[route.name]} color={color} size={Math.min(size, 24)} /> })}>
    <Tabs.Screen name="Home" component={HomeScreen}/><Tabs.Screen name="Analyze" component={AnalyzeScreen}/><Tabs.Screen name="Garages" component={GaragesScreen}/><Tabs.Screen name="My Garage" component={MyGarageScreen}/><Tabs.Screen name="Profile" component={ProfileScreen}/>
  </Tabs.Navigator>;
}
export function AppNavigator() {
  const { state, ready } = useDemo();
  if (!ready) return <Loading/>;
  const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.blue } };
  return <NavigationContainer theme={theme}>
    {state.onboarded ? <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="Tabs" component={MainTabs}/><Stack.Screen name="Vehicle" component={VehicleScreen}/><Stack.Screen name="Report" component={ReportScreen}/><Stack.Screen name="Guidance" component={GuidanceScreen}/><Stack.Screen name="Quote" component={QuoteScreen}/><Stack.Screen name="Protection" component={ProtectionScreen}/><Stack.Screen name="Trust" component={TrustScreen}/><Stack.Screen name="QuoteLock" component={QuoteLockScreen}/><Stack.Screen name="Tracking" component={TrackingScreen}/><Stack.Screen name="Record" component={RecordScreen}/>
    </Stack.Navigator> : <WelcomeScreen/>}
  </NavigationContainer>;
}
