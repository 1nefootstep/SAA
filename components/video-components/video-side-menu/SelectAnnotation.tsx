import React, { RefObject, useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";
import { Video } from "expo-av";

import { default as AKB } from "../../../state_management/AKB/AnnotationKnowledgeBank";
import { NameDistance } from "../../../state_management/AnnotationMode/AnnotationMode";
import { isNotNullNotUndefined } from "../../Util";
import { View } from "../../Themed";

export interface SelectAnnotationProps {
  isLoaded: boolean;
  currentDistance: number;
  videoRef: RefObject<Video>;
  setCurrentDistance: React.Dispatch<React.SetStateAction<number>>;
  setTrackTimestamp: (a: Array<number>) => void;
}

export default function SelectAnnotation(props: SelectAnnotationProps) {
  const [open, setOpen] = useState(false);
  const checkpoints = AKB.getCurrentMode().checkpointNames;
  const mapToSelectItems = (nd: Array<NameDistance>) =>
    nd.map((e, i) => {
      return { label: e.name, value: e.distanceMeter };
    });

  // const reorderCheckpoints = (nd: Array<NameDistance>, d?: number) => {
  //   const before: Array<NameDistance> = [];
  //   const after: Array<NameDistance> = [];
  //   const dist = d ?? props.currentDistance;
  //   for (let i = 0; i < nd.length; i++) {
  //     if (nd[i].distanceMeter >= dist) {
  //       after.push(nd[i]);
  //     } else {
  //       before.push(nd[i]);
  //     }
  //   }
  //   return after.concat(before);
  // };
  const items = useMemo(() => mapToSelectItems(checkpoints), [checkpoints]);
  // const [items, setItems] = useState(
  //   mapToSelectItems(reorderCheckpoints(checkpoints))
  // );

  // const updateItems = useCallback(() => {
  //   setItems(mapToSelectItems(reorderCheckpoints(checkpoints)));
  // }, [props.currentDistance]);

  const updateCurrentDistance = (d: number) => {
    goToPosition(d)
      .then((bool) =>
        bool
          ? console.log(`SelectAnnotation - successfully jump to position`)
          : console.log(`SelectAnnotation - failed to jump to position`)
      )
      .catch((err) =>
        console.log(
          `SelectAnnotation, jumpToPosition: unexpected error: ${err}`
        )
      );
  };

  /**
   * Sets the video to the timestamp as per the distance.
   * This only works if there is an annotation at that distance.
   * @param distance
   * @returns true if successful, else returns false
   */
  const goToPosition = async (distance: number): Promise<boolean> => {
    if (props.isLoaded) {
      const index = AKB.getCurrentMode().indexFromDistance(distance);
      if (index === -1) {
        return false;
      }
      const timestamp = AKB.getAnnotations().annotations.get(distance);
      const video = props.videoRef?.current;
      if (isNotNullNotUndefined(timestamp) && isNotNullNotUndefined(video)) {
        await video!.setPositionAsync(timestamp!, {
          toleranceMillisAfter: 0,
          toleranceMillisBefore: 0,
        });
        return true;
      }
    }
    return false;
  };

  return (
    <DropDownPicker
      style={styles.picker}
      open={open}
      min={3}
      max={5}
      value={props.currentDistance}
      items={items}
      setOpen={setOpen}
      setValue={props.setCurrentDistance}
      autoScroll={true}
      onChangeValue={(value) =>
        typeof value === "number"
          ? updateCurrentDistance(value)
          : console.log(
              `SelectAnnotation - value was of wrong type: ${typeof value}`
            )
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {},
  picker: {
    width: 100,
    backgroundColor: "gainsboro",
  },
});
