param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

$packages = "fiftyone.pipeline.cloudrequestengine", "fiftyone.pipeline.core", "fiftyone.pipeline.engines", "fiftyone.pipeline.engines.fiftyone"

./node/publish-package-npm.ps1 -RepoName $RepoName -Packages $packages

exit $LASTEXITCODE