package com.yoti.reactnative.facecapture;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.yoti.mobile.android.capture.face.ui.models.face.ImageQuality;

import java.util.Map;
import java.util.HashMap;

public class YotiFaceCaptureModule extends ReactContextBaseJavaModule {
  YotiFaceCaptureModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "YotiFaceCaptureModule";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("IMAGE_QUALITY_LOW", ImageQuality.LOW.toString());
    constants.put("IMAGE_QUALITY_MEDIUM", ImageQuality.MEDIUM.toString());
    constants.put("IMAGE_QUALITY_HIGH", ImageQuality.HIGH.toString());
    return constants;
  }

  @ReactMethod
  public void startCamera(final int viewTag) {
    final ReactApplicationContext context = getReactApplicationContext();
    UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
    uiManager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        final YotiFaceCaptureView faceCaptureView;

        try {
          faceCaptureView = (YotiFaceCaptureView) nativeViewHierarchyManager.resolveView(viewTag);
          faceCaptureView.startCamera();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }

  @ReactMethod
  public void stopCamera(final int viewTag) {
    final ReactApplicationContext context = getReactApplicationContext();
    UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
    uiManager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        final YotiFaceCaptureView faceCaptureView;

        try {
          faceCaptureView = (YotiFaceCaptureView) nativeViewHierarchyManager.resolveView(viewTag);
          faceCaptureView.stopCamera();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }

  @ReactMethod
  public void startAnalyzing(final int viewTag) {
    final ReactApplicationContext context = getReactApplicationContext();
    UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
    uiManager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        final YotiFaceCaptureView faceCaptureView;

        try {
          faceCaptureView = (YotiFaceCaptureView) nativeViewHierarchyManager.resolveView(viewTag);
          faceCaptureView.startAnalyzing();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }

  @ReactMethod
  public void stopAnalyzing(final int viewTag) {
    final ReactApplicationContext context = getReactApplicationContext();
    UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
    uiManager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        final YotiFaceCaptureView faceCaptureView;

        try {
          faceCaptureView = (YotiFaceCaptureView) nativeViewHierarchyManager.resolveView(viewTag);
          faceCaptureView.stopAnalyzing();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }
}
