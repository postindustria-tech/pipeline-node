param (
    [Parameter(Mandatory=$true)]
    [string]$LanguageVersion
)

./node/setup-environment.ps1 -LanguageVersion $LanguageVersion

exit $LASTEXITCODE