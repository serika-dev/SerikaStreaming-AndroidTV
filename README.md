# Serika Streaming – Android TV

Android TV wrapper app for [Serika Streaming](https://streaming.serika.dev).

## Overview

Expo/React Native app using a WebView to load the Serika Streaming website. It:

- Shows a loading screen while the site initialises
- Navigates to `/login?platform=androidtv` so the website sets `X-Serika-Platform: android-tv` and hides Chromecast UI
- Handles the hardware Back button (go back in history or exit)
- Keeps the screen awake during use

## Project Structure

```
├── App.tsx                  # Root component – loading screen + WebView
├── index.ts                 # Expo entry point
├── app.json                 # Expo / EAS config
├── eas.json                 # EAS Build profiles (APK)
├── plugins/
│   └── withAndroidTV.js     # Config plugin: adds leanback uses-feature
├── assets/
│   └── icon.png             # App icon
└── .env.example             # Environment variable reference
```

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [EAS CLI](https://docs.expo.dev/eas/): `npm install -g eas-cli`
- An [Expo](https://expo.dev/) account

## Setup

```bash
npm install
eas login
```

## Building the APK

```bash
# Production APK (uploaded to EAS, downloadable from dashboard)
eas build --platform android --profile production

# Or via the npm script
npm run build:apk
```

The first build will prompt you to create a new keystore or use an existing one. EAS manages this automatically.

## Sideloading to an Android TV

1. Download the `.apk` from your [EAS dashboard](https://expo.dev)
2. Transfer to a USB drive or use `adb`
3. Via ADB:
   ```bash
   adb connect <tv-ip>:5555
   adb install SerikaStreaming.apk
   ```
4. The app will appear in the TV's **Apps** row under the Leanback launcher

## Configuration

The target URL is hardcoded in `App.tsx`:

```ts
const WEBSITE_URL = 'https://streaming.serika.dev';
```

## License

See [LICENSE](LICENSE).
