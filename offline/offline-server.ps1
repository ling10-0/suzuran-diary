$ErrorActionPreference = 'Stop'

function Fail([string]$message) {
    Write-Host $message -ForegroundColor Red
    exit 1
}

$gameRoot = Join-Path $PSScriptRoot 'game'
if (-not (Test-Path -LiteralPath $gameRoot -PathType Container)) {
    Fail 'ERROR: game folder not found. Extract the whole ZIP before launching.'
}

$root = (Resolve-Path -LiteralPath $gameRoot).Path
$trimChars = [char[]]@([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
$rootPrefix = $root.TrimEnd($trimChars) + [IO.Path]::DirectorySeparatorChar
$listener = $null
$port = $null

$ports = @(1938..1948)
if ($env:SUZURAN_OFFLINE_PORT) {
    try {
        $ports = @([int]$env:SUZURAN_OFFLINE_PORT)
    } catch {
        Fail 'ERROR: invalid SUZURAN_OFFLINE_PORT value.'
    }
}

foreach ($candidatePort in $ports) {
    $candidate = $null
    try {
        $candidate = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, [int]$candidatePort)
        $candidate.Start()
        $listener = $candidate
        $port = [int]$candidatePort
        break
    } catch {
        if ($null -ne $candidate) {
            try { $candidate.Stop() } catch {}
        }
    }
}

if ($null -eq $listener -or $null -eq $port) {
    Fail 'ERROR: no local port available (1938-1948).'
}

function Get-ContentType([string]$filePath) {
    switch ([IO.Path]::GetExtension($filePath).ToLowerInvariant()) {
        '.html' { return 'text/html; charset=utf-8' }
        '.htm'  { return 'text/html; charset=utf-8' }
        '.js'   { return 'text/javascript; charset=utf-8' }
        '.mjs'  { return 'text/javascript; charset=utf-8' }
        '.css'  { return 'text/css; charset=utf-8' }
        '.json' { return 'application/json; charset=utf-8' }
        '.txt'  { return 'text/plain; charset=utf-8' }
        '.svg'  { return 'image/svg+xml' }
        '.png'  { return 'image/png' }
        '.jpg'  { return 'image/jpeg' }
        '.jpeg' { return 'image/jpeg' }
        '.gif'  { return 'image/gif' }
        '.webp' { return 'image/webp' }
        '.ico'  { return 'image/x-icon' }
        '.woff' { return 'font/woff' }
        '.woff2' { return 'font/woff2' }
        '.ttf'  { return 'font/ttf' }
        '.mp3'  { return 'audio/mpeg' }
        '.wav'  { return 'audio/wav' }
        '.ogg'  { return 'audio/ogg' }
        '.mp4'  { return 'video/mp4' }
        '.webm' { return 'video/webm' }
        '.pdf'  { return 'application/pdf' }
        default { return 'application/octet-stream' }
    }
}

function Write-Response($stream, [int]$statusCode, [string]$statusText, [byte[]]$body, [string]$contentType, [bool]$headOnly) {
    if ($null -eq $body) { $body = [byte[]]@() }
    $headers = @(
        ('HTTP/1.1 {0} {1}' -f $statusCode, $statusText),
        ('Content-Type: {0}' -f $contentType),
        ('Content-Length: {0}' -f $body.Length),
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

# Open the archived game in the user's normal browser instead of Edge app mode.
# Using localhost also avoids any zoom preference previously saved for 127.0.0.1.
$url = ('http://localhost:{0}/?offline=1' -f $port)
Write-Host ('READY {0}' -f $url) -ForegroundColor Green
Write-Host 'Keep this window open while playing. Close it to stop the offline server.'

if ($env:SUZURAN_OFFLINE_NO_BROWSER -ne '1') {
    Start-Process -FilePath $url | Out-Null
}

while ($true) {
    $client = $null
    $stream = $null
    $reader = $null
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 4096, $true)
        $requestLine = $reader.ReadLine()
        if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

        do {
            $line = $reader.ReadLine()
        } while ($null -ne $line -and $line -ne '')

        $parts = $requestLine.Split(' ')
        if ($parts.Length -lt 2) {
            Write-Response $stream 400 'Bad Request' ([Text.Encoding]::UTF8.GetBytes('Bad Request')) 'text/plain; charset=utf-8' $false
            continue
        }

        $method = $parts[0].ToUpperInvariant()
        $headOnly = $method -eq 'HEAD'
        if ($method -ne 'GET' -and -not $headOnly) {
            Write-Response $stream 405 'Method Not Allowed' ([Text.Encoding]::UTF8.GetBytes('Method Not Allowed')) 'text/plain; charset=utf-8' $headOnly
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
            $filePath = Join-Path $root 'index.html'
        }
        if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
            Write-Response $stream 404 'Not Found' ([Text.Encoding]::UTF8.GetBytes('Not Found')) 'text/plain; charset=utf-8' $headOnly
            continue
        }

        $body = [IO.File]::ReadAllBytes($filePath)
        Write-Response $stream 200 'OK' $body (Get-ContentType $filePath) $headOnly
    } catch {
        if ($null -ne $stream) {
            try {
                Write-Response $stream 500 'Internal Server Error' ([Text.Encoding]::UTF8.GetBytes('Internal Server Error')) 'text/plain; charset=utf-8' $false
            } catch {}
        }
    } finally {
        if ($null -ne $reader) { try { $reader.Dispose() } catch {} }
        if ($null -ne $stream) { try { $stream.Dispose() } catch {} }
        if ($null -ne $client) { try { $client.Close() } catch {} }
    }
}