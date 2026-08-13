[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

& (Join-Path $PSScriptRoot 'verify-dotnet.ps1')
if ($LASTEXITCODE -ne 0) { throw 'C# verification failed.' }
python (Join-Path $root 'src/python/catalog.py')
if ($LASTEXITCODE -ne 0) { throw 'Python catalogue verification failed.' }
node (Join-Path $root 'src/javascript/catalog.js')
if ($LASTEXITCODE -ne 0) { throw 'JavaScript catalogue verification failed.' }
node (Join-Path $root 'src/typescript/catalog.ts')
if ($LASTEXITCODE -ne 0) { throw 'TypeScript catalogue verification failed.' }
node --test (Join-Path $root 'web/catalogue-model.test.mjs') (Join-Path $root 'web/filtering.test.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Web catalogue verification failed.' }

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
