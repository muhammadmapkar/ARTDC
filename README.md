# RepairLens

RepairLens is an interactive React Native mobile prototype for INE 301 Assignment 1. It follows a fictional Dubai car owner from an AC symptom through quotation review, garage comparison, customer approval and a completed repair record. The design uses plain language and labels every simulated claim.

## Start

Requirements: Node.js 20 or newer, npm and an iOS or Android phone with an Expo Go version compatible with this project's Expo SDK 54.

```sh
npm install
npm start
```

### Android Expo Go SDK version

This project uses Expo SDK 54. If Expo Go says it is for SDK 57, install the Android Expo Go build for **SDK 54** from [Expo's official download page](https://expo.dev/go), selecting SDK 54 and Android. Android may require uninstalling the newer Expo Go before installing an older build. Then run `npm start -- -c` and scan the new QR code on the same Wi-Fi. Changing `sdkVersion` in app config alone will not make an SDK 54 app compatible with Expo Go 57; that requires a full dependency migration.

### Vercel phone browser preview

Make sure the latest project files are in the GitHub repository, including `package.json`, `package-lock.json`, `src/`, `App.tsx` and `vercel.json`. In Vercel, import the GitHub repository, keep the root directory at the repository root, and deploy. `vercel.json` sets `npm run export:web` as the build command and `dist` as the output directory. Open the resulting production `.vercel.app` URL in a phone browser; Expo Go is not involved. Generate a new QR code for the Vercel URL after deployment. Use the [phone QA and presentation guide](docs/PHONE-QA-AND-PRESENTATION.md) for exact taps and a four-minute script.

Scan the QR code with the iPhone camera or Expo Go on Android. Keep the computer and phone on the same network. If local discovery fails and network access is available, try `npx expo start --tunnel`. On a Mac with a working iOS simulator, use `npm run ios`; with a configured Android emulator, use `npm run android`. These device routes have not been verified in the current sandbox.

`npm start` launches Expo on the local network. Keep the phone and Mac on the same Wi-Fi, then scan the fresh QR code. The sample data and mock services require no backend after dependencies and app resources are installed.

## Classroom journey

Open as guest → select Toyota Corolla → use the sample AC issue → read preliminary guidance → inspect the AED 1,100 sample quotation → review the 65/100 documentation score → generate mechanic questions → compare three fictional garages → choose Harbour Auto Studio → approve its AED 950 confirmed quote → approve or decline the AED 300 additional request → advance simulated repair stages → collect → inspect the invoice in My Garage.

Reset through **Profile → Reset Demo → Reset demo**. The [classroom click script](docs/CLASSROOM-DEMO.md) gives exact steps.

## Project structure

```text
App.tsx                     Providers and status bar
src/navigation/             Bottom tabs and detail navigation
src/screens/                Customer journey screens
src/components/             Shared mobile UI
src/models/                 TypeScript data contracts
src/data/                   Fixed fictional vehicles, quotes and garages
src/services/               Mock guidance, quote, comparison and repair workflow
src/state/                  Pure demo transitions and AsyncStorage provider
src/design/                 Colors and spacing
src/i18n/                   Shared English copy; full localization remains future work
src/config/                 Working brand name
src/utils/                  Formatting helpers
tests/                      Business logic tests
docs/                       Assignment report, slides, demo script and status
repair-audit-card.html      Printable A5 checklist
```

## Prototype integrity

There is no real AI, garage integration, trade-licence verification, payment or document extraction. Prices are fictional AED examples, not verified Dubai market rates. Ratings, reviews, progress, evidence notes, invoices and warranties are simulated. Quote Lock records customer authorization locally and does not enforce a real agreement.

Expo media, document and clipboard packages are installed and connected through their public APIs. Their native behavior still needs a phone walkthrough. The sample journey remains usable without selecting a file, and the generated message can also be shared or selected manually. See [build status](docs/BUILD-STATUS.md) and the [acceptance audit](docs/ACCEPTANCE-AUDIT.md) for exact limitations and remaining checks.

## Checks

```sh
npm test
npm run typecheck
npm run export
```

Only report a device or simulator walkthrough after actually completing one.
