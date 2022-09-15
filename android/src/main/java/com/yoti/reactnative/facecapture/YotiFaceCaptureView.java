package com.yoti.reactnative.facecapture;

import android.graphics.PointF;
import android.util.Base64;
import android.view.Choreographer;
import android.view.View;
import android.widget.LinearLayout;

import androidx.lifecycle.LifecycleOwner;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;

import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.yoti.mobile.android.capture.face.ui.FaceCapture;
import com.yoti.mobile.android.capture.face.ui.FaceCaptureListener;
import com.yoti.mobile.android.capture.face.ui.models.camera.CameraState;
import com.yoti.mobile.android.capture.face.ui.models.camera.CameraStateListener;
import com.yoti.mobile.android.capture.face.ui.models.face.FaceCaptureConfiguration;
import com.yoti.mobile.android.capture.face.ui.models.face.FaceCaptureResult;
import com.yoti.mobile.android.capture.face.ui.models.face.FaceCaptureState;
import com.yoti.mobile.android.capture.face.ui.models.face.ImageQuality;

import org.jetbrains.annotations.NotNull;

public class YotiFaceCaptureView extends LinearLayout {
  private final ThemedReactContext context;
  private final FaceCapture mFaceCapture;
  private ImageQuality mImageQuality;
  private boolean mRequireValidAngle;
  private boolean mRequireEyesOpen;
  private boolean mRequireBrightEnvironment = true;
  private int mRequiredStableFrames;
  private ReadableArray mFaceCenter;
  private final CameraStateListener mCameraStateListener = new CameraStateListener() {
    @Override
    public void onCameraState(@NotNull CameraState cameraState) {
      WritableMap event = Arguments.createMap();
      event.putString("state", cameraState.getClass().getSimpleName());
      ReactContext reactContext = (ReactContext) getContext();
      reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
        getId(),
        "onCameraStateChange",
        event);
    }
  };
  private final FaceCaptureListener mFaceCaptureListener = new FaceCaptureListener() {
    @Override
    public void onFaceCaptureResult(@NotNull FaceCaptureResult faceCaptureResult) {
      WritableMap event = Arguments.createMap();
      event.putString("originalImage", Base64.encodeToString(faceCaptureResult.getOriginalImage().getData(), Base64.DEFAULT));
      event.putString("state", faceCaptureResult.getState().getClass().getSimpleName());

      FaceCaptureState s = faceCaptureResult.getState();
      if (s instanceof FaceCaptureState.InvalidFace) {
        event.putString("cause", ((FaceCaptureState.InvalidFace) s).getCause().getClass().getSimpleName());
      }
      if (s instanceof FaceCaptureState.ValidFace) {
        int croppedFaceBoundingBoxLeft = ((FaceCaptureState.ValidFace) s).getCroppedFaceBoundingBox().left;
        int croppedFaceBoundingBoxTop = ((FaceCaptureState.ValidFace) s).getCroppedFaceBoundingBox().top;
        int croppedFaceBoundingBoxRight = ((FaceCaptureState.ValidFace) s).getCroppedFaceBoundingBox().right;
        int croppedFaceBoundingBoxBottom = ((FaceCaptureState.ValidFace) s).getCroppedFaceBoundingBox().bottom;
        WritableMap croppedFaceBoundingBox = Arguments.createMap();
        croppedFaceBoundingBox.putInt("x", croppedFaceBoundingBoxLeft);
        croppedFaceBoundingBox.putInt("y", croppedFaceBoundingBoxTop);
        croppedFaceBoundingBox.putInt("width", croppedFaceBoundingBoxRight - croppedFaceBoundingBoxLeft);
        croppedFaceBoundingBox.putInt("height", croppedFaceBoundingBoxBottom - croppedFaceBoundingBoxTop);

        int faceBoundingBoxLeft = ((FaceCaptureState.ValidFace) s).getFaceBoundingBox().left;
        int faceBoundingBoxTop = ((FaceCaptureState.ValidFace) s).getFaceBoundingBox().top;
        int faceBoundingBoxRight = ((FaceCaptureState.ValidFace) s).getFaceBoundingBox().right;
        int faceBoundingBoxBottom = ((FaceCaptureState.ValidFace) s).getFaceBoundingBox().bottom;
        WritableMap faceBoundingBox = Arguments.createMap();
        faceBoundingBox.putInt("x", faceBoundingBoxLeft);
        faceBoundingBox.putInt("y", faceBoundingBoxTop);
        faceBoundingBox.putInt("width", faceBoundingBoxRight - faceBoundingBoxLeft);
        faceBoundingBox.putInt("height", faceBoundingBoxBottom - faceBoundingBoxTop);

        event.putString("croppedImage", Base64.encodeToString(((FaceCaptureState.ValidFace) s).getCroppedImage(), Base64.DEFAULT));
        event.putMap("croppedFaceBoundingBox", croppedFaceBoundingBox);
        event.putMap("faceBoundingBox", faceBoundingBox);
      }

      ReactContext reactContext = (ReactContext) getContext();
      reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
        getId(),
        "onFaceCaptureResult",
        event);
    }
  };

  YotiFaceCaptureView(ThemedReactContext context) {
    super(context);
    this.context = context;
    inflate(context, R.layout.yotifacecapture, this);
    mFaceCapture = findViewById(R.id.faceCapture);
    Choreographer.getInstance().postFrameCallback(new Choreographer.FrameCallback() {
      @Override
      public void doFrame(long frameTimeNanos) {
        manuallyLayoutChildren();
        getViewTreeObserver().dispatchOnGlobalLayout();
        Choreographer.getInstance().postFrameCallback(this);
      }
    });
  }

  void manuallyLayoutChildren() {
    for (int i = 0; i < getChildCount(); i++) {
      View child = getChildAt(i);
      child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
        MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
      child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
    }
  }

  @Override
  public void requestLayout() {
    super.requestLayout();
  }

  public void setFaceCenter(ReadableArray faceCenter) throws Exception {
    mFaceCenter = faceCenter;
  }

  public void setImageQuality(String imageQuality) throws Exception {
    if (imageQuality.equals(ImageQuality.LOW.toString())) {
      mImageQuality = ImageQuality.LOW;
      return;
    }
    if (imageQuality.equals(ImageQuality.MEDIUM.toString())) {
      mImageQuality = ImageQuality.MEDIUM;
      return;
    }
    if (imageQuality.equals(ImageQuality.HIGH.toString())) {
      mImageQuality = ImageQuality.HIGH;
      return;
    }
    mImageQuality = ImageQuality.MEDIUM;
  }

  public void setRequireValidAngle(Boolean requireValidAngle) {
    mRequireValidAngle = requireValidAngle;
  }

  public void setRequireEyesOpen(Boolean requireEyesOpen) {
    mRequireEyesOpen = requireEyesOpen;
  }

  public void setRequiredStableFrames(int requiredStableFrames) {
    mRequiredStableFrames = requiredStableFrames;
  }

  public void setRequireBrightEnvironment(Boolean requireBrightEnvironment) {
    mRequireBrightEnvironment = requireBrightEnvironment;
  }

  public void startCamera() {
    mFaceCapture.startCamera((LifecycleOwner) this.context.getCurrentActivity(), mCameraStateListener);
  }

  public void stopCamera() {
    mFaceCapture.stopCamera();
  }

  public void startAnalyzing() {
    PointF faceCenter = new PointF((float) mFaceCenter.getDouble(0), (float) mFaceCenter.getDouble(1));

    FaceCaptureConfiguration configuration = new FaceCaptureConfiguration(
      faceCenter,
      mImageQuality,
      mRequireValidAngle,
      mRequireEyesOpen,
      mRequireBrightEnvironment,
      mRequiredStableFrames
    );
    mFaceCapture.startAnalysing(configuration, mFaceCaptureListener);
  }

  public void stopAnalyzing() {
    mFaceCapture.stopAnalysing();
  }
}
