#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTBridgeModule.h>
#import "RNYotiFaceCaptureView.h"

@interface RNYotiFaceCaptureViewManager : RCTViewManager<RCTBridgeModule>

@end

@implementation RNYotiFaceCaptureViewManager

// MARK: - RCT Exports

RCT_EXPORT_MODULE(YotiFaceCaptureView)
RCT_EXPORT_VIEW_PROPERTY(onFaceCaptureStateChanged, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFaceCaptureStateFailed, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFaceCaptureAnalyzedImage, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFaceCaptureImageAnalysisFailed, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(requireEyesOpen, BOOL)
RCT_EXPORT_VIEW_PROPERTY(requireValidAngle, BOOL)
RCT_EXPORT_VIEW_PROPERTY(requireBrightEnvironment, BOOL)
RCT_EXPORT_VIEW_PROPERTY(imageQuality, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(requiredStableFrames, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(faceCenter, NSArray)

- (NSDictionary *)constantsToExport
{
    return @{
        @"IMAGE_QUALITY_LOW": @(FaceCaptureImageQualityLow),
        @"IMAGE_QUALITY_MEDIUM": @(FaceCaptureImageQualityMedium),
        @"IMAGE_QUALITY_HIGH": @(FaceCaptureImageQualityHigh),
    };
}

RCT_EXPORT_METHOD(startCamera:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RNYotiFaceCaptureView *view = (RNYotiFaceCaptureView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RNYotiFaceCaptureView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
        [view startFCCamera];
    }];
}

RCT_EXPORT_METHOD(stopCamera:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RNYotiFaceCaptureView *view = (RNYotiFaceCaptureView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RNYotiFaceCaptureView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
        [view stopFCCamera];
    }];
}

RCT_EXPORT_METHOD(startAnalyzing:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RNYotiFaceCaptureView *view = (RNYotiFaceCaptureView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RNYotiFaceCaptureView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
        [view startFCAnalyzing];
    }];
}

RCT_EXPORT_METHOD(stopAnalyzing:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RNYotiFaceCaptureView *view = (RNYotiFaceCaptureView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RNYotiFaceCaptureView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
        [view stopFCAnalyzing];
    }];
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (UIView *)view
{
    return [[RNYotiFaceCaptureView alloc] init];
}

@end
