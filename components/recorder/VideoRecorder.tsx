import React, { RefObject, useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { Fontisto } from "@expo/vector-icons";

import {
  Camera,
  CameraDeviceFormat,
  CameraProps,
  frameRateIncluded,
  useCameraDevices,
} from "react-native-vision-camera";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Text, View } from "../Themed";
import { useIsForeground } from "../../hooks/useIsForeground";
import { Slider } from "react-native-elements";

function getMaxFps(format: CameraDeviceFormat): number {
  return format.frameRateRanges.reduce((prev, curr) => {
    if (curr.maxFrameRate > prev) {
      return curr.maxFrameRate;
    } else {
      return prev;
    }
  }, 0);
}

function supportsFps(format: CameraDeviceFormat, fps: number): boolean {
  return (
    format.frameRateRanges.find((range) => {
      return frameRateIncluded(range, fps);
    }) !== undefined
  );
}

export interface VideoRecorderProps {
  cameraRef: RefObject<Camera>;
}

const AnimatedCamera = Animated.createAnimatedComponent(Camera);
Animated.addWhitelistedNativeProps({
  zoom: true,
});

export default function VideoRecorder(props: VideoRecorderProps) {
  // const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices("wide-angle-camera");
  const device = devices.back;

  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;
  const [fps, setFps] = useState<number>(50);
  const zoom = useSharedValue<number>(device?.neutralZoom ?? 1);
  const [zoomValue, setZoomValue] = useState<number>(zoom.value);
  const [showZoom, setShowZoom] = useState<boolean>(false);

  // const onRandomZoomPress = useCallback(() => {
  //   zoom.value = withSpring(10);
  //   console.log(zoom.value);
  //   console.log(device?.minZoom);
  //   console.log(device?.neutralZoom);
  //   console.log(device?.maxZoom);
  // }, []);

  const toggleZoomSlider = useCallback(() => {
    setShowZoom(!showZoom);
  }, [showZoom]);

  const setZoom = useCallback(
    (value) => {
      setZoomValue(value);
      zoom.value = withSpring(value);
    },
    [zoomValue]
  );

  const animatedProps = useAnimatedProps<Partial<CameraProps>>(
    () => ({ zoom: zoom.value }),
    [zoom]
  );

  const renderBallIndicator = useCallback(() => {
    return (
      <View
        style={{
          height: 30,
          width: 30,
          borderRadius: 15,
          backgroundColor: "#ddd",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>{zoomValue}</Text>
      </View>
    );
  }, [zoomValue]);

  const format = useMemo(() => {
    const foundFormat = device?.formats.find((format) => {
      return supportsFps(format, 50);
    });

    if (foundFormat) {
      setFps(50);
      return foundFormat;
    } else {
      setFps(25);
      return undefined;
    }
  }, [device?.formats]);

  if (isActive) {
    console.log("is active");
    console.log(`fps is: ${fps}`);
    // console.log(`is shooting at 50fps: ${is50Fps}`);
  } else {
    console.log("is not active");
  }
  if (device == null) {
    console.log("device is null");
    return (
      <View>
        <Text>Loading camera...</Text>
      </View>
    );
  }
  console.log("device is not null");

  return (
    <>
      <AnimatedCamera
        style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
        ref={props.cameraRef}
        device={device}
        format={format}
        fps={fps}
        isActive={isActive}
        video={true}
        audio={true}
        zoom={zoomValue}
        animatedProps={animatedProps}
      />
      <TouchableOpacity style={styles.zoomButton} onPress={toggleZoomSlider}>
        <Fontisto name="zoom" size={40} color="black" />
      </TouchableOpacity>
      {showZoom && (
        <Slider
          style={styles.zoomSlider}
          value={zoomValue}
          onValueChange={setZoom}
          step={0.1}
          orientation="vertical"
          maximumValue={device.maxZoom}
          minimumValue={device.minZoom}
          thumbStyle={styles.sliderButton}
          thumbProps={{
            children: <Text>{zoomValue.toFixed(1)}x</Text>,
          }}
        />
      )}
    </>
  );
}
const styles = StyleSheet.create({
  zoomButton: {
    position: "absolute",
    top: "75%",
    left: "3%",
  },
  zoomSlider: {
    position: "absolute",
    top: "25%",
    left: "10%",
    width: 10,
    height: 150,
  },
  sliderButton: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ddd",
    // width: 40,
    // height: 40,
    // borderRadius: 20,
  },
});
