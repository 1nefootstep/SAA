import React, { RefObject } from "react";
import { View } from "react-native";

import { Video } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { default as AKB } from "../../../state_management/AKB/AnnotationKnowledgeBank";

export interface StepButtonProps {
  isLoaded: boolean;
  currentPositionMillis: number;
  videoRef: RefObject<Video>;
}

export default function StepButtons(props: StepButtonProps) {
  const goToPrevAnnotation = () => {
    if (props.isLoaded) {
      console.log("StepButtons - prev pressed");
      const response = AKB.prevAnnotation(props.currentPositionMillis);
      if (response.found) {
        console.log("StepButtons - resp found");
        props.videoRef.current!.setPositionAsync(response.time, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        });
      } else {
        console.log("StepButtons - resp not found");
      }
    }
  };
  const goToNextAnnotation = () => {
    if (props.isLoaded) {
      const response = AKB.nextAnnotation(props.currentPositionMillis);
      if (response.found) {
        props.videoRef.current!.setPositionAsync(response.time, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        });
      }
    }
  };

  const sizeOfIcon = 30;

  return (
    <View style={{ flex: 1, marginVertical: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <MaterialCommunityIcons
          onPress={() => goToPrevAnnotation()}
          name="step-backward"
          size={sizeOfIcon}
          color="blue"
        />
        <MaterialCommunityIcons
          onPress={() => goToNextAnnotation()}
          name="step-forward"
          size={sizeOfIcon}
          color="blue"
        />
      </View>
    </View>
  );
}
