param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Push-Location $RepoName

$packageJSON = @"
{
    "name": "pipeline-node",
    "version": "1.0.0",
    "description": "Temporary package to allow all tests to run using the local code as dependencies",
    "main": "index.js",
    "scripts": {
        "unit-test": "jest --ci --reporters=jest-junit --reporters=default --coverage --coverageReporters=cobertura --testPathIgnorePatterns '.*integration.*'",
        "integration-test": "jest --ci --reporters=jest-junit --reporters=default --coverage --coverageReporters=cobertura --testMatch '**/*integration*.js'"
    },
    "repository": {
        "type": "git", "url": "https://github.com/51Degrees/pipeline-node"
    },
    "author": "51Degrees Engineering <engineering@51degrees.com>",
    "dependencies": {
        "jest": "^27.0.6",
        "node-mocks-http": "^1.10.1",
        "jest-junit": "^12.2.0",
        "mustache": "^4.0.1",
        "uglify-js": "^3.8.1",
        "eslint": "6.8.0",
        "eslint-config-standard": "14.1.1",
        "eslint-plugin-import": "2.20.2",
        "eslint-plugin-node": "11.1.0",
        "eslint-plugin-promise": "4.2.1",
        "eslint-plugin-standard": "4.0.1",
        "eslint-plugin-jsdoc": "25.4.0"
    },
    "jest":{
        "setupFilesAfterEnv": ["./setup.js"]
    }
}
"@

New-Item -ItemType File -Path "package.json" -Force | Out-Null
Set-Content -Path "package.json" -Value $packageJSON
Write-Output "Package configuration file created successfully."

Pop-Location

./node/setup-environment.ps1 -RepoName $RepoName

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}



