import React, { RefObject, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { Video } from "expo-av";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Text, View } from "../../Themed";
import CheckpointButton from "./CheckpointButton";
import { default as AKB } from "../../../state_management/AKB/AnnotationKnowledgeBank";
import StepButtons from "./StepButtons";
import UndoButton from "./UndoButton";
import { NameDistance } from "../../../state_management/AnnotationMode/AnnotationMode";
import { default as Layout } from "../../../constants/Layout";
import SelectAnnotation from "./SelectAnnotation";
import StrokeCounter from "./StrokeCounter/StrokeCounter";
import { StrokeRange } from "../../../state_management/AKB/StrokeCounts";

export interface SideMenuProps {
  isLoaded: boolean;
  currentPositionMillis: number;
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
        distance={props.currentDistance}
        setCurrentDistance={props.setCurrentDistance}
        isLoaded={props.isLoaded}
        currentPositionMillis={props.currentPositionMillis}
        setTrackTimestamp={props.setTrackTimestamp}
        setSnackbarVisible={props.setSnackbarVisible}
        videoRef={props.videoRef}
      />
      <SelectAnnotation
        isLoaded={props.isLoaded}
        currentDistance={props.currentDistance}
        setCurrentDistance={props.setCurrentDistance}
        setTrackTimestamp={props.setTrackTimestamp}
        videoRef={props.videoRef}
      />
      {!Layout.isSmallDevice && (
        <TouchableOpacity
          onPress={props.toggleIsLineToolActive}
          style={styles.button}
        >
          <Ionicons name="analytics-outline" size={30} color="green" />
        </TouchableOpacity>
      )}
      {!Layout.isSmallDevice && (
        <TouchableOpacity onPress={addTimer} style={styles.button}>
          <MaterialCommunityIcons
            name="clock-digital"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      )}
      {!Layout.isSmallDevice && (
        <StepButtons
          isLoaded={props.isLoaded}
          currentPositionMillis={props.currentPositionMillis}
          videoRef={props.videoRef}
        />
      )}
      <StrokeCounter
        isLoaded={props.isLoaded}
        currentPositionMillis={props.currentPositionMillis}
      />
    </View>
  );
}

console.log(
  `width: ${Layout.window.width} height: ${Layout.window.height} isSmallDevice: ${Layout.isSmallDevice}`
);

const styles = StyleSheet.create({
  sideMenu: {
    // flex: 1,
    // flexGrow: 0.1,
    flexDirection: "column",
    // flexWrap: "wrap",
    // zIndex: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    // backgroundColor: "purple",
    height: Layout.window.width - 200,
    width: (Layout.window.height / 10) * 1.5,
    // borderColor: 'red',
    // borderWidth: 1,
  },
  annotationContainer: {
    zIndex: 1,
    flex: 1,
    alignItems: "center",
  },
  toolsContainer: {
    flex: 1,
    zIndex: -1,
  },
  button: {
    margin: 3,
  },
});
