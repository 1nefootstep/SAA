import * as React from "react";

import { Text } from "../Themed";
import { formatTimeFromPosition } from "../TimeFormattingUtil";

export interface TimeDisplayProps {
  positionMillis: number;
  durationMillis: number;
}

export default function TimeDisplay(props: TimeDisplayProps) {
  const positionString = formatTimeFromPosition(props.positionMillis);
  const durationString = formatTimeFromPosition(props.durationMillis);
  return (
    <Text>
      {positionString} / {durationString}
    </Text>
  );

}
