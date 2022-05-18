import React from 'react';
import {
  findNodeHandle,
  PixelRatio,
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
  scanningArea: Array<number>;
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
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig('YotiFaceCaptureView').Commands
        .startAnalyzing,
      []
    );
  }

  stopAnalyzing() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig('YotiFaceCaptureView').Commands
        .stopAnalyzing,
      []
    );
  }

  public startCamera = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._faceCaptureHandle),
      UIManager.getViewManagerConfig('YotiFaceCaptureView').Commands
        .startCamera,
      []
    );
  };

  stopCamera() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._faceCaptureHandle),
      UIManager.getViewManagerConfig('YotiFaceCaptureView').Commands.stopCamera,
      []
    );
  }

  render() {
    const {
      requireEyesOpen = false,
      requireValidAngle = false,
      requiredStableFrames = 3,
      requireBrightEnvironment = true,
      imageQuality = IMAGE_QUALITY_MEDIUM,
      scanningArea = [
        0,
        0,
        PixelRatio.getPixelSizeForLayoutSize(720),
        PixelRatio.getPixelSizeForLayoutSize(1280),
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
        scanningArea={scanningArea}
        onFaceCaptureAnalyzedImage={({
          nativeEvent: faceCaptureResult,
        }: NativeFaceCaptureResult) =>
          this.props.onFaceCaptureAnalyzedImage(faceCaptureResult)
        }
        onFaceCaptureImageAnalysisFailed={({
          nativeEvent: faceCaptureAnalysisFailure,
        }: NativeFaceCaptureAnalysisFailure) =>
          this.props.onFaceCaptureImageAnalysisFailed(
            faceCaptureAnalysisFailure
          )
        }
        onFaceCaptureStateChanged={({
          nativeEvent: { state: faceCaptureState },
        }: NativeFaceCaptureState) =>
          this.props.onFaceCaptureStateChanged(faceCaptureState)
        }
        onFaceCaptureStateFailed={({
          nativeEvent: { state: faceCaptureStateFailure },
        }: NativeFaceCaptureStateFailure) =>
          this.props.onFaceCaptureStateFailed(faceCaptureStateFailure)
        }
        ref={this._setReference}
      />
    );
  }
}
