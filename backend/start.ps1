# Start DocuMind API on Windows (PowerShell)
Set-Location $PSScriptRoot

if (-not (Test-Path ".env")) {
    Copy-Item "env.example" ".env"
    Write-Host "Created .env — add your GOOGLE_API_KEY, then run again." -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content ".env" -Raw
if ($envContent -match "GOOGLE_API_KEY=\s*$" -or $envContent -match "GOOGLE_API_KEY=\r?\n") {
    Write-Host "GOOGLE_API_KEY is empty in backend\.env" -ForegroundColor Yellow
    Write-Host "Get a key: https://aistudio.google.com/apikey"
    Write-Host "Or run: .\set-gemini-key.ps1"
    exit 1
}

Write-Host "Starting DocuMind API at http://localhost:8000 ..." -ForegroundColor Green
Write-Host "Health check: http://localhost:8000/api/v1/health"
Write-Host "API docs:     http://localhost:8000/docs"
Write-Host ""

if (Test-Path ".venv\Scripts\python.exe") {
    & .\.venv\Scripts\python.exe run.py
} else {
    python run.py
}
