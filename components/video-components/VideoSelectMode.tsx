import React, { useState } from "react";

import { Video } from "expo-av";

import ModeOverlay from "../ModeOverlay";
import { default as AKB } from "../../state_management/AKB/AnnotationKnowledgeBank";

export interface VideoSelectModeProps {
  isLoaded: boolean;
}

export const MemoVideoSelectMode = React.memo(VideoSelectMode);

export function VideoSelectMode(props: VideoSelectModeProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const isUnassigned = () =>
    AKB.getAnnotationInfo().poolDistance === AKB.PoolDistance.Unassigned;

  const setVisibleToTrue = () => {
    if (!visible) {
      setVisible(true);
    }
  };
  if (props.isLoaded && isUnassigned()) {
    console.log("VideoSelectMode - should display mode overlay");
    console.log(`${AKB.getAnnotationInfo().poolDistance}`);
    setVisibleToTrue();
    return <ModeOverlay visible={visible} setVisible={setVisible} />;
  }
  console.log(JSON.stringify(AKB.getAnnotationInfo()));
  console.log(`VideoSelectMode - should not display mode overlay`);
  return <></>;
}

// import React, { useState, useCallback, useMemo } from "react";
// import { SafeAreaView, StyleSheet } from "react-native";

// import { Text as TextElements, Button, Overlay } from "react-native-elements";
// import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

// import { Text, View } from "../Themed";
// import { default as AKB } from "../../state_management/AnnotationKnowledgeBank";

// export interface ModeOverlayProps {}

// export default function ModeOverlay(props: ModeOverlayProps) {
//   const [visible, setVisible] = useState<boolean>(false);
//   const toggleOverlay = useCallback(() => {
//     setVisible(!visible);
//   }, [visible]);

//   const [options, _] = useState<string[]>(AKB.getModes());
//   const setAnnotationMode = useCallback((option: string) => {
//     AKB.setMode(option);
//     console.log(AKB.getCurrentMode());
//     setVisible(false);
//     console.log(visible);
//   }, []);

//   return (
//     <View>
//       <View style={{ marginHorizontal: 10 }}>
//         <TouchableOpacity onPress={toggleOverlay}>
//           <Text>Mode</Text>
//         </TouchableOpacity>
//       </View>

//       <Overlay
//         isVisible={visible}
//         onBackdropPress={toggleOverlay}
//         overlayStyle={styles.overlayContainer}
//       >
//         <View>
//           <ScrollView>
//             <TextElements h2 style={{ alignSelf: "center", paddingBottom: 30 }}>
//               Annotation Modes
//             </TextElements>
//             {options.map((e, i) => {
//               return (
//                 <Button
//                   key={i}
//                   containerStyle={styles.annotationOption}
//                   title={e}
//                   onPress={() => setTimeout(()=>setAnnotationMode(e), 100)}
//                 />
//               );
//             })}
//           </ScrollView>
//         </View>
//       </Overlay>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlayContainer: {
//     height: "100%",
//     width: "50%",
//   },
//   annotationOption: {
//     margin: 15,
//   },
// });
