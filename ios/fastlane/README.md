fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios setVersionNumber

```sh
[bundle exec] fastlane ios setVersionNumber
```

set project to version number

### ios bumpVersion

```sh
[bundle exec] fastlane ios bumpVersion
```

bump version number

### ios setBuildNumber

```sh
[bundle exec] fastlane ios setBuildNumber
```

set build number

### ios buildDev

```sh
[bundle exec] fastlane ios buildDev
```

Push a new development build to Firebase App Distribution

### ios buildStage

```sh
[bundle exec] fastlane ios buildStage
```

Push a new Stage build to Firebase App Distribution

### ios buildProductionPatch

```sh
[bundle exec] fastlane ios buildProductionPatch
```

Push a new production patch release to TestFlight

### ios buildProductionMinor

```sh
[bundle exec] fastlane ios buildProductionMinor
```

Push a new production minor release to TestFlight

### ios buildProductionMajor

```sh
[bundle exec] fastlane ios buildProductionMajor
```

Push a new production Major release to TestFlight

### ios buildBumpCurrentVersion

```sh
[bundle exec] fastlane ios buildBumpCurrentVersion
```

Push a new production build that bump version number and release to TestFlight

### ios createAndSignNotificationProfile

```sh
[bundle exec] fastlane ios createAndSignNotificationProfile
```



### ios registerUDID

```sh
[bundle exec] fastlane ios registerUDID
```



### ios registerDevice

```sh
[bundle exec] fastlane ios registerDevice
```



### ios generateDevAdhoc

```sh
[bundle exec] fastlane ios generateDevAdhoc
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
