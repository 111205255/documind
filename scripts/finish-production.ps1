# Point Vercel at a permanent API URL and redeploy web + mobile.
# Usage: .\scripts\finish-production.ps1 -ApiUrl "https://documind-api.fly.dev"

param(
    [Parameter(Mandatory = $true)]
    [string]$ApiUrl
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$ApiUrl = $ApiUrl.Trim().TrimEnd('/')

# Fix common typo: -ApiUrl"https://..." with no space
if ($ApiUrl -match '^-ApiUrl\s+') {
    $ApiUrl = ($ApiUrl -replace '^-ApiUrl\s+', '').Trim()
}
if ($ApiUrl -notmatch '^https?://') {
    Write-Host "Invalid API URL: $ApiUrl" -ForegroundColor Red
    Write-Host 'Use: .\scripts\finish-production.ps1 -ApiUrl "https://documind-api-drsq.onrender.com"' -ForegroundColor Yellow
    Write-Host "Note the space after -ApiUrl" -ForegroundColor Yellow
    exit 1
}

Write-Host "API URL: $ApiUrl" -ForegroundColor Cyan

try {
    $health = Invoke-RestMethod -Uri "$ApiUrl/api/v1/health" -TimeoutSec 30
    if ($health.status -ne 'ok') { throw "Health check returned $($health.status)" }
    Write-Host "Health OK" -ForegroundColor Green
} catch {
    Write-Host "Warning: health check failed ($_) - continuing anyway." -ForegroundColor Yellow
}

function Set-VercelEnv($Name, $Value) {
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'SilentlyContinue'
    & vercel env rm $Name production --yes *> $null
    $add = $Value | & vercel env add $Name production --yes 2>&1
    $ErrorActionPreference = $prev
    if ($LASTEXITCODE -ne 0) {
        Write-Host $add
        throw "Failed to set Vercel env $Name"
    }
    Write-Host "Set $Name on Vercel" -ForegroundColor Green
}

$prevEap = $ErrorActionPreference
$ErrorActionPreference = 'SilentlyContinue'

Push-Location (Join-Path $Root 'apps\web')
Set-VercelEnv 'RAG_API_URL' $ApiUrl
& vercel --prod --yes 2>&1 | Write-Host
if ($LASTEXITCODE -ne 0) { throw 'Web Vercel deploy failed' }
Pop-Location

Push-Location (Join-Path $Root 'apps\mobile')
Set-VercelEnv 'EXPO_PUBLIC_API_URL' $ApiUrl
& vercel --prod --yes 2>&1 | Write-Host
if ($LASTEXITCODE -ne 0) { throw 'Mobile Vercel deploy failed' }
Pop-Location

$ErrorActionPreference = $prevEap

Write-Host ""
Write-Host "Production complete (no local PC required for AI)." -ForegroundColor Green
Write-Host "  Web:    https://documind-beige.vercel.app"
Write-Host "  Mobile: https://documind-app-two.vercel.app"
Write-Host "  API:    $ApiUrl"
