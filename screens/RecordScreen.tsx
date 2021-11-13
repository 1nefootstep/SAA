import React, { useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";

import { Snackbar } from "react-native-paper";
import { Camera } from "react-native-vision-camera";

import { Text, View } from "../components/Themed";

import RecordStartStopButton from "../components/recorder/RecordStartStopButton";
import VideoRecorder from "../components/recorder/VideoRecorder";
import FileHandler from "../FileHandler/FileHandler";
import MenuButton from "../components/MenuButton";
import SelectMode from "../components/recorder/SelectMode";
import TimestampButton from "../components/recorder/TimestampButton";

async function cameraPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    let finalCameraPermission = cameraPermission;
    let finalMicrophonePermission = microphonePermission;
    console.log(
      `cameraPermission: ${cameraPermission} microphonePermission: ${microphonePermission}`
    );
    if (cameraPermission !== "authorized") {
      const newCameraPermission = await Camera.requestCameraPermission();
      finalCameraPermission = newCameraPermission;
    }
    if (microphonePermission !== "authorized") {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();
      finalMicrophonePermission = newMicrophonePermission;
    }
    return (
      finalCameraPermission === "authorized" &&
      finalMicrophonePermission === "authorized"
    );
  }
  return true;
}

export default function RecordScreen({ navigation }) {
  React.useEffect(() => {
    (async () => {
      await cameraPermission();
      await FileHandler.readWritePermission();
      setGotPermission(true);
    })();
  }, []);

  const [gotPermission, setGotPermission] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [recordStartTime, setRecordStartTime] = useState<Date>(new Date());
  const [millisSnackbar, setMillisSnackbar] = useState<number>(0);
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timestampsDone, setTimestampsDone] = useState<number>(0);
  const [snackbarText, setSnackbarText] = useState<string>("");

  return (
    <>
      {gotPermission && (
        <View style={styles.container}>
          <MenuButton navigation={navigation} />
          <RecordStartStopButton
            style={styles.recordButton}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            setTimestampsDone={setTimestampsDone}
            setRecordStartTime={setRecordStartTime}
            cameraRef={cameraRef}
          />

          <TimestampButton
            style={styles.timestampButton}
            isRecording={isRecording}
            recordStartTime={recordStartTime}
            millisSnackbar={millisSnackbar}
            setMillisSnackbar={setMillisSnackbar}
            setSnackbarVisible={setSnackbarVisible}
            timestampsDone={timestampsDone}
            setTimestampsDone={setTimestampsDone}
            setSnackbarText={setSnackbarText}
          />

          <SelectMode style={styles.modeButton} />

          <VideoRecorder cameraRef={cameraRef} />
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={750}
          >
            {snackbarText}
          </Snackbar>
        </View>
      )}
      {!gotPermission && (
        <View>
          <Text
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            Waiting for permissions...
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recordButtonColumn: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  recordButton: {
    position: "absolute",
    top: "30%",
    right: "3%",
    backgroundColor: "transparent",
  },
  timestampButton: {
    position: "absolute",
    top: "65%",
    right: "6%",
  },
  modeButton: {
    position: "absolute",
    top: "10%",
    right: "6%",
    backgroundColor: "transparent",
  },
  zoomButton: {
    position: "absolute",
    top: "85%",
    right: "6%",
  },
  menuIcon: {
    flex: 1,
    position: "absolute",
    margin: 20,
  },
});
