import * as React from 'react';
import AutoHeightImage from 'react-native-auto-height-image';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from 'react-native';
import YotiFaceCapture, {
  IMAGE_QUALITY_MEDIUM,
} from '@getyoti/react-native-yoti-face-capture';

export default function App() {
  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;
  const YotiFaceCaptureRef = React.useRef(null);

  const [base64, setBase64] = React.useState(false);
  const [cameraIsRunning, setCameraIsRunning] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [latestState, setLatestState] = React.useState('');

  React.useEffect(() => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else {
      permission = PERMISSIONS.ANDROID.CAMERA;
    }

    check(permission)
      .then((result) => {
        if (result !== RESULTS.GRANTED) {
          request(permission).catch(() =>
            alert('Camera permission could not be obtained.')
          );
        }
      })
      .catch(() => {
        alert('Camera permission request failed.');
      });
  }, []);

  function buttonLabel() {
    if (!cameraIsRunning) {
      return 'Start Camera';
    }
    if (!isAnalyzing) {
      return 'Start Analyzing';
    }
    if (isAnalyzing) {
      return 'Stop Analyzing + Camera';
    }
    return 'Stop Camera';
  }

  return (
    <>
      <YotiFaceCapture
        imageQuality={IMAGE_QUALITY_MEDIUM}
        requireEyesOpen={false}
        requiredStableFrames={1}
        requireValidAngle={false}
        requireBrightEnvironment
        scanningArea={[0, 0, windowWidth, windowHeight]}
        onFaceCaptureAnalyzedImage={(result) => {
          const { croppedImage } = result;
          const uri = `data:image/jpg;base64,${croppedImage}`;
          if (uri !== base64) {
            setBase64(uri);
          }
          setLatestState('Valid Face');
        }}
        onFaceCaptureImageAnalysisFailed={({ cause }) => {
          setLatestState(`Failed - ${cause}`);
        }}
        onFaceCaptureStateChanged={(state) => {
          setLatestState(state);
        }}
        onFaceCaptureStateFailed={(reason) => {
          setLatestState(reason);
        }}
        style={styles.aperture}
        ref={YotiFaceCaptureRef}
      />
      {base64 && (
        <View style={styles.previewContainer}>
          <AutoHeightImage
            width={100}
            source={{
              uri: base64,
            }}
            style={styles.preview}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Text style={styles.log}>{latestState}</Text>
        <Button
          onPress={() => {
            if (!cameraIsRunning) {
              YotiFaceCaptureRef.current.startCamera();
              setCameraIsRunning(true);
              return;
            }
            if (!isAnalyzing) {
              YotiFaceCaptureRef.current.startAnalyzing();
              setIsAnalyzing(true);
              return;
            }
            YotiFaceCaptureRef.current.stopAnalyzing();
            YotiFaceCaptureRef.current.stopCamera();
            setIsAnalyzing(false);
            setCameraIsRunning(false);
          }}
        >
          {buttonLabel()}
        </Button>
      </View>
    </>
  );
}

function Button({ children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aperture: {
    width: '100%',
    height: '100%',
    marginVertical: 0,
  },
  buttonContainer: {
    width: '100%',
    zIndex: 10,
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  log: {
    color: '#000000',
    fontWeight: 'bold',
  },
  previewContainer: {
    width: 120,
    zIndex: 20,
    position: 'absolute',
    top: 5,
    right: 5,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: 100,
  },
  button: {
    backgroundColor: '#2d9fff',
    margin: 5,
    marginHorizontal: 20,
    borderRadius: 5,
    padding: 10,
    zIndex: 1000,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 20 },
});
