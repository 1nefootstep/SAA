import * as React from "react";

import { Text } from "../Themed";

export interface FrameDisplay {
  positionFrameNumber: number;
  durationFrameNumber: number;
}

export default function FrameDisplay(props: FrameDisplay) {
  const durationToDisplay: string =
    props.durationFrameNumber !== 0 ? props.durationFrameNumber.toString() : "?";
  return (
    <Text>
      {props.positionFrameNumber} / {durationToDisplay}
    </Text>
  );
}
