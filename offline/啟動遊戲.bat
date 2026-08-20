@echo off
chcp 65001 >nul
title 翻閱1938：那些待續的章節 - 單機展示版
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0offline-server.ps1"
if errorlevel 1 (
  echo.
  echo 啟動失敗。請查看上方訊息，或聯絡專案維護者。
  pause
)
