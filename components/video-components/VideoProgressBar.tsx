import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";

import { Video, AVPlaybackStatus } from "expo-av";
import { RefObject, useRef, useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";

export interface VideoProgressBarProps {
  // status: AVPlaybackStatus;
  positionMillis: number;
  durationMillis: number;
  videoRef: RefObject<Video>;
  trackMarks?: Array<number>;
}

export default function VideoProgressBar(props: VideoProgressBarProps) {
  const handleOnValueChange = (value: number | Array<number>) => {
    let valueNum: number;
    if (Array.isArray(value)) {
      valueNum = value[0];
    } else {
      valueNum = value;
    }
    if (props.videoRef.current !== null) {
      props.videoRef.current
        .setPositionAsync(valueNum, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        })
        .catch((rejection) => {
          /*do nothing to skipped promises*/
        });
    }
  };

  const handleStartSlide = () => {
    if (props.videoRef.current !== null) {
      props.videoRef.current.pauseAsync();
    }
  };

  const renderTrackMarkComponent = (index: number) => {
    if (props.trackMarks === null || props.trackMarks === undefined) {
      return;
    }
    const currentMarkValue = props.trackMarks[index];
    const currentSliderValue = props.positionMillis;
    const style =
      currentMarkValue > Math.max(currentSliderValue)
        ? styles.activeMark
        : styles.inactiveMark;
    return <View style={style} />;
  };

  return (
    <View style={styles.progressBarRow}>
      <View style={styles.progressBar}>
        <Slider
          minimumValue={0}
          thumbStyle={{ backgroundColor: "green" }}
          step={1}
          trackMarks={props.trackMarks}
          // trackMarks={[1, 1000, 2000, 3000]}
          renderTrackMarkComponent={renderTrackMarkComponent}
          value={props.positionMillis}
          onValueChange={handleOnValueChange}
          onSlidingStart={handleStartSlide}
          maximumValue={props.durationMillis}
          trackClickable={true}
          minimumTrackTintColor="red"
          maximumTrackTintColor="#eee"
        />
      </View>
    </View>
  );
}

const borderWidth = 4;
const styles = StyleSheet.create({
  progressBarRow: {
    // flex: 1,
    zIndex: 2,
    height: 30,
    flexDirection: "row",
    backgroundColor: "black",
    margin: 5,
    alignItems: "center",
  },
  progressBar: {
    height: 30,
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    backgroundColor: 'black',
  },
  activeMark: {
    borderColor: "red",
    borderWidth,
    left: -borderWidth / 2,
  },
  inactiveMark: {
    borderColor: "grey",
    borderWidth,
    left: -borderWidth / 2,
  },
});
