import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { StyleSheet, PanResponder } from "react-native";
import { Button } from "react-native-paper";

import { View } from "../../../Themed";
import { formatTimeFromPosition } from "../../../TimeFormattingUtil";

export interface SetTimeButtonsProps {
  currentPosition: number;
  t1: number;
  setT1: (n: number) => void;
  t2: number;
  setT2: (n: number) => void;
}

export default function SetTimeButtons(props: SetTimeButtonsProps) {
  return (
    <View style={styles.container}>
      <Button
        icon="ray-start"
        mode="contained"
        labelStyle={styles.label}
        compact={true}
        onPress={() => props.setT1(props.currentPosition)}
      >
        {formatTimeFromPosition(props.t1)}
      </Button>
      <Button
        icon="ray-end"
        mode="contained"
        labelStyle={styles.label}
        compact={true}
        onPress={() => props.setT2(props.currentPosition)}
      >
        {formatTimeFromPosition(props.t2)}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  label: {
    fontSize: 12,
  },
});
