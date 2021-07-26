# Yoti Face Capture for React Native
An easy to use face detection component for React Native from Yoti.
Face detection is performed with the front facing camera, whose frames the library analyzes and then produces an optimised cropped image of the captured face.

[![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/getyoti/react-native-yoti-face-capture?label=latest%20release)](https://github.com/getyoti/react-native-yoti-face-capture/releases) [![Publish Release](https://github.com/getyoti/react-native-yoti-face-capture/workflows/Publish%20Release/badge.svg)](https://github.com/getyoti/react-native-yoti-face-capture/actions?query=workflow%3A%22Publish+Release%22)
<br>
[![Platform - Android](https://img.shields.io/badge/platform-Android-3ddc84.svg?style=flat&logo=android)](https://www.android.com)
[![Platform - iOS](https://img.shields.io/badge/platform-iOS-000.svg?style=flat&logo=apple)](https://developer.apple.com/ios)

The library leverages [Google ML Kit](https://firebase.google.com/docs/ml-kit/detect-faces) for the face detection.

## Installation

```sh
yarn add react-native-yoti-face-capture
```

Navigate to your iOS folder and install pods with:

`pod install`

React Native's autolinking will handle the rest of the native configuration. Should autolinking fail, consult the [troubleshooting instructions](#troubleshooting).

<details>
	<summary>React Native 0.59.x installation</summary>

Install the library with:

`yarn add @getyoti/react-native-yoti-face-capture`

Link the library:

`react-native link @getyoti/react-native-yoti-face-capture`

If you're using CocoaPods, navigate to your `ios` and update your `Podfile`:

```diff
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'
+  `pod 'react-native-yoti-face-capture', :path => '../node_modules/react-native-yoti-face-capture/react-native-yoti-face-capture.podspec'`
end
```

You may then run:

`pod install`

</details>
<br/>

### Android Configuration
- Requires Android API Level 21+

The library employs the [bundled version approach](https://github.com/getyoti/yoti-face-capture-android#bundled-vs-unbundled) approach for the AI models. 
### iOS Configuration
- Requres iOS 12.0+
- Requres Swift 5.3+

Make sure you've installed and are running the latest version of [Cocoapods](https://guides.cocoapods.org/using/getting-started.html).
Add the `use_frameworks!` declaration to your Podfile and run `pod install` from the ios directory:

```bash
platform :ios, '12.0'

target 'TargetName' do
  use_frameworks!
  ...
end
```

## Usage
Camera access is required in order for the face detection to work.
If your application does not request camera access from the user already, you may consider an in-built approach such as [PermissionsAndroid](https://reactnative.dev/docs/permissionsandroid). Alternatively, you may use community libraries like [React Native Permissions](https://github.com/zoontek/react-native-permissions).

```js
import React, {PixelRatio, useRef, useWindowDimensions} from 'react';
// Image quality options
import YotiFaceCapture, {
    IMAGE_QUALITY_LOW,
    IMAGE_QUALITY_MEDIUM,
    IMAGE_QUALITY_HIGH
} from "react-native-yoti-face-capture";

function App(){
    const yotiFaceCaptureRef = useRef(null);
    const windowHeight = useWindowDimensions().height;
    const windowWidth = useWindowDimensions().width;

    // You can then control the camera and analysis using the ref

    // Start the camera
    // yotiFaceCaptureRef.current.startCamera()

    // Start the analysis (having started the camera)
    // yotiFaceCaptureRef.current.startAnalysis()

    // Stop the analysis
    // yotiFaceCaptureRef.current.stopAnalysis()

    // Stop the camera
    // yotiFaceCaptureRef.current.stopCamera()

    return (
        <YotiFaceCapture
            imageQuality={IMAGE_QUALITY_MEDIUM}
            ref={YotiFaceCaptureRef}
            requireEyesOpen={false}
            requiredStableFrames={3}
            requireValidAngle
            scanningArea={[
                0,
                0,
                PixelRatio.getPixelSizeForLayoutSize(windowHeight),
                PixelRatio.getPixelSizeForLayoutSize(windowHeight),
            ]}
            onFaceCaptureAnalyzedImage={({nativeEvent: analysis}) => {
                // analysis.croppedImage
                // analysis.croppedFaceBoundingBox
                // analysis.faceBoundingBox
                // analysis.originalImage
            }}
            onFaceCaptureImageAnalysisFailed={({nativeEvent: failure}) => {
                // failure.cause
                // failure.originalImage
            }}
            onFaceCaptureStateChanged={({nativeEvent: state}) => {
                // state may either be 'Analyzing', 'CameraReady' or 'CameraStopped'
            }}
            onFaceCaptureStateFailed={({nativeEvent: failure}) => {
                // failure may either be 'CameraInitializationError' or 'MissingPermissions'
            }}
        />
    )
}
```

### Configurable props
---
* [imageQuality](#imageQuality)
* [ref](#ref)
* [requireEyesOpen](#requireEyesOpen)
* [requiredStableFrames](#requiredStableFrame)
* [requireValidAngle](#requireValidAngle)
* [scanningArea](#scanningArea)
* [onFaceCaptureStateChanged](#onFaceCaptureStateChanged)
* [onFaceCaptureStateFailed](#onFaceCaptureStateFailed)
* [onFaceCaptureAnalyzedImage](#onFaceCaptureAnalyzedImage)
* [onFaceCaptureImageAnalysisFailed](#onFaceCaptureImageAnalysisFailed)

---
#### imageQuality
This is the image quality of the cropped image after it has been compressed and converted to JPEG.
The optional prop defaults to `IMAGE_QUALITY_MEDIUM`.

#### ref
A [React ref](https://reactjs.org/docs/refs-and-the-dom.html) you will use to control the camera and analysis. The ref exposes methods:
- `startCamera()` - Start the camera feed.
- `startAnalysis()`- This can be called straight after `startCamera()`. There is no need to wait for `FaceCaptureStateCameraReady`.
- `stopAnalysis()` - Stop the analysis, whenever required.
- `stopCamera()` - Stop camera feed, whenever required.

#### requireEyesOpen
Sets the requirement for eyes to be open. When this requirement is not met, an `FaceCaptureAnalysisErrorEyesNotOpen` error is returned.
* **true (default)** - require eyes to be open for a face to be considered valid
* **false** - accepts faces with and without eyes open

#### requiredStableFrames
Setting this integer will instruct the library to require "n" number of frames to be as similar as possible in terms of width, height and x/y position. The purpose of this is to avoid capturing blurry images. When this requirement is not met, error `FaceCaptureAnalysisErrorFaceNotStable` is returned.
The optional prop defaults to `3`.

#### requireValidAngle
This optional boolean, if true, will require the picture to be taken with a tilt angle no bigger than 30 degrees. When this requirement is not met, error `FaceCaptureAnalysisErrorFaceNotStraight` is returned.
* **true (default)** - require face to be straight
* **false** -  allow face to not be straight

#### scanningArea
The scanning area is a Rect representing the region in which the face can only be detected. If the face is outside of this region it, will not be considered a valid face.
The value must be an array of four values to determine the region: `[x, y, width, height]`.
Please note the width and height will be considered as pixel values.
You may convert your conventional height and width with [`getPixelSizeForLayoutSize()`](https://reactnative.dev/docs/pixelratio#getpixelsizeforlayoutsize).

A default of `[0, 0, 720, 1280]` will be applied for this.

#### onFaceCaptureStateChanged
A function to be invoked when the state of Face Capture changes.
A string value will be returned, which will be one of:

- `FaceCaptureStateCameraReady` - The Face Capture has connected to the camera and the preview is available, but no analyzing is happening.
- `FaceCaptureStateCameraStopped` - The camera has stopped and no analyzing is happening.
- `FaceCaptureStateAnalyzing` - The camera is ready and the Face Capture is analyzing frames to detect faces.

#### onFaceCaptureStateFailed
A function to be invoked when the state of Face Capture changes to an error state.

- `FaceCaptureStateErrorCameraInitializingError` - There was an error initialzing the camera.
- `FaceCaptureStateErrorCameraNotAccessible` - The Face Capture does not have sufficient permissions to caccess the camera. 
- `FaceCaptureStateErrorInvalidState` - The Face Capture is in an invalid state.

#### onFaceCaptureAnalyzedImage
A callback function to handle successful face detection.
A single parameter will be supplied to the callback, being an object with properties:

- `originalImage` - This will be a base64 encoded 1280x720 YUV image.
- `croppedImage` - A compressed, base64 encoded JPEG image based on the configured image quality.
- `croppedFaceBoundingBox` - The bounding box of the face inside the cropped image.
- `faceBoundingBox` - The bounding box of the face inside the original image

#### onFaceCaptureImageAnalysisFailed
A callback function to handle when face detection fails for one of several reasons.
A single string value parameter will be supplied to the callback. The value will be one of:

- `FaceCaptureAnalysisErrorFaceTooBig`
- `FaceCaptureAnalysisErrorEyesNotOpen` (depending on configuration)
- `FaceCaptureAnalysisErrorFaceTooSmall`
- `FaceCaptureAnalysisErrorFaceNotStable` (depending on configuration)
- `FaceCaptureAnalysisErrorNoFaceDetected`
- `FaceCaptureAnalysisErrorFaceNotCentered`
- `FaceCaptureAnalysisErrorFaceNotStraight` (depending on configuration) 
- `FaceCaptureAnalysisErrorFaceAnalysisFailed`
- `FaceCaptureAnalysisErrorMultipleFaces`

# Troubleshooting

<details>
	<summary>Resolving autolinking failures on Android and iOS</summary>


### iOS

Linker errors pertaining to Swift libraries such as `swiftFoundation` can be resolved with one or more of the solutions mentioned [in this oft-quoted StackOverflow discussion](https://stackoverflow.com/questions/52536380/why-linker-link-static-libraries-with-errors-ios), depending on your React Native version and project setup.

### Android

Android linking is performed in 3 steps:

#### android/settings.gradle

Add the following to your settings.gradle file as a new entry before the last line which has `include ':app'`:

```diff
+   include ':react-native-yoti-face-capture'
+   project(':react-native-yoti-face-capture').projectDir = new
+   File(rootProject.projectDir, '../node_modules/react-native-yoti-face-capture/src/android')

    include ':app'
```

#### android/app/build.gradle

Find the `dependencies` block in your build.gradle file and add `implementation project(':react-native-yoti-face-capture')`:

```diff
dependencies {
   ...
+   implementation project(':react-native-yoti-face-capture')
}
```


#### android/app/src/main/java/..../MainApplication.java

Add an import for the package:

```diff
import android.app.Application;
import com.facebook.react.ReactApplication;
+ import com.yoti.reactnative.facecapture.YotiFaceCapturePackage;
```

Find the `getPackages` function and add `new YotiFaceCapturePackage()` to the list of packages.

```diff
@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
+       new YotiFaceCapturePackage(),
        ...
```

</details>


## License

MIT
