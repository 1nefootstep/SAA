import * as React from "react";
import { Entypo } from "@expo/vector-icons";

export interface RecordStartStopButtonProps {
  isRecording: boolean;
}

export default function RecordStartStopButton(props: RecordStartStopButtonProps) {
  if (props.isRecording) {
    return <Entypo name="controller-stop" size={80} color="red" />
  }
  return (
    <Entypo name="controller-record" size={80} color="red" />
  );
}