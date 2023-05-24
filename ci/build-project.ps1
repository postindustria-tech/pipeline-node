param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

./node/build-project.ps1 -RepoName $RepoName

exit $LASTEXITCODE