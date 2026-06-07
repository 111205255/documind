# DocuMind + Android Studio

Your PC already has the Android SDK at:

`C:\Users\Asus\AppData\Local\Android\Sdk`

Detected emulator: **TherapyHub_Pixel7**

---

## Expo Go (SDK 54)

This project uses **Expo SDK 54**, which matches **Expo Go from the Play Store** — good for demos on emulator or a colleague’s phone.

---

## Option A — Expo Go on emulator (fastest for UI work / demos)

### 1. Start the emulator

**From Android Studio**

1. Open **Android Studio**
2. **More Actions** → **Virtual Device Manager** (or **Tools → Device Manager**)
3. Click **Play** ▶ on **TherapyHub_Pixel7**
4. Wait until the phone home screen appears

**From terminal**

```powershell
cd C:\Users\Asus\Projects\documind\apps\mobile
npm run android:emulator
```

### 2. Run DocuMind

In a **second** terminal (keep Metro running if `npm start` is already open):

```powershell
cd C:\Users\Asus\Projects\documind\apps\mobile
npm run android
```

Or: if `npm start` is running, press **`a`** in that terminal.

Expo installs **Expo Go** on the emulator on first run, then opens DocuMind.

---

## Option B — Open native project in Android Studio

Use when you need native modules, signing, or Play Store builds.

```powershell
cd C:\Users\Asus\Projects\documind\apps\mobile
npm run prebuild:android
```

Then in Android Studio: **File → Open** → select:

`C:\Users\Asus\Projects\documind\apps\mobile\android`

Run with the green **Run** button (pick **TherapyHub_Pixel7**).

Or from terminal:

```powershell
npm run android:native
```

---

## Troubleshooting

| Issue | Fix |
|--------|-----|
| `Cannot find module 'babel-preset-expo'` | Run `npm install` in `apps/mobile` (see `.npmrc`) |
| `Android Bundling failed` / `transformFile` | Run `npx expo install --fix` then `npm run start:clear` |
| `adb: no devices` | Start the emulator in Device Manager first |
| Expo can’t find SDK | Set `ANDROID_HOME` = `C:\Users\Asus\AppData\Local\Android\Sdk` (you already have this) |
| Wrong AVD name | Edit `scripts/start-android-emulator.ps1` or pass `-AvdName "Your_AVD_Name"` |
| Stuck on splash | In emulator Expo Go, shake device (Ctrl+M) → Reload |
| **Project incompatible with Expo Go** | Update Expo Go from Play Store, or run `npm run start:clear` and press **`a`** on the emulator |

### Check device is visible

```powershell
& "$env:ANDROID_HOME\platform-tools\adb.exe" devices
```

You should see `emulator-5554   device`.

---

## Daily workflow

1. Android Studio → start **TherapyHub_Pixel7**
2. `cd apps\mobile` → `npm start`
3. Press **`a`** → app opens in Expo Go on the emulator
