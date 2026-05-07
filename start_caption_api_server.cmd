@echo off
title VA Command Center Caption API Server
cd /d "%~dp0"
echo Starting VA Command Center Caption API Server...
if not exist "caption_local.env" (
  echo Missing caption_local.env
  echo Copy caption_local.env.example to caption_local.env and add OPENAI_API_KEY.
  pause
  exit /b 1
)
for /f "usebackq tokens=1,* delims==" %%A in ("caption_local.env") do (
  if not "%%A"=="" set "%%A=%%B"
)
set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"
"%NODE_EXE%" ".\caption_api_server.js"
pause