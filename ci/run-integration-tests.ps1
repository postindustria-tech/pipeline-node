param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

$env:RESOURCE_KEY = $Keys.TestResourceKey

./node/run-integration-tests.ps1 -RepoName $RepoName

exit $LASTEXITCODE