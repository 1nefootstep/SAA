import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  PanResponder,
  Alert,
} from "react-native";
import {
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";

import { formatTimeFromPosition } from "../../TimeFormattingUtil";

export interface TimerToolProps {
  isActive: boolean;
  startPositionMillis: number;
  currentPositionMillis: number;
  timers: Array<number>;
  setTimers: (a: Array<number>) => void;
}

export default function TimeDisplay(props: TimerToolProps) {
  const difference = props.currentPositionMillis - props.startPositionMillis;
  const absoluteDifference = Math.abs(difference);
  const formatted = formatTimeFromPosition(absoluteDifference);
  let display: string;
  if (difference >= 0) {
    display = "+" + formatted;
  } else {
    display = "-" + formatted;
  }

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;
  const removeTimer = () => {
    props.setTimers(props.timers.filter(e => e != props.startPositionMillis));
  };

  return (
    <>
      {props.isActive && (
        <LongPressGestureHandler
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              Alert.alert("Remove timer?", "", [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: removeTimer,
                },
              ]);
            }
          }}
          minDurationMs={800}
        >
          <Animated.View
            style={{
              position: "absolute",
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
              zIndex: 1,
            }}
            {...panResponder.panHandlers}
          >
            <View style={styles.timerBox}>
              <Text style={{ color: "white", }}>{display}</Text>
            </View>
          </Animated.View>
        </LongPressGestureHandler>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  timerBox: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 10,
    borderColor: "#fff000",
    borderWidth: 2,
  },
});
