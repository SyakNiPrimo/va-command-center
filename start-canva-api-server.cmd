@echo off
title VA Command Center Canva API Server
cd /d "%~dp0"
echo Starting VA Command Center Canva API Server...
echo.

if not exist "canva-local.env" (
  echo Missing canva-local.env
  echo Copy canva-local.env.example to canva-local.env and add your Canva credentials.
  echo.
  pause
  exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in ("canva-local.env") do (
  if not "%%A"=="" set "%%A=%%B"
)

set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"

echo Using Node: %NODE_EXE%
echo Starting local server...
echo Leave this window open while using Canva API features.
echo.
"%NODE_EXE%" ".\canva-api-server.js"
echo.
echo The server stopped or failed to start. Please send Codex a screenshot of this window.
pause
