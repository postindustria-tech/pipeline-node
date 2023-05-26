param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

$packages = "fiftyone.pipeline.cloudrequestengine", "fiftyone.pipeline.core", "fiftyone.pipeline.engines", "fiftyone.pipeline.engines.fiftyone"

$noRemote = "fiftyone.pipeline.core"

./node/build-package-npm.ps1 -RepoName $RepoName -Packages $packages -NoRemote $noRemote -Version $Version

exit $LASTEXITCODE