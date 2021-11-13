import * as React from "react";

import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Camera,
  CameraCaptureError,
  VideoFile,
} from "react-native-vision-camera";

import FileHandler from "../../FileHandler/FileHandler";
import { Text, View } from "../Themed";
import { default as AKB } from "../../state_management/AKB/AnnotationKnowledgeBank";
import { Platform } from "expo-modules-core";
import { isNullOrUndefined } from "../Util";

export interface RecordStartStopButtonProps {
  style: any;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setTimestampsDone: React.Dispatch<React.SetStateAction<number>>;
  setRecordStartTime: React.Dispatch<React.SetStateAction<Date>>;
  cameraRef: React.RefObject<Camera>;
}

async function saveVideo(tag) {
  if (Platform.OS === "android" && !(await FileHandler.readWritePermission())) {
    return;
  }
  FileHandler.saveVideoToCameraRoll(tag)
    .then(() => console.log("successfully moved."))
    .catch((err) => console.log(`failed to move: ${err}`));
}

function Icon(props: { isRecording: boolean }) {
  if (props.isRecording) {
    return <Entypo name="controller-stop" size={80} color="red" />;
  }
  return <Entypo name="controller-record" size={80} color="red" />;
}

export default function RecordStartStopButton(
  props: RecordStartStopButtonProps
) {
  const cameraRef = props.cameraRef;
  const isRecording = props.isRecording;
  const setIsRecording = props.setIsRecording;
  const setTimestampsDone = props.setTimestampsDone;
  const setRecordStartTime = props.setRecordStartTime;

  return (
    <View style={props.style}>
      <TouchableOpacity
        onPress={() => {
          if (isNullOrUndefined(cameraRef.current)) {
            console.log('undefined');
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
                FileHandler.saveVideoAndAnnotations(videoFile.path);
                AKB.clearAnnotations();
                saveVideo(videoFile.path)
                  .then(() => console.log("saved successfully."))
                  .catch((err) => console.log(err));

                setTimestampsDone(0);
                setIsRecording(false);
                AKB.reset();
              },
            });
            setRecordStartTime(new Date());
          } else {
            cameraRef.current!.stopRecording();
          }
        }}
      >
        <Icon isRecording={isRecording} />
      </TouchableOpacity>
    </View>
  );
}
