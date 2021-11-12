import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { Text, View } from "../../components/Themed";
import { default as AKB } from "../../state_management/AnnotationKnowledgeBank";
import { formatTimeFromPosition } from "../TimeFormattingUtil";

export interface TimestampButtonInterface {
  style: any;
  isRecording: boolean;
  recordStartTime: Date;
  millisSnackbar: number;
  setMillisSnackbar: React.Dispatch<React.SetStateAction<number>>;
  setSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  timestampsDone: number;
  setTimestampsDone: React.Dispatch<React.SetStateAction<number>>;
  setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
}

export default function TimestampButton(props: TimestampButtonInterface) {
  const checkpoints = AKB.getCurrentMode().checkpointNames;
  const currIndex =
    props.timestampsDone < checkpoints.length
      ? props.timestampsDone
      : checkpoints.length - 1;
  return (
    <TouchableOpacity
      style={props.style}
      onPress={() => {
        if (props.isRecording && props.timestampsDone < checkpoints.length) {
          props.setMillisSnackbar(Date.now() - props.recordStartTime.valueOf());
          AKB.addAnnotation({
            timestamp: props.millisSnackbar,
            distance: checkpoints[currIndex].distanceMeter,
          })
          props.setSnackbarText(
            `Set ${checkpoints[currIndex].name} at ${formatTimeFromPosition(
              props.millisSnackbar
            )}`
          );
          props.setTimestampsDone((e) => e + 1);
          props.setSnackbarVisible(true);
        }
      }}
    >
      <AntDesign name="star" size={40} color="yellow" />
      <View style={{ backgroundColor: "transparent", alignItems: "center" }}>
        <Text>{checkpoints[currIndex].name}</Text>
      </View>
    </TouchableOpacity>
  );
}
