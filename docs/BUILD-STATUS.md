# Build status

The [acceptance audit](ACCEPTANCE-AUDIT.md) maps each assignment criterion to current evidence and remaining device checks.

## Completed functionality

- Guest welcome, Home dashboard, validated and locally stored vehicle edits, and five-tab navigation with bottom safe area spacing. The working app name and tagline are read from `src/config/brand.json`; static documents and the printable card require a text update if rebranded.
- Native entry point imports gesture handler first; the app tree is wrapped in `GestureHandlerRootView` for stack gestures.
- Guided symptom form and preliminary mock diagnostic guidance with safety messaging.
- Fictional AED 1,100 AC quotation, item explanations, a clear note that diagnostic test evidence is absent, deterministic 65/100 documentation score and generated mechanic question.
- Three fictional garage profiles, four sort modes and detailed Trust Passports. Comparison is available without a report; approval requires a completed AC report for the sample Corolla.
- Quote Lock base approval, separate AED 300 additional-work decision and local approval history. The fixed classroom repair waits for that decision before timeline progress or collection.
- Simulated six-stage tracking, completed repair invoice, vehicle-specific history, active warranty reminders and Reset Demo action. Saved state is checked before restoration.
- A5 printable Repair Audit Card and INE 301 Section 7, matrix, demo script and slide 11–12 source content.

## Simulated functionality

- AI guidance and quotation analysis use fixed mock services. Real files are never extracted or analyzed.
- Garages, ratings, reviews, business verification indicators, prices, repair updates, invoices and warranties are fictional examples.
- Quote Lock stores local customer authorization; it does not charge money or enforce an agreement with a garage.

## Unimplemented or unavailable functionality

- No real AI, garage backend, live repair updates, payments, real trade-licence verification or Arabic translation.
- English UI copy is implemented, but only shared trust and safety text is centralized in `src/i18n/en.ts`; remaining screen strings must be extracted before full localization or RTL support.
- The fixed AC quotations are for the 2022 Toyota Corolla. Other selected vehicles can view the sample comparison but cannot authorize those quotations.
- Expo media, document and clipboard packages are installed and wired through their public APIs. Picker result cancellation is covered by a logic test; opening the native picker, cancelling its UI and copying to clipboard still need iOS and Android device checks. The sample issue and quote work without file selection.

## Checks performed

| Check | Result |
| --- | --- |
| `npm install --offline` from a clean dependency tree | Completed using locally cached versions; `package-lock.json` exists. Transitive overrides were needed because the package registry was inaccessible. |
| `npm run typecheck` | Passed after connecting shared UI and Profile branding to `src/config/brand.json`. |
| `npm test` | Fifteen logic tests passed, including the completed-report approval guard, picker cancellation and file normalization, the additional-work decision gate, fixed-vehicle quote guards, saved-state restoration, vehicle form validation, warning signs, quote message content and warranty expiry. |
| `EXPO_OFFLINE=1 npx expo config --type public --json` | Passed; resolved RepairLens name, portrait orientation, and iOS/Android identifiers. |
| Static navigation audit | Every literal screen navigation destination was registered. This does not prove a phone walkthrough. |
| `EXPO_OFFLINE=1 npx expo export --platform all --max-workers 1 --output-dir /tmp/repairlens-export-check` | Passed after initial native picker and clipboard integration: iOS, Android and web bundles were written. The later picker result helper, report guard and branding change have not been rebundled. This does not prove app startup or device behavior. |
| `npm ls expo-clipboard expo-document-picker expo-image-picker --depth=0` | Passed: 8.0.8, 14.0.8 and 17.0.11 are installed. |
| `npm install --offline` on 14 October 2026 | Failed with `ENOTCACHED` despite the three packages already being present in `node_modules` and the lockfile; the registry host is unreachable here. |
| `npm run check:expo` | Fails: Expo SDK 54 expects `react-native-gesture-handler` ~2.28.0, while only 2.30.0 was in the local cache. |
| `CI=1 npm start` | Startup could not be verified in this sandbox. A direct Node TCP bind returned `EPERM`; Expo's port search exited. The server was stopped. |
| Device or simulator walkthrough | Not performed. CoreSimulatorService was unavailable, `adb` was absent and no phone was connected. |

## Known limitations and next checks

- A static Expo web export is available in `dist/`. `vercel.json` defines the Git-connected Vercel build settings. The Vercel deployment and phone browser behavior have not been verified, and hosting does not resolve the SDK 54 versus SDK 57 Expo Go mismatch.

Rechecked on 14 October 2026: `npm run check:expo` still flags gesture-handler 2.30.0 against the SDK 54 expected ~2.28.0, a minimal local Node listener still returns `EPERM`, and the npm registry host still does not resolve. The offline cache contains only gesture-handler 2.30.0. No Expo server was started.

Rechecked on 13 October 2026: the npm registry host still did not resolve (`curl` exit 6), a minimal Node listener on `127.0.0.1` returned `EPERM`, `xcrun simctl` could not connect to CoreSimulatorService, and the offline npm cache held gesture-handler 2.30.0. Media, document and clipboard packages are now present in the workspace. No Expo or simulator process was started during this check.

On 14 October 2026, the native picker and clipboard packages were found installed and bundled successfully. The project's native runtime remains unverified. The npm registry host did not resolve from this sandbox, and the documentation search service returned HTTP 403. Expo SDK 54's local bundled module list specifies expo-clipboard ~8.0.8, expo-document-picker ~14.0.8, expo-image-picker ~17.0.10 and react-native-gesture-handler ~2.28.0. On a machine that permits local TCP listening, run `npm start` and walk through the exact steps in `docs/CLASSROOM-DEMO.md` on both iOS and Android. Verify the installed picker and clipboard controls on a phone before claiming they work there. Fix the gesture-handler version mismatch when a compatible package can be obtained. Confirm persistence and reset on a device. Sample ratings and warranty reminders must never be presented as real-world claims.

## Future improvements

Replace mock services behind their interfaces only after real data, consent and verification workflows exist. Add Arabic localization, tested file extraction and garage updates when the product scope expands.
