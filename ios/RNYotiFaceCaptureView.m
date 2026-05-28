#import "RNYotiFaceCaptureView.h"
#import <React/RCTViewManager.h>

@implementation RNYotiFaceCaptureView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    self.rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
    self.faceCaptureViewController = [FaceCapture faceCaptureViewController];
    self.faceCaptureViewController.delegate = self;
    self.faceCaptureViewController.view.backgroundColor = [UIColor clearColor];
    [self.faceCaptureViewController.view setFrame:self.bounds];
    [self.rootViewController addChildViewController:self.faceCaptureViewController];
    [self addSubview:self.faceCaptureViewController.view];
    [self bringSubviewToFront:self.faceCaptureViewController.view];
    [self.faceCaptureViewController didMoveToParentViewController:self.rootViewController];
    self.faceCaptureConfiguration = [[FaceCaptureConfiguration alloc] init];
    return self;
}

- (void)startFCCamera {
    [self.faceCaptureViewController startCamera];
}

- (void)stopFCCamera {
    [self.faceCaptureViewController stopCamera];
}

- (void)stopFCAnalyzing {
    [self.faceCaptureViewController stopAnalyzing];
}

- (void)startFCAnalyzing {
    [self.faceCaptureViewController startAnalyzingWithConfiguration:self.faceCaptureConfiguration];
}

// MARK: - Prop setters

-(void)setRequireEyesOpen:(BOOL *)requireEyesOpen {
    if (requireEyesOpen) {
        [self.faceCaptureConfiguration enableEyesNotOpenValidationOption];
        return;
    }
    [self.faceCaptureConfiguration disableEyesNotOpenValidationOption];
}

-(void)setRequireValidAngle:(BOOL *)requireValidAngle {
    if (requireValidAngle) {
        [self.faceCaptureConfiguration enableFaceNotStraightValidationOption];
        return;
    }
    [self.faceCaptureConfiguration disableFaceNotStraightValidationOption];
}

-(void)setRequireBrightEnvironment:(BOOL *)requireBrightEnvironment {
    if (requireBrightEnvironment) {
        [self.faceCaptureConfiguration setEnvironmentLuminosityValidationWithThreshold:EnvironmentLuminosityThresholdFlexible];
        return;
    }
    [self.faceCaptureConfiguration disableEnvironmentLuminosityValidationOption];
}

-(void)setFaceCenter:(NSArray *)faceCenter {
    CGPoint point = CGPointMake(
        [(NSNumber *)[faceCenter objectAtIndex:0] floatValue],
        [(NSNumber *)[faceCenter objectAtIndex:1] floatValue]
    );
    [self.faceCaptureConfiguration setFaceCenter: point];
}

-(void)setRequiredStableFrames:(NSNumber *)requiredStableFrames {
    [self.faceCaptureConfiguration enableFaceNotStableValidationOptionWithRequiredFrames:[requiredStableFrames integerValue]];
}

-(void)setImageQuality:(NSInteger *)imageQuality {
    if (imageQuality == (NSInteger *)FaceCaptureImageQualityLow ) {
        self.faceCaptureConfiguration.imageQuality = FaceCaptureImageQualityLow;
        return;
    }

    if (imageQuality == (NSInteger *)FaceCaptureImageQualityMedium ) {
        self.faceCaptureConfiguration.imageQuality = FaceCaptureImageQualityMedium;
        return;
    }

    
    if (imageQuality == (NSInteger *)FaceCaptureImageQualityHigh ) {
        self.faceCaptureConfiguration.imageQuality = FaceCaptureImageQualityHigh;
        return;
    }
    self.faceCaptureConfiguration.imageQuality = FaceCaptureImageQualityDefault;
}

// MARK: - Face capture delegate

