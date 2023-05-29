param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [boolean]$DryRun
)

$packages = "fiftyone.pipeline.cloudrequestengine", "fiftyone.pipeline.core", "fiftyone.pipeline.engines", "fiftyone.pipeline.engines.fiftyone"

./node/publish-package-npm.ps1 -RepoName $RepoName -Packages $packages -DryRun $DryRun

exit $LASTEXITCODE