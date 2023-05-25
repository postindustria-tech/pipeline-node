param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$packages = "fiftyone.pipeline.cloudrequestengine", "fiftyone.pipeline.core", "fiftyone.pipeline.engines", "fiftyone.pipeline.engines.fiftyone";

./node/build-package-npm.ps1 -RepoName $RepoName -Version $Version -Packages $packages

exit $LASTEXITCODE