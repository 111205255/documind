# Point Vercel at a permanent API URL and redeploy web + mobile.
# Usage: .\scripts\finish-production.ps1 -ApiUrl "https://documind-api.fly.dev"

param(
    [Parameter(Mandatory = $true)]
    [string]$ApiUrl
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$ApiUrl = $ApiUrl.TrimEnd('/')

Write-Host "API URL: $ApiUrl" -ForegroundColor Cyan

try {
    $health = Invoke-RestMethod -Uri "$ApiUrl/api/v1/health" -TimeoutSec 30
    if ($health.status -ne 'ok') { throw "Health check returned $($health.status)" }
    Write-Host "Health OK" -ForegroundColor Green
} catch {
    Write-Host "Warning: health check failed ($_) - continuing anyway." -ForegroundColor Yellow
}

Push-Location (Join-Path $Root 'apps\web')
vercel env rm RAG_API_URL production --yes 2>$null
echo $ApiUrl | vercel env add RAG_API_URL production --yes
vercel --prod --yes
Pop-Location

Push-Location (Join-Path $Root 'apps\mobile')
vercel env rm EXPO_PUBLIC_API_URL production --yes 2>$null
echo $ApiUrl | vercel env add EXPO_PUBLIC_API_URL production --yes
vercel --prod --yes
Pop-Location

Write-Host ""
Write-Host "Production complete (no local PC required for AI)." -ForegroundColor Green
Write-Host "  Web:    https://documind-beige.vercel.app"
Write-Host "  Mobile: https://documind-app-two.vercel.app"
Write-Host "  API:    $ApiUrl"
