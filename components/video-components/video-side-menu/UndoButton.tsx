import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { Text } from "../../Themed";

import { default as AKB } from "../../../state_management/AnnotationKnowledgeBank";

export interface UndoButtonProps {
  isLoaded: boolean;
  setTrackTimestamp: (a: Array<number>) => void;
}

export default function UndoButton(props: UndoButtonProps) {
  
  const undo = () => {
    if (props.isLoaded) {
      // toggle to early checkpoints if is real checkpoint now
      AKB.undoAddedAnnotation();
      props.setTrackTimestamp(AKB.getAnnotationsTimestampArray());
    }
  };
  return (
    <TouchableOpacity style={{ flex: 1, margin: 3 }} onPress={undo}>
      <Text>Undo</Text>
    </TouchableOpacity>
  );
}
