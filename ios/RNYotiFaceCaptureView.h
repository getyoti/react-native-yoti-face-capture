#import <React/RCTView.h>
#import <YotiFaceCapture/YotiFaceCapture-Swift.h>

@interface RNYotiFaceCaptureView : RCTView <FaceCaptureViewDelegate>

@property (nonatomic, strong) FaceCaptureViewController *faceCaptureViewController;
@property (nonatomic, strong) FaceCaptureConfiguration *faceCaptureConfiguration;
@property (nonatomic, strong) UIViewController *rootViewController;
@property (nonatomic, strong) UIView *faceDetectionView;
@property (nonatomic, copy) RCTDirectEventBlock onFaceCaptureStateChanged;
@property (nonatomic, copy) RCTDirectEventBlock onFaceCaptureStateFailed;
@property (nonatomic, copy) RCTDirectEventBlock onFaceCaptureAnalyzedImage;
@property (nonatomic, copy) RCTDirectEventBlock onFaceCaptureImageAnalysisFailed;

- (void) startFCCamera;
- (void) stopFCCamera;
- (void) startFCAnalyzing;
- (void) stopFCAnalyzing;

@end
