# Deploy DocuMind API to Fly.io (permanent cloud host)
# Prerequisites: flyctl auth login (one time)
# Run: .\backend\deploy-fly.ps1

$ErrorActionPreference = "Stop"
$Backend = $PSScriptRoot
$Root = Split-Path $Backend -Parent
$Flyctl = Join-Path $env:USERPROFILE '.fly\bin\flyctl.exe'

if (-not (Test-Path $Flyctl)) {
    Write-Host "Installing flyctl..." -ForegroundColor Yellow
    $ProgressPreference = "SilentlyContinue"
    iwr https://fly.io/install.ps1 -useb | iex
}

if (-not (Test-Path $Flyctl)) {
    Write-Host "flyctl not found. Install from https://fly.io/docs/hands-on/install-flyctl/" -ForegroundColor Red
    exit 1
}

& $Flyctl auth whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to Fly.io. Run:" -ForegroundColor Yellow
    Write-Host ('  & "' + $Flyctl + '" auth login')
    Write-Host "Then run this script again."
    exit 1
}

$envFile = Join-Path $Backend '.env'
if (-not (Test-Path $envFile)) {
    Write-Host "Missing backend\.env - copy env.example and set OPENAI_API_KEY." -ForegroundColor Red
    exit 1
}

$openaiLine = Get-Content $envFile | Where-Object { $_ -match '^OPENAI_API_KEY=' } | Select-Object -First 1
$openaiKey = ($openaiLine -replace '^OPENAI_API_KEY=', '').Trim()
if (-not $openaiKey) {
    Write-Host "OPENAI_API_KEY is empty in backend\.env" -ForegroundColor Red
    Write-Host "Edit the file: notepad backend\.env" -ForegroundColor Yellow
    Write-Host "Put your key on the OPENAI_API_KEY= line (do NOT paste it in the terminal as a command)."
    exit 1
}

Push-Location $Backend

Write-Host "Deploying documind-api to Fly.io..." -ForegroundColor Cyan
$launchOut = & $Flyctl launch --yes --copy-config --name documind-api --region bom --no-deploy 2>&1 | Out-String
if ($launchOut -match 'payment information|credit card|billing') {
    Write-Host ""
    Write-Host "Fly.io needs a credit card on your account before first deploy." -ForegroundColor Red
    Write-Host "Add billing: https://fly.io/dashboard/personal/billing" -ForegroundColor Yellow
    Write-Host "Or use Render (free, no card): .\backend\deploy-render.ps1" -ForegroundColor Yellow
    Pop-Location
    exit 1
}
& $Flyctl secrets set OPENAI_API_KEY=$openaiKey --stage
$cors = 'https://documind-beige.vercel.app,https://documind-app-two.vercel.app,http://localhost:3000'
& $Flyctl secrets set CORS_ORIGINS=$cors --stage
$deployOut = & $Flyctl deploy --ha=false 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) {
    Write-Host $deployOut -ForegroundColor Red
    if ($deployOut -match 'payment information|credit card|billing|unauthorized') {
        Write-Host "Try Render instead: .\backend\deploy-render.ps1" -ForegroundColor Yellow
    }
    Pop-Location
    exit 1
}

$statusJson = & $Flyctl status --json 2>$null
$hostname = 'documind-api.fly.dev'
if ($statusJson) {
    $status = $statusJson | ConvertFrom-Json
    if ($status.Hostname) { $hostname = $status.Hostname }
}
$apiUrl = "https://$hostname"

Write-Host ""
Write-Host "Deployed: $apiUrl" -ForegroundColor Green
& $Flyctl curl '/api/v1/health' 2>$null

Pop-Location

Write-Host ""
Write-Host "Updating Vercel and redeploying..." -ForegroundColor Cyan
$finishScript = Join-Path $Root 'scripts\finish-production.ps1'
& $finishScript -ApiUrl $apiUrl
