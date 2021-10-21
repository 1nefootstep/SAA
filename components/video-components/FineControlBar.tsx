// working control bar on expo snack
import React, { RefObject, useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Constants from "expo-constants";
import Svg, { Line } from "react-native-svg";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Video } from "expo-av";

import { default as VKB } from "../../state_management/VideoKnowledgeBank";

const MinorAxis = (props) => {
  const yOffset = props.transformY ?? 0;
  return (
    <Svg position="absolute" zIndex={0}>
      <Line
        x1={0 + props.transformX}
        y1={7.5 + yOffset}
        x2={0 + props.transformX}
        y2={22.5 + yOffset}
        stroke="white"
        strokeWidth="2"
      />
    </Svg>
  );
};

const MajorAxis = (props) => {
  const yOffset = props.transformY ?? 0;
  return (
    <Svg position="absolute" zIndex={0}>
      <Line
        x1={0 + props.transformX}
        y1={yOffset}
        x2={0 + props.transformX}
        y2={30 + yOffset}
        stroke="white"
        strokeWidth="3"
      />
    </Svg>
  );
};

const CenterAxis = (props) => {
  return (
    <View
      style={{
        position: "absolute",
        width: 3,
        height: 35,
        zIndex: 20,
        left: props.transformX,
        backgroundColor: "red",
      }}
    />
  );
};

const MajorAndMinorAxis = (props) => {
  return (
    <>
      <MinorAxis transformX={0 + props.transformX} transformY={2} />
      <MajorAxis
        transformX={props.tickWidth / 2 + props.transformX}
        transformY={2}
      />
    </>
  );
};

const FineControlBarInner = (props) => {
  const widthOfTicks = props.tickWidth ?? 40;
  const n = Math.ceil(props.width / widthOfTicks) + 1;
  const [screwState, setScrewState] = useState(0);
  const [movingState, setMovingState] = useState(0);

  const calculateState = (screwState + movingState) % widthOfTicks;
  const [baseFrameNumber, setBaseFrameNumber] = useState<number>(0);
  const frameDisplacement =
    screwState + movingState > widthOfTicks
      ? -1 -
        Math.floor((movingState - (widthOfTicks - screwState)) / widthOfTicks)
      : screwState + movingState < 0
      ? 1 + Math.floor(Math.abs(movingState + screwState) / widthOfTicks)
      : 0;
  return (
    <View style={styles.container}>
      <CenterAxis transformX={props.width / 2} />
      <PanGestureHandler
        onGestureEvent={({ nativeEvent }) => {
          if (props.isLoaded) {
            setMovingState(nativeEvent.translationX);
            console.log(baseFrameNumber + frameDisplacement);
            props.videoRef.current!.setPositionAsync(
              VKB.frameNumberToTime(baseFrameNumber + frameDisplacement),
              { toleranceMillisBefore: 0, toleranceMillisAfter: 0 }
            );
          }
        }}
        onBegan={() => {
          console.log("press in");
          setBaseFrameNumber(props.currentFrameNumber);
        }}
        onEnded={() => {
          console.log("press out");
          setScrewState(calculateState);
          setMovingState(0);
          // console.log(screwState);
        }}
      >
        <View
          onLayout={props.onLayout}
          style={{ flex: 1, flexDirection: "row" }}
        >
          {[...Array(n)].map((e, i) => (
            <MajorAndMinorAxis
              key={i}
              tickWidth={widthOfTicks}
              transformX={calculateState + (i - 1) * widthOfTicks}
            />
          ))}
        </View>
      </PanGestureHandler>
    </View>
  );
};

export interface FineControlBarProps {
  isLoaded: boolean;
  currentFrameNumber: number;
  totalFrames: number;
  videoRef: RefObject<Video>;
  majorTickHeight?: number;
  tickWidth?: number;
}

export default function FineControlBar(props: FineControlBarProps) {
  const [width, setWidth] = React.useState(0);
  return (
    <FineControlBarInner
      onLayout={(event) => {
        var { x, y, width, height } = event.nativeEvent.layout;
        setWidth(width);
      }}
      currentFrameNumber={props.currentFrameNumber}
      totalFrames={props.totalFrames}
      width={width}
      tickWidth={props.tickWidth}
      videoRef={props.videoRef}
      isLoaded={props.isLoaded}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
