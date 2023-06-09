param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$packages = "fiftyone.pipeline.cloudrequestengine", "fiftyone.pipeline.core", "fiftyone.pipeline.engines", "fiftyone.pipeline.engines.fiftyone"

./node/update-packages.ps1 -RepoName $RepoName -Packages $packages

exit $LASTEXITCODE