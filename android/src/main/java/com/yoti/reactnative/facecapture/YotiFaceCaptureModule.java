package com.yoti.reactnative.facecapture;

import android.view.View;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.common.UIManagerType;
import com.yoti.mobile.android.capture.face.ui.models.face.ImageQuality;

import java.util.Map;
import java.util.HashMap;

public class YotiFaceCaptureModule extends ReactContextBaseJavaModule {
  YotiFaceCaptureModule(ReactApplicationContext context) {
    super(context);
  }

  @NonNull
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

  private YotiFaceCaptureView resolveView(int viewTag) {
    final ReactApplicationContext context = getReactApplicationContext();
    UIManager uiManager = UIManagerHelper.getUIManager(context, UIManagerType.FABRIC);
    if (uiManager == null) {
      uiManager = UIManagerHelper.getUIManager(context, UIManagerType.DEFAULT);
    }
    if (uiManager == null) {
      return null;
    }

    View view = uiManager.resolveView(viewTag);
    if (view instanceof YotiFaceCaptureView) {
      return (YotiFaceCaptureView) view;
    }
    
    return null;
  }

  @ReactMethod
  public void startCamera(final int viewTag) {
    UiThreadUtil.runOnUiThread(() -> {
      try {
        YotiFaceCaptureView faceCaptureView = resolveView(viewTag);
        if (faceCaptureView != null) {
          faceCaptureView.startCamera();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    });
  }

  @ReactMethod
  public void stopCamera(final int viewTag) {
    UiThreadUtil.runOnUiThread(() -> {
      try {
        YotiFaceCaptureView faceCaptureView = resolveView(viewTag);
        if (faceCaptureView != null) {
          faceCaptureView.stopCamera();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    });
  }

  @ReactMethod
  public void startAnalyzing(final int viewTag) {
    UiThreadUtil.runOnUiThread(() -> {
      try {
        YotiFaceCaptureView faceCaptureView = resolveView(viewTag);
        if (faceCaptureView != null) {
          faceCaptureView.startAnalyzing();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    });
  }

  @ReactMethod
  public void stopAnalyzing(final int viewTag) {
    UiThreadUtil.runOnUiThread(() -> {
      try {
        YotiFaceCaptureView faceCaptureView = resolveView(viewTag);
        if (faceCaptureView != null) {
          faceCaptureView.stopAnalyzing();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    });
  }
}
