import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { StyleSheet, PanResponder } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { AntDesign } from "@expo/vector-icons";

import { Text, View } from "../../../Themed";
import { default as AKB } from "../../../../state_management/AKB/AnnotationKnowledgeBank";
import { IconButton, Colors } from "react-native-paper";
import {
  StrokeCountWithTimes,
  StrokeRange,
} from "../../../../state_management/AKB/StrokeCounts";
import DropDownPicker from "react-native-dropdown-picker";
import SetTimeButtons from "./SetTimeButton";
import { isNotNullNotUndefined } from "../../../Util";

export interface StrokeCounterProps {
  currentPositionMillis: number;
  isLoaded: boolean;
}

export default function StrokeCounter(props: StrokeCounterProps) {
  const PLUS_COLOR = Colors.green300;
  const MINUS_COLOR = Colors.red300;
  const BUTTON_SIZE = 24;
  const strokeRanges = AKB.getCurrentMode().strokeRanges;

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number>(0);
  const [strokeCount, setStrokeCount] = useState<number>(
    AKB.getStrokeCounts().get(strokeRanges[index])?.strokeCount ?? 0
  );

  const [t1, setT1] = useState<number>(
    AKB.getStrokeCounts().get(strokeRanges[index])?.startTime ?? 0
  );

  const [t2, setT2] = useState<number>(
    AKB.getStrokeCounts().get(strokeRanges[index])?.endTime ?? 0
  );

  const mapToSelectItems = (srArray: Array<StrokeRange>) => {
    return srArray.map((e, i) => {
      console.log(e.toString());
      return { label: e.toString(), value: i };
    });
  };
  const items = mapToSelectItems(strokeRanges);

  const setIndexAndUpdateStrokeCount = (valOrAct: SetStateAction<number>) => {
    let scWithTimes: StrokeCountWithTimes | undefined;
    if (typeof valOrAct === "number") {
      scWithTimes = AKB.getStrokeCounts().get(strokeRanges[valOrAct]);
      setStrokeCount(scWithTimes?.strokeCount ?? 0);
    } else {
      const value = valOrAct(index);
      scWithTimes = AKB.getStrokeCounts().get(strokeRanges[value]);
      setStrokeCount(scWithTimes?.strokeCount ?? 0);
    }
    setIndex(valOrAct);
    setT1(scWithTimes?.startTime ?? 0);
    setT2(scWithTimes?.endTime ?? 0);
  };

  const updateToAKB = (arg: { sc: number; t1: number; t2: number }) => {
    const scWithTimes: StrokeCountWithTimes = {
      strokeCount: arg.sc,
      startTime: arg.t1,
      endTime: arg.t2,
    };
    AKB.getStrokeCounts().set(strokeRanges[index], scWithTimes);
    setStrokeCount(arg.sc);
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        style={styles.picker}
        open={open}
        min={3}
        max={5}
        value={index}
        items={items}
        setOpen={setOpen}
        setValue={setIndexAndUpdateStrokeCount}
        autoScroll={true}
      />
      <View style={styles.counterContainer}>
        <IconButton
          icon="minus"
          color={MINUS_COLOR}
          size={BUTTON_SIZE}
          style={{ borderColor: MINUS_COLOR, borderWidth: 1 }}
          onPress={() => updateToAKB({ sc: strokeCount - 1, t1: t1, t2: t2 })}
        />
        <Text> {strokeCount} </Text>
        <IconButton
          icon="plus"
          color={PLUS_COLOR}
          size={BUTTON_SIZE}
          style={{ borderColor: PLUS_COLOR, borderWidth: 1 }}
          onPress={() => updateToAKB({ sc: strokeCount + 1, t1: t1, t2: t2 })}
        />
      </View>
      <SetTimeButtons
        currentPosition={props.currentPositionMillis}
        t1={t1}
        setT1={(num: number) => {
          if (t2 !== 0 && t2 < num) {
            return;
          }
          setT1(num);
          updateToAKB({ sc: strokeCount, t1: num, t2: t2 });
        }}
        t2={t2}
        setT2={(num: number) => {
          if (t1 > num) {
            return;
          }
          setT2(num);
          updateToAKB({ sc: strokeCount, t1: t1, t2: num });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    minHeight: 200,
    maxHeight: 400,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    width: 100,
    backgroundColor: "gainsboro",
  },
});
