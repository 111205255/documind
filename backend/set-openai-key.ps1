# Set OpenAI key in backend\.env (PowerShell-safe — do not use OPENAI_API_KEY=... in the terminal)
# Usage: .\backend\set-openai-key.ps1

$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $PSScriptRoot "env.example") $envFile
}

$key = Read-Host "Paste your OpenAI API key (starts with sk-)"
$key = $key.Trim()
if (-not $key.StartsWith("sk-")) {
    Write-Host "That does not look like an OpenAI key." -ForegroundColor Red
    exit 1
}

$lines = Get-Content $envFile
$updated = $false
$newLines = foreach ($line in $lines) {
    if ($line -match "^OPENAI_API_KEY=") {
        $updated = $true
        "OPENAI_API_KEY=$key"
    } else {
        $line
    }
}
if (-not $updated) {
    $newLines = @("OPENAI_API_KEY=$key") + $newLines
}
Set-Content -Path $envFile -Value $newLines -Encoding UTF8
Write-Host "Saved to backend\.env — now run: .\backend\deploy-fly.ps1" -ForegroundColor Green
