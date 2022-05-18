# Example app

This file contains installation instructions for the example app.
The instructions assume you have a [working React Native development environment](https://reactnative.dev/docs/getting-started) for Android and/or iOS.

## Installation
- Project root folder: Install project dependencies `yarn install`
- Navigate to the example directory: `cd example`
- Install dependencies: `yarn install`
- Install pods if you intend to run on iOS: `cd ios && pod install`

# Running on Android (via Android Studio)

- In the example folder, run: `yarn start`
- Open the `example/android` project in Android Studio
- Sync Gradle
- Run a build as you regularly would, preferrably on a device with the Yoti app installed
- If you are running on a physical device, remember to execute `adb -s DEVICE_ID_HERE reverse tcp:8081 tcp:8081`. You can find the appropriate device id by running `adb devices`

# Android (using React Native CLI)
- Simply execute `yarn run android` in the `example` folder

# iOS (XCode)
- Open the `ios/example.xcworkspace` file with XCode
- Run a build as you regularly would, preferrably on a device with the Yoti app installed

# iOS (with React Native CLI)
- Run `yarn run ios` in the `example` folder


