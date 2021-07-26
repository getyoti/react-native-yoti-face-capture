package com.yoti.reactnative.facecapture;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class YotiFaceCaptureViewManager extends SimpleViewManager<YotiFaceCaptureView> {
  public static final String REACT_CLASS = "YotiFaceCaptureView";

  @Override
  @NonNull
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  @NonNull
  public YotiFaceCaptureView createViewInstance(ThemedReactContext reactContext) {
    return new YotiFaceCaptureView(reactContext);
  }

  public Map getExportedCustomBubblingEventTypeConstants() {
    return MapBuilder.builder()
      .put(
        "onCameraStateChange",
        MapBuilder.of(
          "phasedRegistrationNames",
          MapBuilder.of("bubbled", "onCameraStateChange")))
      .put(
        "onFaceCaptureResult",
        MapBuilder.of(
          "phasedRegistrationNames",
          MapBuilder.of("bubbled", "onFaceCaptureResult")))
      .build();
  }

  @ReactProp(name = "scanningArea")
  public void setScanningArea(YotiFaceCaptureView view, ReadableArray scanningArea) throws Exception {
    try {
      view.setScanningArea(scanningArea);
    } catch (Exception e) {
      throw e;
    }
  }

  @ReactProp(name = "imageQuality")
  public void setImageQuality(YotiFaceCaptureView view, String imageQuality) throws Exception {
    try {
      view.setImageQuality(imageQuality);
    } catch (Exception e) {
      throw e;
    }
  }

  @ReactProp(name = "requireValidAngle", defaultBoolean = true)
  public void setRequireValidAngle(YotiFaceCaptureView view, boolean requireValidAngle) {
    view.setRequireValidAngle(requireValidAngle);
  }

  @ReactProp(name = "requireEyesOpen", defaultBoolean = true)
  public void setRequireEyesOpen(YotiFaceCaptureView view, boolean requireEyesOpen) {
    view.setRequireEyesOpen(requireEyesOpen);
  }

  @ReactProp(name = "requiredStableFrames", defaultInt = 3)
  public void setRequiredStableFrames(YotiFaceCaptureView view, int requireStableFrames) {
    view.setRequiredStableFrames(requireStableFrames);
  }
}
