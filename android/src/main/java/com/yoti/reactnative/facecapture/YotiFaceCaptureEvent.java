package com.yoti.reactnative.facecapture;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

/**
 * Custom event class for YotiFaceCapture events.
 * This is compatible with both the old architecture and the new Fabric architecture.
 */
public class YotiFaceCaptureEvent extends Event<YotiFaceCaptureEvent> {
  private final String eventName;
  private final WritableMap eventData;

  public YotiFaceCaptureEvent(int surfaceId, int viewTag, String eventName, @Nullable WritableMap eventData) {
    super(surfaceId, viewTag);
    this.eventName = eventName;
    this.eventData = eventData;
  }

  @Override
  public String getEventName() {
    return eventName;
  }

  @Nullable
  @Override
  protected WritableMap getEventData() {
    return eventData;
  }
}
