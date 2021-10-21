import React, { RefObject } from "react";
import { View } from "react-native";

import { Video } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { default as AKB } from "../../state_management/AnnotationKnowledgeBank";

export interface StepButtonProps {
  isLoaded: boolean;
  isRealCheckpoint: boolean;
  currentPositionMillis: number;
  videoRef: RefObject<Video>;
}

export default function StepButtons(props: StepButtonProps) {
  const goToPrevEarlyCheckpoint = () => {
    if (props.isLoaded) {
      const response = AKB.prevEarlyCheckpoint(props.currentPositionMillis);
      if (response.found) {
        props.videoRef.current!.setPositionAsync(response.time, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        });
      }
    }
  };
  const goToNextEarlyCheckpoint = () => {
    if (props.isLoaded) {
      const response = AKB.nextEarlyCheckpoint(props.currentPositionMillis);
      if (response.found) {
        props.videoRef.current!.setPositionAsync(response.time, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        });
      }
    }
  };
  const goToPrevAnnotation = () => {
    if (props.isLoaded) {
      const response = AKB.prevAnnotation(props.currentPositionMillis);
      if (response.found) {
        props.videoRef.current!.setPositionAsync(response.time, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        });
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
    <View style={{flex: 1, marginVertical: 1}}>
      <View style={{ flex: 1, flexDirection: "row",}}>
        <MaterialCommunityIcons
          onPress={() => {
            if (props.isRealCheckpoint) {
              goToPrevAnnotation();
            } else {
              goToPrevEarlyCheckpoint();
            }
          }}
          name="step-backward"
          size={sizeOfIcon}
          color="blue"
        />
        <MaterialCommunityIcons
          onPress={() => {
            if (props.isRealCheckpoint) {
              goToNextAnnotation();
            } else {
              goToNextEarlyCheckpoint();
            }
          }}
          name="step-forward"
          size={sizeOfIcon}
          color="blue"
        />
      </View>
    </View>
  );
}
