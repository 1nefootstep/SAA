import React, { useState } from "react";
import { StyleSheet } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

import { default as AKB } from "../../../state_management/AnnotationKnowledgeBank";
import { NameDistance } from "../../../state_management/AnnotationMode/AnnotationMode";

export interface SelectAnnotationProps {
  isLoaded: boolean;
  currentDistance: number;
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

  const reorderCheckpoints = (nd: Array<NameDistance>, d?: number) => {
    const before: Array<NameDistance> = [];
    const after: Array<NameDistance> = [];
    const dist = d ?? props.currentDistance;
    for (let i = 0; i < nd.length; i++) {
      if (nd[i].distanceMeter >= dist) {
        after.push(nd[i]);
      } else {
        before.push(nd[i]);
      }
    }
    const result = after.concat(before);
    console.log(`result: ${result.map((e, i) => e.name)}`);
    // return after.concat(before);
    return result;
  };
  const [items, setItems] = useState(
    mapToSelectItems(reorderCheckpoints(checkpoints))
  );

  const updateItems = () => {
    setItems(mapToSelectItems(reorderCheckpoints(checkpoints)));
  };

  return (
    <DropDownPicker
      style={styles.picker}
      open={open}
      value={props.currentDistance}
      items={items}
      setOpen={setOpen}
      setValue={props.setCurrentDistance}
      setItems={setItems}
      onOpen={updateItems}
    />
  );
}

const styles = StyleSheet.create({
  picker: {
    width: 100,
    backgroundColor: "gainsboro",
  },
});
