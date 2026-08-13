[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$catalogProject = Join-Path $repositoryRoot 'src/DesignPatterns.Catalog/DesignPatterns.Catalog.csproj'

dotnet restore $catalogProject
if ($LASTEXITCODE -ne 0) { throw 'Restore failed.' }
dotnet build $catalogProject --configuration Release --no-restore --disable-build-servers
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }

$output = dotnet run --project $catalogProject --configuration Release --no-build
if ($LASTEXITCODE -ne 0) { throw 'Catalogue execution failed.' }
if ($output[-1] -ne 'Verified 38 patterns.') {
    throw 'The catalogue did not verify all 38 patterns.'
}

Write-Host 'All 38 original pattern checks passed.'
