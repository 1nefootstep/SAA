import React, { useEffect, useState } from "react";
import { StyleSheet, View, PanResponder } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { AntDesign } from "@expo/vector-icons";

import { Text } from "../../Themed";
import { default as AKB } from "../../../state_management/AKB/AnnotationKnowledgeBank";
import { is } from "@babel/types";

export interface StrokeCounterProps {
  currentPositionMillis: number;
  isLoaded: boolean;
}

export default function StrokeCounter(props: StrokeCounterProps) {
  let searchStrokeResult = AKB.getStrokeInTime(props.currentPositionMillis);

  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);
  useEffect(() => {
    if (!isEditing) {
      searchStrokeResult = AKB.getStrokeInTime(props.currentPositionMillis);
      if (searchStrokeResult.found) {
        setStrokeCount(searchStrokeResult.stroke.strokeCount);
      } else {
        setStrokeCount(0);
      }
    }
  });
  const endStroke = () => {
    if (searchStrokeResult.found && !searchStrokeResult.stroke.hasEndTime) {
      AKB.addEndTimeByIndex(
        searchStrokeResult.index,
        props.currentPositionMillis
      );
      setForceUpdate(!forceUpdate);
      setIsEditing(false);
    }
  };

  const deleteStroke = () => {
    if (searchStrokeResult.found) {
      AKB.deleteStrokeCountByIndex(searchStrokeResult.index);
      setForceUpdate(!forceUpdate);
      setIsEditing(false);
    }
  };

  const startStroke = () => {
    AKB.addStrokeCount(props.currentPositionMillis);
    setIsEditing(true);
    setForceUpdate(!forceUpdate);
  };

  const updateStroke = () => {
    if (strokeCount > 0 && searchStrokeResult.found) {
      const index = searchStrokeResult.index;
      AKB.updateStrokeCountByIndex(index, strokeCount);
    }
  };

  const [timeoutId, setTimeoutId] = useState(-1);
  const timeoutIncrement = () => {
    setStrokeCount((p) => p + 1);
    setTimeoutId(
      setTimeout((_) => {
        timeoutIncrement();
      }, 100)
    );
  };

  const timeoutDecrement = () => {
    setStrokeCount((p) => (p > 0 ? p - 1 : 0));
    setTimeoutId(
      setTimeout((_) => {
        timeoutDecrement();
      }, 100)
    );
  };
  const stopTimeout = () => {
    clearTimeout(timeoutId);
    updateStroke();
    setTimeoutId(-1);
  };
  useEffect(
    () => () => {
      clearTimeout(timeoutId);
    },
    [timeoutId]
  );

  return (
    <>
      {props.isLoaded && (
        <>
          {!searchStrokeResult.found && (
            <>
              <TouchableOpacity
                onPress={startStroke}
                style={styles.paddedButtons}
              >
                <Text>Start Stroke</Text>
              </TouchableOpacity>
            </>
          )}
          {searchStrokeResult.found && (
            <>
              <View style={styles.paddedButtons}>
                <Text>Strokes: {strokeCount}</Text>
              </View>
              {!searchStrokeResult.stroke.hasEndTime && (
                <>
                  <TouchableOpacity
                    onPressIn={timeoutIncrement}
                    onPressOut={stopTimeout}
                    style={styles.paddedButtons}
                  >
                    <AntDesign name="plus" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPressIn={timeoutDecrement}
                    onPressOut={stopTimeout}
                    style={styles.paddedButtons}
                  >
                    <AntDesign name="minus" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={endStroke}
                    style={styles.paddedButtons}
                  >
                    <Text>End Stroke</Text>
                  </TouchableOpacity>
                </>
              )}
              {
                <TouchableOpacity
                  onPress={deleteStroke}
                  style={styles.paddedButtons}
                >
                  <Text>Delete Stroke</Text>
                </TouchableOpacity>
              }
            </>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paddedButtons: {
    margin: 3,
  },
});
