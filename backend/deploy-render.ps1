# Deploy DocuMind API on Render (free tier, no credit card)
# Run from repo root: .\backend\deploy-render.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Backend = $PSScriptRoot
$Gh = (Get-Command gh -ErrorAction SilentlyContinue)?.Source

Write-Host "DocuMind API - Render deploy" -ForegroundColor Cyan
Write-Host ""

# --- Check OpenAI key in backend/.env ---
$envFile = Join-Path $Backend '.env'
if (-not (Test-Path $envFile)) {
    Write-Host "Missing backend\.env - run .\backend\set-openai-key.ps1 first" -ForegroundColor Red
    exit 1
}
$openaiKey = ((Get-Content $envFile | Where-Object { $_ -match '^OPENAI_API_KEY=' } | Select-Object -First 1) -replace '^OPENAI_API_KEY=', '').Trim()
if (-not $openaiKey) {
    Write-Host "OPENAI_API_KEY is empty in backend\.env" -ForegroundColor Red
    exit 1
}

# --- Git commit (Render needs GitHub) ---
Push-Location $Root
$hasCommits = git rev-parse HEAD 2>$null
if (-not $hasCommits) {
    Write-Host "Creating initial git commit..." -ForegroundColor Yellow
    git add -A
    git commit -m "DocuMind: web, mobile, backend, Supabase migrations"
}

# --- GitHub push ---
if (-not $Gh) {
    $Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
}
if (-not (Test-Path $Gh)) {
    Write-Host "GitHub CLI (gh) not found. Install: winget install GitHub.cli" -ForegroundColor Red
    Pop-Location
    exit 1
}

& $Gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Log in to GitHub first:" -ForegroundColor Yellow
    Write-Host "  gh auth login"
    Pop-Location
    exit 1
}

$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "Creating GitHub repo and pushing..." -ForegroundColor Yellow
    & $Gh repo create documind --public --source=. --remote=origin --push --description "DocuMind AI document chat"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Could not create repo. Maybe documind already exists - run:" -ForegroundColor Yellow
        Write-Host '  gh repo create documind --public --source=. --remote=origin --push'
        Pop-Location
        exit 1
    }
} else {
    Write-Host "Pushing to $remoteUrl ..." -ForegroundColor Yellow
    git push -u origin HEAD 2>&1
}

$repoView = & $Gh repo view --json url -q .url 2>$null
if ($repoView) {
    Write-Host "GitHub repo: $repoView" -ForegroundColor Green
}

Pop-Location

Write-Host ""
Write-Host "=== Render dashboard (do these 4 steps) ===" -ForegroundColor Cyan
Write-Host "1. Open Blueprint import (browser will open)"
Write-Host "2. Connect GitHub repo: documind"
Write-Host "3. Render detects render.yaml at repo root - click Apply"
Write-Host "4. When prompted for OPENAI_API_KEY, paste the key from backend\.env"
Write-Host ""
Write-Host "After deploy finishes (~5-10 min), copy the service URL and run:"
Write-Host '  .\scripts\finish-production.ps1 -ApiUrl "https://documind-api.onrender.com"'
Write-Host ""
Write-Host "Your OpenAI key (copy for Render dashboard):" -ForegroundColor DarkGray
Write-Host $openaiKey
Write-Host ""

Start-Process "https://dashboard.render.com/blueprints/new"
