$envFile = Join-Path $PSScriptRoot "caption_local.env"
if (!(Test-Path -LiteralPath $envFile)) {
  Write-Host "Missing caption_local.env. Copy caption_local.env.example to caption_local.env and add OPENAI_API_KEY."
  exit 1
}
Get-Content -LiteralPath $envFile | ForEach-Object {
  if ($_ -match "^\s*#" -or $_ -notmatch "=") { return }
  $parts = $_ -split "=", 2
  [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
}
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$nodeCommand = if (Test-Path -LiteralPath $bundledNode) { $bundledNode } else { "node" }
Write-Host "Starting VA Command Center Caption API Server..."
Write-Host "Leave this window open while generating captions."
& $nodeCommand .\caption_api_server.js