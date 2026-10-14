import type { ExpoConfig } from 'expo/config';
import BRAND from './src/config/brand.json';
const config: ExpoConfig = {
  name: BRAND.name, slug: 'repairlens', version: '1.0.0', orientation: 'portrait',
  userInterfaceStyle: 'light', scheme: 'repairlens',
  ios: { supportsTablet: true, bundleIdentifier: 'edu.ine301.repairlens' },
  android: { package: 'edu.ine301.repairlens' },
  web: { bundler: 'metro' },
};
export default config;
