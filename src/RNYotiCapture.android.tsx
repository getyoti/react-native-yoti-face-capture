import React from 'react';
import {
  findNodeHandle,
  requireNativeComponent,
  NativeModules,
} from 'react-native';

import type {
  ANALYSIS_FAILURE_CAUSE,
  ComponentProps,
  IMAGE_QUALITY,
} from './RNYotiCaptureTypes';

import { IMAGE_QUALITY_MEDIUM } from './RNYotiCaptureTypes';

const YotiFaceCaptureView =
  requireNativeComponent<NativeFaceCaptureViewAndroid>('YotiFaceCaptureView');
const YotiFaceCaptureModule = NativeModules.YotiFaceCaptureModule;

type NativeCaptureResultState = 'ValidFace' | 'InvalidFace';

type NATIVE_ANALYSIS_FAILURE_CAUSE =
  | 'FaceTooBig'
  | 'EyesClosed'
  | 'FaceTooSmall'
  | 'FaceNotStable'
  | 'NoFaceDetected'
  | 'FaceNotCentered'
  | 'FaceNotStraight'
  | 'EnvironmentTooDark'
  | 'AnalysisError'
  | 'MultipleFacesDetected';

type NativeCaptureResult = {
  nativeEvent: {
    cause?: NATIVE_ANALYSIS_FAILURE_CAUSE;
    croppedImage?: string;
    croppedFaceBoundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    faceBoundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    originalImage?: string;
    state: NativeCaptureResultState;
  };
};

type NativeFaceCaptureSuccessState =
  | 'Analyzing'
  | 'CameraReady'
  | 'CameraStopped';

type NativeFaceCaptureFailureState =
  | 'CameraInitializationError'
  | 'MissingPermissions';

type NativeFaceCaptureState = {
  nativeEvent: {
    state: NativeFaceCaptureSuccessState;
  };
};

type NativeFaceCaptureStateFailure = {
  nativeEvent: {
    state: NativeFaceCaptureFailureState;
  };
};

interface NativeFaceCaptureViewAndroid {
  requireEyesOpen: boolean;
  requireValidAngle: boolean;
  requiredStableFrames: number;
  requireBrightEnvironment: Boolean;
  imageQuality: IMAGE_QUALITY;
  faceCenter: Array<number>;
  onCameraStateChange: (
    faceCaptureState: NativeFaceCaptureState | NativeFaceCaptureStateFailure
  ) => void;
  onFaceCaptureResult: (faceCaptureResult: NativeCaptureResult) => void;
}

type FailureRenaming = {
  [Property in NATIVE_ANALYSIS_FAILURE_CAUSE]: ANALYSIS_FAILURE_CAUSE;
};

const FACE_CAPTURE_FAILURE_RENAMING: FailureRenaming = {
  FaceTooBig: 'FaceCaptureAnalysisErrorFaceTooBig',
  EyesClosed: 'FaceCaptureAnalysisErrorEyesNotOpen',
  FaceTooSmall: 'FaceCaptureAnalysisErrorFaceTooSmall',
  FaceNotStable: 'FaceCaptureAnalysisErrorFaceNotStable',
  NoFaceDetected: 'FaceCaptureAnalysisErrorNoFaceDetected',
  FaceNotCentered: 'FaceCaptureAnalysisErrorFaceNotCentered',
  FaceNotStraight: 'FaceCaptureAnalysisErrorFaceNotStraight',
  EnvironmentTooDark: 'FaceCaptureAnalysisErrorEnvironmentTooDark',
  AnalysisError: 'FaceCaptureAnalysisErrorFaceAnalysisFailed',
  MultipleFacesDetected: 'FaceCaptureAnalysisErrorMultipleFaces',
};

export default class RNYotiCapture extends React.Component<ComponentProps> {
  _faceCaptureHandle: number | null;

  constructor(props: ComponentProps) {
    super(props);
    this._faceCaptureHandle = null;
  }

  _setReference = (ref: any) => {
    if (ref) {
      this._faceCaptureHandle = findNodeHandle(ref);
    } else {
      this._faceCaptureHandle = null;
    }
  };

  startAnalyzing() {
    YotiFaceCaptureModule.startAnalyzing(this._faceCaptureHandle);
  }

  stopAnalyzing() {
    YotiFaceCaptureModule.stopAnalyzing(this._faceCaptureHandle);
  }

  startCamera() {
    YotiFaceCaptureModule.startCamera(this._faceCaptureHandle);
  }

  stopCamera() {
    YotiFaceCaptureModule.stopCamera(this._faceCaptureHandle);
  }

  onCameraStateChange(
    cameraState: NativeFaceCaptureState | NativeFaceCaptureStateFailure
  ) {
    let state = cameraState.nativeEvent.state;

    switch (state) {
      case 'Analyzing':
        this.props.onFaceCaptureStateChanged('FaceCaptureStateAnalyzing');
        break;

      case 'CameraReady':
        this.props.onFaceCaptureStateChanged('FaceCaptureStateCameraReady');
        break;

      case 'CameraStopped':
        this.props.onFaceCaptureStateChanged('FaceCaptureStateCameraStopped');
        break;

      case 'CameraInitializationError':
        this.props.onFaceCaptureStateFailed(
          'FaceCaptureStateErrorCameraInitializingError'
        );
        break;

      case 'MissingPermissions':
        this.props.onFaceCaptureStateFailed(
          'FaceCaptureStateErrorCameraNotAccessible'
        );
        break;
    }
  }

  onFaceCaptureResult(faceCaptureResult: NativeCaptureResult) {
    const {
      cause: nativeCause,
      croppedImage,
      croppedFaceBoundingBox,
      faceBoundingBox,
      originalImage,
      state,
    } = faceCaptureResult.nativeEvent;

    if (
      state === 'ValidFace' &&
      croppedImage != null &&
      croppedFaceBoundingBox != null &&
      faceBoundingBox != null &&
      originalImage != null
    ) {
      this.props.onFaceCaptureAnalyzedImage({
        croppedImage,
        croppedFaceBoundingBox,
        faceBoundingBox,
        originalImage,
      });
      return;
    }
    if (nativeCause === undefined || originalImage === undefined) {
      return;
    }

    let cause = FACE_CAPTURE_FAILURE_RENAMING[nativeCause];
    if (cause === undefined) {
      cause = 'FaceCaptureAnalysisErrorFaceAnalysisFailed';
    }

    this.props.onFaceCaptureImageAnalysisFailed({
      cause,
      originalImage,
    });
  }

  render() {
    const {
      requireEyesOpen = false,
      requireBrightEnvironment = true,
      requireValidAngle = false,
      requiredStableFrames = 3,
      imageQuality = IMAGE_QUALITY_MEDIUM,
      faceCenter = [
        0.5,
        0.5
      ],
    } = this.props;

    return (
      <YotiFaceCaptureView
        {...this.props}
        requireEyesOpen={requireEyesOpen}
        requireValidAngle={requireValidAngle}
        requiredStableFrames={requiredStableFrames}
        requireBrightEnvironment={requireBrightEnvironment}
        imageQuality={imageQuality}
        faceCenter={faceCenter}
        ref={this._setReference}
        onCameraStateChange={this.onCameraStateChange.bind(this)}
        onFaceCaptureResult={this.onFaceCaptureResult.bind(this)}
      />
    );
  }
}
