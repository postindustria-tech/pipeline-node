# API Specific CI/CD Approach
This API complies with the `common-ci` approach.

The following secrets are required:
* `ACCESS_TOKEN` - GitHub access token for cloning repos, creating PRs, etc.
* `SUPER_RESOURCE_KEY` - resource key for integration tests
* `DEVICE_DETECTION_KEY` - license key for downloading assets
* `NPM_AUTH_TOKEN` - NPM token for publishing packages