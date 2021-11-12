import React, { RefObject, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { Video } from "expo-av";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { View } from "../../Themed";
import CheckpointButton from "./CheckpointButton";
import { default as AKB } from "../../../state_management/AnnotationKnowledgeBank";
import StrokeCounter from "./StrokeCounter";
import StepButtons from "./StepButtons";
import UndoButton from "./UndoButton";
import { NameDistance } from "../../../state_management/AnnotationMode/AnnotationMode";
import SelectAnnotation from "./SelectAnnotation";

export interface SideMenuProps {
  isLoaded: boolean;
  currentPositionMillis: number;
  annotation: NameDistance;
  currentDistance: number;
  setCurrentDistance: React.Dispatch<React.SetStateAction<number>>;
  setSnackbarVisible: (b: boolean) => void;
  toggleIsLineToolActive: () => void;
  toggleIsTimerToolActive: () => void;
  timers: Array<number>;
  setTimers: (a: Array<number>) => void;
  videoRef: RefObject<Video>;
  setTrackTimestamp: (a: Array<number>) => void;
}

export default function MenuButton(props: SideMenuProps) {
  const addTimer = () => {
    // ensure there are no duplicate timers at same currentPositionMillis
    if (
      props.isLoaded &&
      props.timers.every((e) => e != props.currentPositionMillis)
    ) {
      props.setTimers([...props.timers, props.currentPositionMillis]);
    }
  };

  return (
    <View style={styles.sideMenu}>
      <CheckpointButton
        annotationDescription={props.annotation?.name ?? "Checkpoint"}
        distance={props.annotation?.distanceMeter ?? 0}
        isLoaded={props.isLoaded}
        currentPositionMillis={props.currentPositionMillis}
        setTrackTimestamp={props.setTrackTimestamp}
        setSnackbarVisible={props.setSnackbarVisible}
      />
      <SelectAnnotation
        isLoaded={props.isLoaded}
        currentDistance={props.currentDistance}
        setCurrentDistance={props.setCurrentDistance}
        setTrackTimestamp={props.setTrackTimestamp}
        videoRef={props.videoRef}
      />
      <TouchableOpacity
        onPress={props.toggleIsLineToolActive}
        style={styles.button}
      >
        <Ionicons name="analytics-outline" size={30} color="green" />
      </TouchableOpacity>
      <TouchableOpacity onPress={addTimer} style={styles.button}>
        <MaterialCommunityIcons name="clock-digital" size={30} color="white" />
      </TouchableOpacity>
      <UndoButton
        isLoaded={props.isLoaded}
        setTrackTimestamp={props.setTrackTimestamp}
      />

      <StepButtons
        isLoaded={props.isLoaded}
        currentPositionMillis={props.currentPositionMillis}
        videoRef={props.videoRef}
      />
      <StrokeCounter
        isLoaded={props.isLoaded}
        currentPositionMillis={props.currentPositionMillis}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sideMenu: {
    // flex: 1,
    flexGrow: 0.1,
    flexDirection: "column",
    flexWrap: "wrap",
    zIndex: 1,
    paddingHorizontal: 15,
    // backgroundColor: "purple",
  },
  button: {
    margin: 3,
  },
});
