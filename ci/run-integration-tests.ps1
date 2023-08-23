param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [string]$TestResourceKey
)

$env:RESOURCE_KEY = $TestResourceKey

./node/run-integration-tests.ps1 -RepoName $RepoName

exit $LASTEXITCODE
