import type { Component } from 'react';
import {
  NativeModules,
  Platform,
  StyleProp,
  UIManager,
  ViewStyle,
} from 'react-native';

interface PlatformConstants {
  IMAGE_QUALITY_LOW: number;
  IMAGE_QUALITY_MEDIUM: number;
  IMAGE_QUALITY_HIGH: number;
}

let qualityConstants = {
  IMAGE_QUALITY_LOW: 0,
  IMAGE_QUALITY_MEDIUM: 0,
  IMAGE_QUALITY_HIGH: 0,
};

if (Platform.OS === 'ios') {
  const iOSConstants: PlatformConstants =
    // @ts-ignore UIManagerStatic
    UIManager.YotiFaceCaptureView.Constants;
  qualityConstants.IMAGE_QUALITY_LOW = iOSConstants.IMAGE_QUALITY_LOW;
  qualityConstants.IMAGE_QUALITY_MEDIUM = iOSConstants.IMAGE_QUALITY_MEDIUM;
  qualityConstants.IMAGE_QUALITY_HIGH = iOSConstants.IMAGE_QUALITY_HIGH;
} else {
  const YotiFaceCaptureModule = NativeModules.YotiFaceCaptureModule;
  const androidConstants: PlatformConstants =
    YotiFaceCaptureModule.getConstants();
  qualityConstants.IMAGE_QUALITY_LOW = androidConstants.IMAGE_QUALITY_LOW;
  qualityConstants.IMAGE_QUALITY_MEDIUM = androidConstants.IMAGE_QUALITY_MEDIUM;
  qualityConstants.IMAGE_QUALITY_HIGH = androidConstants.IMAGE_QUALITY_HIGH;
}

export let IMAGE_QUALITY_LOW = qualityConstants.IMAGE_QUALITY_LOW;
export let IMAGE_QUALITY_MEDIUM = qualityConstants.IMAGE_QUALITY_MEDIUM;
export let IMAGE_QUALITY_HIGH = qualityConstants.IMAGE_QUALITY_HIGH;

export enum IMAGE_QUALITY {
  IMAGE_QUALITY_HIGH,
  IMAGE_QUALITY_MEDIUM,
  IMAGE_QUALITY_LOW,
}

export type FaceCaptureResult = {
  croppedImage: string;
  croppedFaceBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  faceBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  originalImage: string;
};

export type ANALYSIS_FAILURE_CAUSE =
  | 'FaceCaptureAnalysisErrorFaceTooBig'
  | 'FaceCaptureAnalysisErrorEyesNotOpen'
  | 'FaceCaptureAnalysisErrorFaceTooSmall'
  | 'FaceCaptureAnalysisErrorFaceNotStable'
  | 'FaceCaptureAnalysisErrorNoFaceDetected'
  | 'FaceCaptureAnalysisErrorFaceNotCentered'
  | 'FaceCaptureAnalysisErrorFaceNotStraight'
  | 'FaceCaptureAnalysisErrorEnvironmentTooDark'
  | 'FaceCaptureAnalysisErrorFaceAnalysisFailed'
  | 'FaceCaptureAnalysisErrorMultipleFaces';

export type FaceCaptureAnalysisFailure = {
  cause: ANALYSIS_FAILURE_CAUSE;
  originalImage: string;
};

export type FaceCaptureSuccessState =
  | 'FaceCaptureStateAnalyzing'
  | 'FaceCaptureStateCameraReady'
  | 'FaceCaptureStateCameraStopped';

export type FaceCaptureFailureState =
  | 'FaceCaptureStateErrorCameraInitializingError'
  | 'FaceCaptureStateErrorInvalidState'
  | 'FaceCaptureStateErrorCameraNotAccessible';

export type ComponentProps = {
  requireEyesOpen?: boolean;
  requireValidAngle?: boolean;
  requiredStableFrames?: number;
  requireBrightEnvironment?: boolean;
  imageQuality?: IMAGE_QUALITY;
  faceCenter?: Array<number>;
  onFaceCaptureAnalyzedImage: (faceCaptureResult: FaceCaptureResult) => void;
  onFaceCaptureImageAnalysisFailed: (
    faceCaptureAnalysisFailure: FaceCaptureAnalysisFailure
  ) => void;
  onFaceCaptureStateChanged: (
    faceCaptureState: FaceCaptureSuccessState
  ) => void;
  onFaceCaptureStateFailed: (
    faceCaptureStateFailure: FaceCaptureFailureState
  ) => void;
  style?: StyleProp<ViewStyle>;
  ref: Component;
};
