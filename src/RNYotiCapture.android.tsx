import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
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

export type RNYotiCaptureRef = {
  startAnalyzing: () => void;
  stopAnalyzing: () => void;
  startCamera: () => void;
  stopCamera: () => void;
};

const RNYotiCapture = forwardRef<RNYotiCaptureRef, ComponentProps>(
  (props, ref) => {
    const {
      requireEyesOpen = false,
      requireBrightEnvironment = true,
      requireValidAngle = false,
      requiredStableFrames = 3,
      imageQuality = IMAGE_QUALITY_MEDIUM,
      faceCenter = [0.5, 0.5],
      onFaceCaptureStateChanged,
      onFaceCaptureStateFailed,
      onFaceCaptureAnalyzedImage,
      onFaceCaptureImageAnalysisFailed,
    } = props;

    const faceCaptureHandleRef = useRef<number | null>(null);

    const setReference = useCallback((nativeRef: any) => {
      if (nativeRef) {
        faceCaptureHandleRef.current = findNodeHandle(nativeRef);
      } else {
        faceCaptureHandleRef.current = null;
      }
    }, []);

    useImperativeHandle(ref, () => ({
      startAnalyzing: () => {
        YotiFaceCaptureModule.startAnalyzing(faceCaptureHandleRef.current);
      },
      stopAnalyzing: () => {
        YotiFaceCaptureModule.stopAnalyzing(faceCaptureHandleRef.current);
      },
      startCamera: () => {
        YotiFaceCaptureModule.startCamera(faceCaptureHandleRef.current);
      },
      stopCamera: () => {
        YotiFaceCaptureModule.stopCamera(faceCaptureHandleRef.current);
      },
    }));

    const handleCameraStateChange = useCallback(
      (cameraState: NativeFaceCaptureState | NativeFaceCaptureStateFailure) => {
        const state = cameraState.nativeEvent.state;

        switch (state) {
          case 'Analyzing':
            onFaceCaptureStateChanged('FaceCaptureStateAnalyzing');
            break;

          case 'CameraReady':
            onFaceCaptureStateChanged('FaceCaptureStateCameraReady');
            break;

          case 'CameraStopped':
            onFaceCaptureStateChanged('FaceCaptureStateCameraStopped');
            break;

          case 'CameraInitializationError':
            onFaceCaptureStateFailed(
              'FaceCaptureStateErrorCameraInitializingError'
            );
            break;

          case 'MissingPermissions':
            onFaceCaptureStateFailed(
              'FaceCaptureStateErrorCameraNotAccessible'
            );
            break;
        }
      },
      [onFaceCaptureStateChanged, onFaceCaptureStateFailed]
    );

    const handleFaceCaptureResult = useCallback(
      (faceCaptureResult: NativeCaptureResult) => {
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
          onFaceCaptureAnalyzedImage({
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

        onFaceCaptureImageAnalysisFailed({
          cause,
          originalImage,
        });
      },
      [onFaceCaptureAnalyzedImage, onFaceCaptureImageAnalysisFailed]
    );

    return (
      <YotiFaceCaptureView
        {...props}
        requireEyesOpen={requireEyesOpen}
        requireValidAngle={requireValidAngle}
        requiredStableFrames={requiredStableFrames}
        requireBrightEnvironment={requireBrightEnvironment}
        imageQuality={imageQuality}
        faceCenter={faceCenter}
        ref={setReference}
        onCameraStateChange={handleCameraStateChange}
        onFaceCaptureResult={handleFaceCaptureResult}
      />
    );
  }
);

export default RNYotiCapture;
