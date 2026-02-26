import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  findNodeHandle,
  requireNativeComponent,
  UIManager,
} from 'react-native';

import type {
  ANALYSIS_FAILURE_CAUSE,
  ComponentProps,
  FaceCaptureResult,
  FaceCaptureSuccessState,
  FaceCaptureFailureState,
  IMAGE_QUALITY,
} from './RNYotiCaptureTypes';

import { IMAGE_QUALITY_MEDIUM } from './RNYotiCaptureTypes';

type NativeFaceCaptureResult = {
  nativeEvent: FaceCaptureResult;
};

type NativeFaceCaptureState = {
  nativeEvent: {
    state: FaceCaptureSuccessState;
  };
};

type NativeFaceCaptureStateFailure = {
  nativeEvent: {
    state: FaceCaptureFailureState;
  };
};

type NativeFaceCaptureAnalysisFailure = {
  nativeEvent: {
    cause: ANALYSIS_FAILURE_CAUSE;
    originalImage: string;
  };
};

interface NativeFaceCaptureViewIOS {
  imageQuality: IMAGE_QUALITY;
  requireEyesOpen: boolean;
  requireValidAngle: boolean;
  requiredStableFrames: number;
  requireBrightEnvironment: boolean;
  faceCenter: Array<number>;
  onFaceCaptureAnalyzedImage: (
    faceCaptureResult: NativeFaceCaptureResult
  ) => void;
  onFaceCaptureImageAnalysisFailed: (
    faceCaptureAnalysisFailure: NativeFaceCaptureAnalysisFailure
  ) => void;
  onFaceCaptureStateChanged: (faceCaptureState: NativeFaceCaptureState) => void;
  onFaceCaptureStateFailed: (
    faceCaptureStateFailure: NativeFaceCaptureStateFailure
  ) => void;
}

const YotiFaceCaptureView = requireNativeComponent<NativeFaceCaptureViewIOS>(
  'YotiFaceCaptureView'
);

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
      requireValidAngle = false,
      requiredStableFrames = 3,
      requireBrightEnvironment = true,
      imageQuality = IMAGE_QUALITY_MEDIUM,
      faceCenter = [0.5, 0.5],
      onFaceCaptureAnalyzedImage,
      onFaceCaptureImageAnalysisFailed,
      onFaceCaptureStateChanged,
      onFaceCaptureStateFailed,
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
        UIManager.dispatchViewManagerCommand(
          faceCaptureHandleRef.current,
          UIManager.getViewManagerConfig('YotiFaceCaptureView').Commands
            .startAnalyzing,
          []
        );
      },
      stopAnalyzing: () => {
        UIManager.dispatchViewManagerCommand(
          faceCaptureHandleRef.current,
          UIManager.getViewManagerConfig('YotiFaceCaptureView').Commands
            .stopAnalyzing,
          []
        );
      },
      startCamera: () => {
        UIManager.dispatchViewManagerCommand(
          faceCaptureHandleRef.current,
          UIManager.getViewManagerConfig('YotiFaceCaptureView').Commands
            .startCamera,
          []
        );
      },
      stopCamera: () => {
        UIManager.dispatchViewManagerCommand(
          faceCaptureHandleRef.current,
          UIManager.getViewManagerConfig('YotiFaceCaptureView').Commands
            .stopCamera,
          []
        );
      },
    }));

    const handleFaceCaptureAnalyzedImage = useCallback(
      ({ nativeEvent: faceCaptureResult }: NativeFaceCaptureResult) => {
        onFaceCaptureAnalyzedImage(faceCaptureResult);
      },
      [onFaceCaptureAnalyzedImage]
    );

    const handleFaceCaptureImageAnalysisFailed = useCallback(
      ({
        nativeEvent: faceCaptureAnalysisFailure,
      }: NativeFaceCaptureAnalysisFailure) => {
        onFaceCaptureImageAnalysisFailed(faceCaptureAnalysisFailure);
      },
      [onFaceCaptureImageAnalysisFailed]
    );

    const handleFaceCaptureStateChanged = useCallback(
      ({
        nativeEvent: { state: faceCaptureState },
      }: NativeFaceCaptureState) => {
        onFaceCaptureStateChanged(faceCaptureState);
      },
      [onFaceCaptureStateChanged]
    );

    const handleFaceCaptureStateFailed = useCallback(
      ({
        nativeEvent: { state: faceCaptureStateFailure },
      }: NativeFaceCaptureStateFailure) => {
        onFaceCaptureStateFailed(faceCaptureStateFailure);
      },
      [onFaceCaptureStateFailed]
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
        onFaceCaptureAnalyzedImage={handleFaceCaptureAnalyzedImage}
        onFaceCaptureImageAnalysisFailed={handleFaceCaptureImageAnalysisFailed}
        onFaceCaptureStateChanged={handleFaceCaptureStateChanged}
        onFaceCaptureStateFailed={handleFaceCaptureStateFailed}
        ref={setReference}
      />
    );
  }
);

export default RNYotiCapture;
