param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

./node/build-package-npm.ps1 -RepoName $RepoName -Packages $packages -NoRemote $noRemote

exit $LASTEXITCODE