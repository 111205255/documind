# Keeps DocuMind RAG API reachable from Vercel while backend is not on Render/Fly.
# Run from repo root: .\scripts\keep-api-alive.ps1
# Leave this window open. Production AI stops when you close it.

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Backend = Join-Path $Root "backend"

Write-Host "DocuMind — keep API alive for production" -ForegroundColor Cyan
Write-Host ""

# 1) Backend on :8000
$health = $null
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -TimeoutSec 2
} catch {}

if (-not $health) {
    Write-Host "Starting backend in a new window..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Backend'; .\start.ps1"
    Write-Host "Waiting for backend..." -ForegroundColor Yellow
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 2
        try {
            $health = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -TimeoutSec 2
            if ($health.status -eq "ok") { $ready = $true; break }
        } catch {}
    }
    if (-not $ready) {
        Write-Host "Backend did not start. Check backend\.env has OPENAI_API_KEY." -ForegroundColor Red
        exit 1
    }
}
Write-Host "Backend OK: http://localhost:8000" -ForegroundColor Green

# 2) Public tunnel
Write-Host "Starting localtunnel on port 8000..." -ForegroundColor Yellow
$tunnelJob = Start-Job {
    npx --yes localtunnel --port 8000 2>&1
}

$tunnelUrl = $null
for ($i = 0; $i -lt 25; $i++) {
    Start-Sleep -Seconds 2
    $out = Receive-Job $tunnelJob -ErrorAction SilentlyContinue
    if ($out) {
        $line = ($out | Where-Object { $_ -match "your url is:" } | Select-Object -Last 1)
        if ($line -match "https://[^\s]+") {
            $tunnelUrl = $Matches[0].Trim()
            break
        }
    }
}

if (-not $tunnelUrl) {
    Write-Host "Could not get tunnel URL. Check network and retry." -ForegroundColor Red
    Stop-Job $tunnelJob -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "Tunnel OK: $tunnelUrl" -ForegroundColor Green

# 3) Verify tunnel → backend
try {
    $remote = Invoke-RestMethod -Uri "$tunnelUrl/api/v1/health" -Headers @{ "Bypass-Tunnel-Reminder" = "true" } -TimeoutSec 15
    if ($remote.status -ne "ok") { throw "bad health" }
    Write-Host "Remote health OK" -ForegroundColor Green
} catch {
    Write-Host "Tunnel health check failed: $_" -ForegroundColor Red
    exit 1
}

# 4) Update Vercel env (optional but recommended)
$updateVercel = Read-Host "Update Vercel RAG_API_URL + EXPO_PUBLIC_API_URL to this tunnel? (y/n)"
if ($updateVercel -eq "y") {
    Push-Location (Join-Path $Root "apps\web")
    echo $tunnelUrl | vercel env rm RAG_API_URL production --yes 2>$null
    echo $tunnelUrl | vercel env add RAG_API_URL production --yes
    Pop-Location
    Push-Location (Join-Path $Root "apps\mobile")
    echo $tunnelUrl | vercel env rm EXPO_PUBLIC_API_URL production --yes 2>$null
    echo $tunnelUrl | vercel env add EXPO_PUBLIC_API_URL production --yes
    Pop-Location
    Write-Host "Vercel env updated. Run: cd apps/web; vercel --prod" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Production AI is live while this script runs." -ForegroundColor Cyan
Write-Host "  Web:    https://documind-beige.vercel.app"
Write-Host "  Mobile: https://documind-app-two.vercel.app"
Write-Host "  API:    $tunnelUrl"
Write-Host ""
Write-Host "Press Ctrl+C to stop the tunnel (backend window stays open)." -ForegroundColor DarkGray

try {
    while ($true) { Start-Sleep -Seconds 60 }
} finally {
    Stop-Job $tunnelJob -ErrorAction SilentlyContinue
    Remove-Job $tunnelJob -ErrorAction SilentlyContinue
}
