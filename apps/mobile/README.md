# DocuMind — Native Mobile App

**Expo (React Native)** — real iOS & Android app, not a mobile web wrapper.

The Next.js app in `apps/web` remains for web/admin; this app is for **Expo Go**, emulators, and store builds.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- **Android:** [Android Studio](https://developer.android.com/studio) emulator, or a physical device
- **iOS (Mac only):** Xcode simulator, or iPhone with [Expo Go](https://expo.dev/go)
- **Quick preview:** **Expo Go** from the app store (SDK 54)

## Run with Android Studio emulator (recommended on your PC)

You have SDK + AVD **TherapyHub_Pixel7** configured. Full guide: [docs/android-studio.md](docs/android-studio.md)

**Step 1 — Start emulator** (Android Studio → Device Manager → ▶ Play on Pixel 7)

Or:

```powershell
cd C:\Users\Asus\Projects\documind\apps\mobile
npm run android:emulator
```

**Step 2 — Run app** (new terminal if needed):

```powershell
cd C:\Users\Asus\Projects\documind\apps\mobile
npm run android
```

If Metro is already running (`npm start`), press **`a`** instead.

**Step 3 (optional) — Open Gradle project in Android Studio** after `npm run prebuild:android`, then open the `android/` folder.

## Expo Go (SDK 54)

This project targets **Expo SDK 54** so it runs in **Expo Go from the Play Store / App Store** — ideal for demos to HR or stakeholders.

Install [Expo Go](https://expo.dev/go) on a phone (same Wi‑Fi as your PC), then `npm start` and scan the QR code.

## Run on a physical phone

```powershell
npm start
```

Scan the QR code with **Expo Go** (same Wi‑Fi as PC).

Use `;` not `&&` between commands in PowerShell 5.

## Screens (ported from Figma)

| Route | Screen |
|-------|--------|
| `/` | Splash |
| `/login` | Login + Google CTA |
| `/home` | Documents library |
| `/home?empty` | Empty documents |
| FAB on home | **05** Add document sheet |
| `/document/hr-policy-2026/processing` | **06** Processing |
| `/chat/hr-policy-2026` | **08** Active chat |
| `/chat/hr-policy-2026?mode=empty` | **07** Chat empty |
| `/chat/hr-policy-2026?mode=thinking` | **10** AI thinking |
| Tap citation tag in chat | **09** Citation sheet |
| Long-press document on home | **11** Document details |
| Chat icon on home | **12** Chat history |
| Avatar on home | **13** Settings (dark mode toggle) |
| ⋯ menu in chat | **14** Share sheet |
| Settings → dev link | **15** Offline / connection |

## Project structure

```
app/           Expo Router screens
components/    Shared UI
theme/         Light/dark colors (system)
data/          Demo documents
lib/           Constants
```

## Builds (later)

```powershell
npx expo prebuild
npx expo run:android
# npx expo run:ios   # macOS only
```
