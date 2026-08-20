@echo off
cd /d "%~dp0"
title Suzuran 1938 Offline
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0offline-server.ps1"
if errorlevel 1 (
  echo.
  echo Launch failed. Please keep this window and contact the project maintainer.
  pause
)
