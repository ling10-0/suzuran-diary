$ErrorActionPreference = 'Stop'

$gameRoot = Join-Path $PSScriptRoot 'game'
if (-not (Test-Path -LiteralPath $gameRoot -PathType Container)) {
    Write-Host '找不到 game 資料夾，請確認已完整解壓縮單機展示包。' -ForegroundColor Red
    exit 1
}

$root = (Resolve-Path -LiteralPath $gameRoot).Path
$trimChars = [char[]]@([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
$rootPrefix = $root.TrimEnd($trimChars) + [IO.Path]::DirectorySeparatorChar
$listener = $null
$port = $null

foreach ($candidatePort in 1938..1948) {
    $candidate = $null
    try {
        $candidate = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidatePort)
        $candidate.Start()
        $listener = $candidate
        $port = $candidatePort
        break
    } catch {
        if ($candidate) {
            try { $candidate.Stop() } catch {}
        }
    }
}

if (-not $listener) {
    Write-Host '無法啟動本機遊戲伺服器（1938–1948 連接埠皆無法使用）。' -ForegroundColor Red
    exit 1
}

function Get-ContentType([string]$filePath) {
    switch ([IO.Path]::GetExtension($filePath).ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.htm'  { 'text/html; charset=utf-8' }
        '.js'   { 'text/javascript; charset=utf-8' }
        '.mjs'  { 'text/javascript; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.txt'  { 'text/plain; charset=utf-8' }
        '.svg'  { 'image/svg+xml' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif'  { 'image/gif' }
        '.webp' { 'image/webp' }
        '.ico'  { 'image/x-icon' }
        '.woff' { 'font/woff' }
        '.woff2' { 'font/woff2' }
        '.ttf'  { 'font/ttf' }
        '.mp3'  { 'audio/mpeg' }
        '.wav'  { 'audio/wav' }
        '.ogg'  { 'audio/ogg' }
        '.mp4'  { 'video/mp4' }
        '.webm' { 'video/webm' }
        '.pdf'  { 'application/pdf' }
        default { 'application/octet-stream' }
    }
}

function Write-Response($stream, [int]$statusCode, [string]$statusText, [byte[]]$body, [string]$contentType, [bool]$headOnly = $false) {
    if ($null -eq $body) { $body = [byte[]]@() }
    $headers = @(
        "HTTP/1.1 $statusCode $statusText",
        "Content-Type: $contentType",
        "Content-Length: $($body.Length)",
        'Cache-Control: no-store, max-age=0',
        'X-Content-Type-Options: nosniff',
        'Connection: close',
        '',
        ''
    ) -join "`r`n"
    $headerBytes = [Text.Encoding]::ASCII.GetBytes($headers)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    if (-not $headOnly -and $body.Length -gt 0) {
        $stream.Write($body, 0, $body.Length)
    }
    $stream.Flush()
}

$url = "http://127.0.0.1:$port/?offline=1&preview=1"
Write-Host ''
Write-Host '翻閱1938：那些待續的章節｜單機展示版' -ForegroundColor Cyan
Write-Host "本機網址：$url"
Write-Host '遊戲資料只會保存在這台電腦，不會寫入正式 Supabase。' -ForegroundColor Green
Write-Host '要結束單機伺服器，直接關閉這個視窗即可。'
Write-Host ''

Start-Process $url

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $null
        $reader = $null
        try {
            $stream = $client.GetStream()
            $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 4096, $true)
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

            do {
                $line = $reader.ReadLine()
            } while ($null -ne $line -and $line -ne '')

            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2) {
                Write-Response $stream 400 'Bad Request' ([Text.Encoding]::UTF8.GetBytes('Bad Request')) 'text/plain; charset=utf-8'
                continue
            }

            $method = $parts[0].ToUpperInvariant()
            $headOnly = $method -eq 'HEAD'
            if ($method -ne 'GET' -and -not $headOnly) {
                Write-Response $stream 405 'Method Not Allowed' ([Text.Encoding]::UTF8.GetBytes('Method Not Allowed')) 'text/plain; charset=utf-8'
                continue
            }

            $requestTarget = $parts[1]
            $pathOnly = ($requestTarget -split '\?', 2)[0]
            try {
                $decodedPath = [Uri]::UnescapeDataString($pathOnly).TrimStart('/')
            } catch {
                $decodedPath = ''
            }

            if ([string]::IsNullOrWhiteSpace($decodedPath)) {
                $decodedPath = 'index.html'
            }

            $relativePath = $decodedPath.Replace('/', [IO.Path]::DirectorySeparatorChar)
            $candidatePath = [IO.Path]::GetFullPath((Join-Path $root $relativePath))
            $insideRoot = $candidatePath.Equals($root, [StringComparison]::OrdinalIgnoreCase) -or $candidatePath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)

            if (-not $insideRoot) {
                Write-Response $stream 403 'Forbidden' ([Text.Encoding]::UTF8.GetBytes('Forbidden')) 'text/plain; charset=utf-8' $headOnly
                continue
            }

            $filePath = $candidatePath
            if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
                # SPA route fallback: game routes are served by the same index.html.
                $filePath = Join-Path $root 'index.html'
            }

            if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
                Write-Response $stream 404 'Not Found' ([Text.Encoding]::UTF8.GetBytes('Not Found')) 'text/plain; charset=utf-8' $headOnly
                continue
            }

            $body = [IO.File]::ReadAllBytes($filePath)
            Write-Response $stream 200 'OK' $body (Get-ContentType $filePath) $headOnly
        } catch {
            try {
                if ($stream) {
                    Write-Response $stream 500 'Internal Server Error' ([Text.Encoding]::UTF8.GetBytes('Internal Server Error')) 'text/plain; charset=utf-8'
                }
            } catch {}
        } finally {
            if ($reader) { $reader.Dispose() }
            if ($stream) { $stream.Dispose() }
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
