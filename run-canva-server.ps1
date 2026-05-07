$envFile = Join-Path $PSScriptRoot "canva-local.env"

if (!(Test-Path -LiteralPath $envFile)) {
  Write-Host "Missing canva-local.env. Create it with CANVA_CLIENT_ID, CANVA_CLIENT_SECRET, and CANVA_REDIRECT_URI."
  exit 1
}

Get-Content -LiteralPath $envFile | ForEach-Object {
  if ($_ -match "^\s*#" -or $_ -notmatch "=") { return }
  $parts = $_ -split "=", 2
  [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
}

$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$nodeCommand = if (Test-Path -LiteralPath $bundledNode) { $bundledNode } else { "node" }

Write-Host "Using Node: $nodeCommand"
Write-Host "Starting local server..."
Write-Host "Leave this window open while using Canva API features."
Write-Host ""

& $nodeCommand .\canva-api-server.js
