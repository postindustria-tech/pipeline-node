param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

./node/publish-package-npm.ps1 -RepoName $RepoName

exit $LASTEXITCODE