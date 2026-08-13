[CmdletBinding()]
param(
    [ValidateRange(1024, 65535)]
    [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

Write-Host "DesignPatterns Explorer: http://localhost:$Port/web/"
Write-Host "Press Ctrl+C to stop the local server."
python -m http.server $Port --directory $root
