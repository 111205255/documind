# Sync Cursor Security Rules from matank001/cursor-security-rules
# Usage: .cursor/skills/cursor-security-rules/scripts/sync-rules.ps1 [-RulesDir <path>]

param(
    [string]$RulesDir = (Join-Path (git rev-parse --show-toplevel 2>$null) ".cursor/rules/cursor-security-rules")
)

$ErrorActionPreference = "Stop"
$upstream = "https://raw.githubusercontent.com/matank001/cursor-security-rules/main"

if (-not $RulesDir -or -not (Test-Path (Split-Path $RulesDir -Parent))) {
    $RulesDir = Join-Path $PSScriptRoot "..\..\..\rules\cursor-security-rules"
}

if (-not (Test-Path $RulesDir)) {
    New-Item -ItemType Directory -Path $RulesDir -Force | Out-Null
}

$files = @(
    "dangerous-flows.mdc",
    "path-traversal-prevention.mdc",
    "secure-dev-c.mdc",
    "secure-dev-c-sharp.mdc",
    "secure-dev-golang.mdc",
    "secure-dev-java.mdc",
    "secure-dev-node.mdc",
    "secure-dev-php.mdc",
    "secure-dev-python.mdc",
    "secure-dev-ruby.mdc",
    "secure-dev-rust.mdc",
    "secure-development-principles.mdc",
    "secure-mcp-usage.mdc",
    "secure-sql-usage.mdc",
    "ssrf-prevention.mdc",
    "xxe-prevention.mdc",
    "LICENSE"
)

Write-Host "Syncing to: $RulesDir"
foreach ($file in $files) {
    $url = "$upstream/$file"
    $dest = Join-Path $RulesDir $file
    Invoke-WebRequest -Uri $url -OutFile $dest
    Write-Host "  OK $file"
}

Write-Host "Done. Reload Cursor window to pick up rule changes."
