# Starts your Android Studio AVD, then waits until the emulator is ready for Expo.
# Usage: .\scripts\start-android-emulator.ps1
#        .\scripts\start-android-emulator.ps1 -AvdName "TherapyHub_Pixel7"

param(
  [string]$AvdName = "TherapyHub_Pixel7"
)

$sdk = $env:ANDROID_HOME
if (-not $sdk) {
  $sdk = "$env:LOCALAPPDATA\Android\Sdk"
}

$emulator = Join-Path $sdk "emulator\emulator.exe"
$adb = Join-Path $sdk "platform-tools\adb.exe"

if (-not (Test-Path $emulator)) {
  Write-Error "Android emulator not found. Install Android Studio > SDK Manager > Android Emulator."
  exit 1
}

$running = & $adb devices | Select-String "emulator"
if ($running) {
  Write-Host "Emulator already running."
  exit 0
}

Write-Host "Starting AVD: $AvdName ..."
Start-Process -FilePath $emulator -ArgumentList "-avd", $AvdName -WindowStyle Normal

Write-Host "Waiting for emulator to boot (this can take 1-2 minutes)..."
& $adb wait-for-device | Out-Null

$max = 60
for ($i = 0; $i -lt $lt $max; $i++) {
  $booted = & $adb shell getprop sys.boot_completed 2>$null
  if ($booted -match "1") {
    Write-Host "Emulator ready."
    exit 0
  }
  Start-Sleep -Seconds 2
}

Write-Host "Emulator started but boot may still be in progress. Open Android Studio Device Manager if it does not appear."
