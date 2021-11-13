import React, { RefObject } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";

import { Text } from "../../Themed";
import { default as AKB } from "../../../state_management/AKB/AnnotationKnowledgeBank";
import FileHandler from "../../../FileHandler/FileHandler";
import VideoKnowledgeBank from "../../../state_management/VideoKnowledgeBank";

export interface CheckpointButtonProps {
  distance: number;
  setCurrentDistance: React.Dispatch<React.SetStateAction<number>>;
  isLoaded: boolean;
  currentPositionMillis: number;
  videoRef: RefObject<Video>;
  setTrackTimestamp: (a: Array<number>) => void;
  setSnackbarVisible: (b: boolean) => void;
}

export default function CheckpointButton(props: CheckpointButtonProps) {
  const addCheckpoint = () => {
    if (props.isLoaded) {
      const dist = props.distance;

      AKB.addAnnotation({
        timestamp: props.currentPositionMillis,
        distance: dist,
      });
      props.setTrackTimestamp(AKB.getAnnotationsTimestampArray());
      const nextAnnResponse = AKB.nextAnnotation(props.currentPositionMillis);
      if (nextAnnResponse.found) {
        props.videoRef.current!.setPositionAsync(nextAnnResponse.time, {
          toleranceMillisAfter: 0,
          toleranceMillisBefore: 0,
        });
      }
      const nextDistance = AKB.getCurrentMode().nextDistance(dist);
      if (nextDistance !== -1) {
        props.setCurrentDistance(nextDistance);
      }
      props.setSnackbarVisible(true);
    }
  };

  return (
    <TouchableOpacity onPress={addCheckpoint} style={styles.button}>
      <Ionicons name="checkmark" size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 3,
  },
});
