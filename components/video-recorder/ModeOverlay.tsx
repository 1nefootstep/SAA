import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

import { Text as TextElements, Button, Overlay } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { Text, View } from "../Themed";
import { default as AKB } from "../../state_management/AnnotationKnowledgeBank";

export interface ModeOverlayProps {
  style: any,
}

enum OverlayScreenNumber {
  showPoolLength,
  show25m,
  show50m,
}

export default function ModeOverlay(props: ModeOverlayProps) {
  const poolDistanceToScreenNumber = new Map([
    [25, OverlayScreenNumber.show25m],
    [50, OverlayScreenNumber.show50m],
  ]);
  const [visible, setVisible] = useState<boolean>(false);

  const toggleOverlay = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const [screenNumber, setScreenNumber] = useState<OverlayScreenNumber>(
    OverlayScreenNumber.showPoolLength
  );

  const [options, _] = useState<AKB.Modes>(AKB.getModes());

  const setAnnotationMode = useCallback(
    (poolLengthIndex: number, modeIndex: number) => {
      AKB.setMode(poolLengthIndex, modeIndex);
      setVisible(false);
      setScreenNumber(OverlayScreenNumber.showPoolLength);
      console.log(visible);
    },
    []
  );

  return (
    <>
      <View
        style={props.style}
      >
        <TouchableOpacity onPress={toggleOverlay}>
          <Text>{AKB.getCurrentMode().name}</Text>
        </TouchableOpacity>
      </View>

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlayContainer}
      >
        <View>
          <ScrollView>
            <TextElements h2 style={{ alignSelf: "center", paddingBottom: 30 }}>
              {screenNumber === OverlayScreenNumber.showPoolLength &&
                "Pool Length"}
              {screenNumber !== OverlayScreenNumber.showPoolLength &&
                "Race distance"}
            </TextElements>
            {screenNumber === OverlayScreenNumber.showPoolLength &&
              options.map((e, i) => {
                return (
                  <Button
                    key={i}
                    containerStyle={styles.annotationOption}
                    title={`${e.poolLength}m`}
                    onPress={() =>
                      setScreenNumber(
                        poolDistanceToScreenNumber.get(e.poolLength) ??
                          OverlayScreenNumber.showPoolLength
                      )
                    }
                  />
                );
              })}
            {screenNumber === OverlayScreenNumber.show25m &&
              options[0].modes.map((e, i) => {
                return (
                  <Button
                    key={i}
                    containerStyle={styles.annotationOption}
                    title={e.name}
                    onPress={() => {
                      setTimeout(()=>setAnnotationMode(0, i), 100)
                    }}
                  />
                );
              })}
            {screenNumber === OverlayScreenNumber.show50m &&
              options[1].modes.map((e, i) => {
                return (
                  <Button
                    key={i}
                    containerStyle={styles.annotationOption}
                    title={e.name}
                    onPress={() => {
                      setTimeout(()=>setAnnotationMode(1, i), 100)
                    }}
                  />
                );
              })}
          </ScrollView>
        </View>
      </Overlay>
    </>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    height: "100%",
    width: "50%",
  },
  annotationOption: {
    margin: 15,
  },
});
