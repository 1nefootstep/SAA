import React, { useState, useCallback, useMemo } from "react";

import {  TouchableOpacity } from "react-native-gesture-handler";

import { Text, View } from "../Themed";
import { default as AKB } from "../../state_management/AKB/AnnotationKnowledgeBank";
import ModeOverlay from "../ModeOverlay";

export interface SelectModeProps {
  style: any;
}

export default function SelectMode(props: SelectModeProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleOverlay = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const children = (
    <View style={props.style}>
      <TouchableOpacity onPress={toggleOverlay}>
        <Text>{AKB.getCurrentMode().name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ModeOverlay
      children={children}
      visible={visible}
      setVisible={setVisible}
    />
  );
}
