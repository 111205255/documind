# Set Google Gemini API key in backend\.env
# Usage: .\backend\set-gemini-key.ps1
# Get a key: https://aistudio.google.com/apikey

$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $PSScriptRoot "env.example") $envFile
}

$key = Read-Host "Paste your Google AI API key (from aistudio.google.com/apikey)"
$key = $key.Trim()
if (-not $key) {
    Write-Host "No key entered." -ForegroundColor Red
    exit 1
}

$lines = Get-Content $envFile
$updated = $false
$newLines = foreach ($line in $lines) {
    if ($line -match "^GOOGLE_API_KEY=") {
        $updated = $true
        "GOOGLE_API_KEY=$key"
    } elseif ($line -match "^OPENAI_API_KEY=") {
        continue
    } else {
        $line
    }
}
if (-not $updated) {
    $newLines = @("GOOGLE_API_KEY=$key") + $newLines
}
Set-Content -Path $envFile -Value $newLines -Encoding UTF8
Write-Host "Saved to backend\.env — restart backend or redeploy Render." -ForegroundColor Green
