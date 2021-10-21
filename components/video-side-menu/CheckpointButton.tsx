import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { Text } from "../Themed";
import {default as AKB} from "../../state_management/AnnotationKnowledgeBank";

export interface CheckpointButtonProps {
  annotationDescription: string;
  distance: number;
  isLoaded: boolean;
  isRealCheckpoint: boolean;
  currentPositionMillis: number;
  setTrackTimestamp: (a:Array<number>) => void;
  setSnackbarVisible: (b:boolean)=>void;
}

export default function CheckpointButton(props: CheckpointButtonProps) {
  const addCheckpoint = () => {
    if (props.isLoaded) {
      AKB.addAnnotation({
        description: props.annotationDescription,
        timestamp: props.currentPositionMillis,
        distance: props.distance,
      });
      if (props.isRealCheckpoint) {
        props.setTrackTimestamp(AKB.getAnnotationsTimestampArray());
      }
      props.setSnackbarVisible(true);
    }
  };

  return (
    <TouchableOpacity onPress={addCheckpoint} style={styles.button}>
      <Text>{props.annotationDescription}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 3,
  }
});