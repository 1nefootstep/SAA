import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

import { Text as TextElements, Button, Overlay } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { Text, View } from "./Themed";
import { default as AKB } from "../state_management/AnnotationKnowledgeBank";

export interface ModeOverlayProps {
  children?: JSX.Element;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [visible, setVisible] = [props.visible, props.setVisible];

  const toggleOverlay = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const [screenNumber, setScreenNumber] = useState<OverlayScreenNumber>(
    OverlayScreenNumber.showPoolLength
  );

  const [options, _] = useState<AKB.Modes>(AKB.getModes());

  const setAnnotationMode = (pd: AKB.PoolDistance, modeIndex: number) => {
    AKB.setMode(pd, modeIndex);
    setVisible(false);
    setScreenNumber(OverlayScreenNumber.showPoolLength);
  };
  return (
    <>
      {props.children}
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
              Array.from(options.keys()).map((e, i) => {
                const poolLength = AKB.poolDistanceToNumber(e);
                return (
                  <Button
                    key={i}
                    containerStyle={styles.annotationOption}
                    title={`${poolLength}m`}
                    onPress={() =>
                      setScreenNumber(
                        poolDistanceToScreenNumber.get(poolLength) ??
                          OverlayScreenNumber.showPoolLength
                      )
                    }
                  />
                );
              })}
            {screenNumber === OverlayScreenNumber.show25m &&
              options.get(AKB.PoolDistance.D25m)!.map((e, i) => {
                return (
                  <Button
                    key={i}
                    containerStyle={styles.annotationOption}
                    title={e.name}
                    onPress={() => setAnnotationMode(AKB.PoolDistance.D25m, i)}
                  />
                );
              })}
            {screenNumber === OverlayScreenNumber.show50m &&
              options.get(AKB.PoolDistance.D50m)!.map((e, i) => {
                return (
                  <Button
                    key={i}
                    containerStyle={styles.annotationOption}
                    title={e.name}
                    onPress={() => setAnnotationMode(AKB.PoolDistance.D50m, i)}
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
