param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

./node/setup-environment.ps1 -RepoName $RepoName

exit $LASTEXITCODE