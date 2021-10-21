import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { Picker } from "@react-native-picker/picker";

import { default as AKB } from "../../state_management/AnnotationKnowledgeBank";

export interface ModePickerProps {
  isLoaded: boolean;
  setTrackTimestamp: (a:Array<number>) => void;
}

export default function ModePicker(props: ModePickerProps) {
  const options = AKB.getModes();
  const [selectedValue, setSelectedValue] = useState<string>(options[0]);
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        style={{ flex: 1 }}
        onValueChange={(itemValue, itemIndex) => {
          if (props.isLoaded) {
            setSelectedValue(itemValue);
            AKB.setMode(itemValue);
            AKB.clearAnnotations();
            props.setTrackTimestamp([-1]);
          }
        }}
      >
        {options.map((e, i) => {
          <Picker.Item key={i} label={e} value={e} />;
        })}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
  },
});
