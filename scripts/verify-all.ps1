[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

& (Join-Path $PSScriptRoot 'verify-dotnet.ps1')
python (Join-Path $root 'src/python/catalog.py')
node (Join-Path $root 'src/javascript/catalog.js')
node (Join-Path $root 'src/typescript/catalog.ts')

$cppCompiler = Get-Command g++, clang++ -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -eq $cppCompiler) {
    Write-Warning 'C++ validation skipped: no g++ or clang++ compiler is available on PATH.'
}
else {
    $binary = Join-Path ([System.IO.Path]::GetTempPath()) ("design-patterns-catalog-{0}.exe" -f [guid]::NewGuid())
    try {
        & $cppCompiler.Source '-std=c++20' '-Wall' '-Wextra' (Join-Path $root 'src/cpp/catalog.cpp') '-o' $binary
        & $binary (Join-Path $root 'src/shared/pattern-catalog.tsv')
    }
    finally {
        if (Test-Path -LiteralPath $binary) {
            Remove-Item -LiteralPath $binary -Force
        }
    }
}

$tsc = Get-Command tsc -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -eq $tsc) {
    Write-Warning 'TypeScript static type-check skipped: the tsc compiler is not available on PATH; Node executed the TypeScript catalogue using native type stripping.'
}
else {
    & $tsc.Source '--noEmit' '--strict' '--target' 'ES2022' '--lib' 'ES2022,DOM' (Join-Path $root 'src/typescript/catalog.ts')
}
