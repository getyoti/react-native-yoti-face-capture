# ChangeLog
## Version 2.0.1

Contains a couple of bug fixes on the iOS side of the SDK:
- Solves the discrepancy between the required screen units that needs to be used for Android and iOS. Now, both platforms will be expecting pixels when defining the scanning area.
- Fixes a crash when the component was used inside of a react-navigation react-stack screen.

## Version 2.0.0

BREAKING CHANGE: Low light detection

New configurable property `requireBrightEnvironment` has been added to the SDK entry point. If it is activated, the SDK will require a bright environment to take the selfie. To migrate from previous versions, it is needed to include this paremeter on the SDK setup.
Please, check [README.md](https://github.com/getyoti/react-native-yoti-face-capture/blob/main/README.md) for more details.

## Version 1.1.0

Fix: README.md

## Version 1.0.0

Face capture first release
