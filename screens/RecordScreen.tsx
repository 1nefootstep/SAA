import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Snackbar } from "react-native-paper";
import AnnotationKnowledgeBank from "../state_management/AnnotationKnowledgeBank";
import {
  Camera,
  CameraCaptureError,
  VideoFile,
} from "react-native-vision-camera";

import { MenuIcon, Text, View } from "../components/Themed";
import RecordStartStopButton from "../components/video-recorder/RecordStartStopButton";
import VideoRecorder from "../components/video-recorder/VideoRecorder";
import { formatTimeFromPosition } from "../components/TimeFormattingUtil";
import FileHandler from "../FileHandler/FileHandler";
import MenuButton from "../components/MenuButton";

async function hasAndroidPermission() {
  const permissions = [
    PermissionsAndroid.PERMISSIONS.CAMERA, 
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  ];
  let allPermissionsGranted = true;
  const granted:Array<Promise<boolean>> = permissions.map(async (permission) => {
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === PermissionsAndroid.RESULTS.GRANTED;
  });

  return granted.every(async (ele: Promise<boolean>) => await ele);
}


async function saveVideo(tag) {
  if (Platform.OS === "android" && !(await hasAndroidPermission())) {
    return;
  }
  FileHandler.moveVideoToAppFolder(tag).then(()=>console.log('successfully moved.')).catch((err)=>console.log(`failed to move: ${err}`));
}


export default function TabOneScreen({ navigation }) {
  React.useEffect(() => {
    (async () => {
      await hasAndroidPermission();
    })();
  }, []);


  const [snackbarVisible, setSnackbarVisible] = React.useState<boolean>(false);
  const [recordStartTime, setRecordStartTime] = React.useState<Date>(
    new Date()
  );
  const [millisSnackbar, setMillisSnackbar] = React.useState<number>(0);
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <MenuButton navigation={navigation}/>
      <TouchableOpacity
        style={styles.recordButton}
        onPress={() => {
          if (cameraRef.current === null || cameraRef.current === undefined) {
            return;
          }
          if (!isRecording) {
            setIsRecording(true);
            cameraRef.current!.startRecording({
              flash: "off",
              onRecordingError: (err: CameraCaptureError) => {
                console.log(err);
                setIsRecording(false);
              },
              onRecordingFinished: (videoFile: VideoFile) => {
                console.log("stop recording");
                console.log(videoFile.path);
                AnnotationKnowledgeBank.saveAnnotationInfoWithVideoFilePath(videoFile.path);
                AnnotationKnowledgeBank.clearEarlyCheckpoints();
                saveVideo(videoFile.path)
                  .then(() => console.log("saved successfully."))
                  .catch((err) => console.log(err));

                setIsRecording(false);
              },
            });
            setRecordStartTime(new Date());
          } else {
            cameraRef.current!.stopRecording();
          }
        }}
      >
        <RecordStartStopButton isRecording={isRecording} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.checkpointButton}
        onPress={() => {
          if (isRecording) {
            setMillisSnackbar(new Date() - recordStartTime);
            AnnotationKnowledgeBank.addEarlyCheckpoint({timestamp: millisSnackbar});
            setSnackbarVisible(true);
          }          
          
        }}
      >
        <AntDesign name="star" size={40} color="yellow" />
      </TouchableOpacity>
      <VideoRecorder cameraRef={cameraRef} />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={750}
      >
        Added checkpoint at {formatTimeFromPosition(millisSnackbar)}
      </Snackbar>
    </View>
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
  },
  checkpointButton: {
    position: "absolute",
    top: "65%",
    right: "6%",
  },
  menuIcon: {
    flex: 1,
    position: "absolute",
    margin: 20,
  },
});
