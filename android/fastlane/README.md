fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android beta

```sh
[bundle exec] fastlane android beta
```

Submit a new Beta Build to Crashlytics Beta

### android deploy

```sh
[bundle exec] fastlane android deploy
```

Deploy a new version to the Google Play

### android buildDev

```sh
[bundle exec] fastlane android buildDev
```

Build Development

### android buildStage

```sh
[bundle exec] fastlane android buildStage
```

Build Stage

### android buildBumpCurrentVersion

```sh
[bundle exec] fastlane android buildBumpCurrentVersion
```

Build Bump current version

### android buildReleasePatch

```sh
[bundle exec] fastlane android buildReleasePatch
```

Build Release Patch

### android buildReleaseMinor

```sh
[bundle exec] fastlane android buildReleaseMinor
```

Build Release Minor

### android buildReleaseMajor

```sh
[bundle exec] fastlane android buildReleaseMajor
```

Build Release Major

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
