#import "RNYotiFaceCaptureView.h"
#import <React/RCTViewManager.h>

@implementation RNYotiFaceCaptureView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    self.rootViewController = RCTPresentedViewController();
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
        [self.faceCaptureConfiguration enableEnvironmentLuminosityValidationOption];
        return;
    }
    [self.faceCaptureConfiguration disableEnvironmentLuminosityValidationOption];
}

-(void)setScanningArea:(NSArray *)scanningArea {
    CGRect area = CGRectMake(
        [(NSNumber *)[scanningArea objectAtIndex:0] floatValue],
        [(NSNumber *)[scanningArea objectAtIndex:1] floatValue],
        [(NSNumber *)[scanningArea objectAtIndex:2] floatValue] / [UIScreen mainScreen].scale,
        [(NSNumber *)[scanningArea objectAtIndex:3] floatValue] / [UIScreen mainScreen].scale
    );
    [self.faceCaptureConfiguration setScanningArea:area];
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

- (void)faceCaptureDidAnalyzeImage:(UIImage * _Nullable)originalImage withError:(enum FaceCaptureAnalysisError)error {
    NSData * originalImageBase64 = [UIImagePNGRepresentation(originalImage) base64EncodedDataWithOptions:NSDataBase64Encoding64CharacterLineLength];

    switch (error) {
        case FaceCaptureAnalysisErrorFaceTooBig:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorFaceTooBig" });
            break;
        case FaceCaptureAnalysisErrorEyesNotOpen:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorEyesNotOpen" });
            break;
        case FaceCaptureAnalysisErrorFaceTooSmall:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorFaceTooSmall" });
            break;
        case FaceCaptureAnalysisErrorFaceNotStable:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorFaceNotStable" });
            break;
        case FaceCaptureAnalysisErrorNoFaceDetected:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorNoFaceDetected" });
            break;
        case FaceCaptureAnalysisErrorFaceNotCentered:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorFaceNotCentered" });
            break;
        case FaceCaptureAnalysisErrorFaceNotStraight:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorFaceNotStraight" });
            break;
        case FaceCaptureAnalysisErrorFaceAnalysisFailed:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorFaceAnalysisFailed" });
            break;
        case FaceCaptureAnalysisErrorMultipleFaces:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorMultipleFaces" });
            break;
        case FaceCaptureAnalysisErrorEnvironmentTooDark:
             self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"FaceCaptureAnalysisErrorEnvironmentTooDark" });
            break;  
        default:
            self.onFaceCaptureImageAnalysisFailed(@{
                @"originalImage": originalImageBase64,
                @"cause": @"Unknown Face Capture Analysis Error" });
            break;
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

- (void)faceCaptureStateFailedWithError:(enum FaceCaptureStateError)error {
    switch (error) {
        case FaceCaptureStateErrorCameraInitializingError:
            self.onFaceCaptureStateFailed(@{ @"state": @"FaceCaptureStateErrorCameraInitializingError" });
            break;
        case FaceCaptureStateErrorInvalidState:
            self.onFaceCaptureStateFailed(@{ @"state": @"FaceCaptureStateErrorInvalidState" });
            break;
        case FaceCaptureStateErrorCameraNotAccessible:
            self.onFaceCaptureStateFailed(@{ @"state": @"FaceCaptureStateErrorCameraNotAccessible:" });
            break;

        default:
            self.onFaceCaptureStateFailed(@{ @"state": @"Unknown Face Capture State Error" });
            break;
    }
}

@end
