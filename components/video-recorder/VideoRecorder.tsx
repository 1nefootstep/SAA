import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CameraDevice,
  CameraDeviceFormat,
  CameraRuntimeError,
  frameRateIncluded,
  FrameRateRange,
  sortDevices,
  sortFormats,
  useCameraDevices,
} from "react-native-vision-camera";
import { useIsForeground } from "../../hooks/useIsForeground";

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
  return format.frameRateRanges.find((range) => {
    return frameRateIncluded(range, fps);
  }) !== undefined;
}

export interface VideoRecorderProps {
  cameraRef: RefObject<Camera>;
}

export default function VideoRecorder(props: VideoRecorderProps) {
  // const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices("wide-angle-camera");
  const device = devices.back;

  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;
  const [fps, setFps] = useState<number>(50);

  const format = useMemo(() => {
    const foundFormat = device?.formats.find((format)=>{
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
    <Camera
      style={[StyleSheet.absoluteFill,{zIndex: -1}]}
      ref={props.cameraRef}
      device={device}
      format={format}
      fps={fps}
      isActive={isActive}
      video={true}
      audio={true}
    />
  );
}