- (void)faceCaptureDidAnalyzeImage:(UIImage * _Nullable)originalImage withAnalysis:(FaceCaptureAnalysis * _Nonnull)analysis {
    NSData *originalImageBase64 = [UIImageJPEGRepresentation(originalImage, 1.0) base64EncodedDataWithOptions:NSDataBase64Encoding64CharacterLineLength];
    NSString *originalImageDataString = [[NSString alloc] initWithData:originalImageBase64 encoding:NSUTF8StringEncoding];

    NSData *croppedImageBase64 = [analysis.croppedImageData base64EncodedDataWithOptions:NSDataBase64Encoding64CharacterLineLength];
    NSString *croppedImageDataString = [[NSString alloc] initWithData:croppedImageBase64 encoding:NSUTF8StringEncoding];

    self.onFaceCaptureAnalyzedImage(@{
        @"croppedImage": croppedImageDataString,
        @"croppedFaceBoundingBox": @{
                @"x": @(analysis.croppedImageFaceCoordinates.origin.x),
                @"y": @(analysis.croppedImageFaceCoordinates.origin.y),
                @"width": @(analysis.croppedImageFaceCoordinates.size.width),
                @"height": @(analysis.croppedImageFaceCoordinates.size.height),
        },
        @"faceBoundingBox": @{
                @"x": @(analysis.originalImageFaceCoordinates.origin.x),
                @"y": @(analysis.originalImageFaceCoordinates.origin.y),
                @"width": @(analysis.originalImageFaceCoordinates.size.width),
                @"height": @(analysis.originalImageFaceCoordinates.size.height),
        },
        @"originalImage": originalImageDataString,
    });
}

static NSString *causeFromAnalysisError(FaceCaptureAnalysisError error) {
    switch (error) {
        case FaceCaptureAnalysisErrorFaceTooBig:           return @"FaceCaptureAnalysisErrorFaceTooBig";
        case FaceCaptureAnalysisErrorEyesNotOpen:          return @"FaceCaptureAnalysisErrorEyesNotOpen";
        case FaceCaptureAnalysisErrorFaceTooSmall:         return @"FaceCaptureAnalysisErrorFaceTooSmall";
        case FaceCaptureAnalysisErrorFaceNotStable:        return @"FaceCaptureAnalysisErrorFaceNotStable";
        case FaceCaptureAnalysisErrorNoFaceDetected:       return @"FaceCaptureAnalysisErrorNoFaceDetected";
        case FaceCaptureAnalysisErrorFaceNotCentered:      return @"FaceCaptureAnalysisErrorFaceNotCentered";
        case FaceCaptureAnalysisErrorFaceNotStraight:      return @"FaceCaptureAnalysisErrorFaceNotStraight";
        case FaceCaptureAnalysisErrorFaceAnalysisFailed:   return @"FaceCaptureAnalysisErrorFaceAnalysisFailed";
        case FaceCaptureAnalysisErrorMultipleFaces:        return @"FaceCaptureAnalysisErrorMultipleFaces";
        case FaceCaptureAnalysisErrorEnvironmentTooDark:   return @"FaceCaptureAnalysisErrorEnvironmentTooDark";
        default:                                           return @"Unknown Face Capture Analysis Error";
    }
}

- (void)faceCaptureDidAnalyzeImage:(UIImage * _Nullable)originalImage withError:(enum FaceCaptureAnalysisError)error {
    @autoreleasepool {
        NSData *originalImageBase64 = [UIImagePNGRepresentation(originalImage) base64EncodedDataWithOptions:NSDataBase64Encoding64CharacterLineLength];

        self.onFaceCaptureImageAnalysisFailed(@{
            @"originalImage": originalImageBase64,
            @"cause": causeFromAnalysisError(error),
        });
    }
}

- (void)faceCaptureStateDidChangeTo:(enum FaceCaptureState)state {
    switch (state) {
        case FaceCaptureStateAnalyzing:
            self.onFaceCaptureStateChanged(@{ @"state": @"FaceCaptureStateAnalyzing" });
            break;
        case FaceCaptureStateCameraReady:
            self.onFaceCaptureStateChanged(@{ @"state": @"FaceCaptureStateCameraReady" });
            break;
        case FaceCaptureStateCameraStopped:
            self.onFaceCaptureStateChanged(@{ @"state": @"FaceCaptureStateCameraStopped" });
            break;

        default:
            self.onFaceCaptureStateChanged(@{ @"state": @"Unknown Face Capture State" });
            break;
    }
}

- (void)faceCaptureStateFailedWithError:(FaceCaptureStateError *)error {
    switch (error.code) {
        case FaceCaptureStateErrorCodeCameraInitializingError:
            self.onFaceCaptureStateFailed(@{ @"state": @"FaceCaptureStateErrorCameraInitializingError" });
            break;
        case FaceCaptureStateErrorCodeInvalidState:
            self.onFaceCaptureStateFailed(@{ @"state": @"FaceCaptureStateErrorInvalidState" });
            break;
        case FaceCaptureStateErrorCodeCameraNotAccessible:
            self.onFaceCaptureStateFailed(@{ @"state": @"FaceCaptureStateErrorCameraNotAccessible:" });
            break;

        default:
            self.onFaceCaptureStateFailed(@{ @"state": @"Unknown Face Capture State Error" });
            break;
    }
}

@end
