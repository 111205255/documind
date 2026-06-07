# Android emulator black screen (Windows)

If the emulator window stays **black** but `adb devices` shows `emulator-5554 device`, Android is usually running — the **display preview** is broken.

## Fix 1 — Switch graphics to Software (most common)

1. **Android Studio** → **Device Manager**
2. **⋮** or **Edit** (pencil) on **TherapyHub_Pixel7**
3. **Show Advanced Settings**
4. **Graphics acceleration** → **Software - GLES 2.0**
5. **Finish** → **Cold Boot Now** (dropdown on the AVD)

## Fix 2 — Cold boot

Device Manager → **⋮** on the AVD → **Cold Boot Now**

Wait 1–2 minutes until you see the Android home screen (not just a black panel).

## Fix 3 — Wipe data (if still stuck)

Device Manager → **⋮** → **Wipe Data** → start the emulator again.

## Fix 4 — Wake the display

With the emulator focused, press **Power** in the emulator toolbar once (sleep/wake).

Or in PowerShell:

```powershell
& "$env:ANDROID_HOME\platform-tools\adb.exe" shell input keyevent KEYCODE_WAKEUP
```

## After the home screen appears

1. Keep `npm run start:clear` running in `apps/mobile`
2. Press **`a`** in that terminal, **or** open **Expo Go** on the emulator and enter:

   `exp://10.156.143.121:8081`

   (Use the URL shown in your Metro terminal if different.)

## Still black?

Create a new AVD: **Pixel 7**, **API 34**, **Google Play** image, Graphics = **Software**.
