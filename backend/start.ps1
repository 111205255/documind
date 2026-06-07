# Start DocuMind API on Windows (PowerShell)
Set-Location $PSScriptRoot

if (-not (Test-Path ".env")) {
    Copy-Item "env.example" ".env"
    Write-Host "Created .env — add your OPENAI_API_KEY, then run again." -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content ".env" -Raw
if ($envContent -match "OPENAI_API_KEY=\s*$" -or $envContent -match "OPENAI_API_KEY=\r?\n") {
    Write-Host "OPENAI_API_KEY is empty in backend\.env" -ForegroundColor Yellow
    Write-Host "Edit backend\.env and paste your key on the OPENAI_API_KEY= line."
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
