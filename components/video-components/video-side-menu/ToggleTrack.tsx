// import React, { useState } from "react";
// import { TouchableOpacity } from "react-native";

// import { Text } from "../../Themed";

// import { default as AKB } from "../../../state_management/AnnotationKnowledgeBank";

// export interface ToggleTrackProps {
//   isLoaded: boolean;
//   isRealCheckpoint: boolean;
//   setIsRealCheckpoint: (b: boolean)=>void;
//   setTrackTimestamp: (a: Array<number>) => void;
// }

// export default function ToggleTrack(props: ToggleTrackProps) {
  
//   const toggle = () => {
//     if (props.isLoaded) {
//       // toggle to early checkpoints if is real checkpoint now
//       if (props.isRealCheckpoint) {
//         props.setIsRealCheckpoint(false);
//         props.setTrackTimestamp(AKB.getEarlyCheckpointsTimestampArray());
//         console.log(AKB.getEarlyCheckpointsTimestampArray());
//         console.log('is real checkpoint');
//       } else {
//         props.setIsRealCheckpoint(true);
//         props.setTrackTimestamp(AKB.getAnnotationsTimestampArray());
//         console.log('is not real checkpoint');
//       }
//     }
//   };
//   return (
//     <TouchableOpacity style={{ flex: 1, margin: 3 }} onPress={toggle}>
//       <Text>Tracks</Text>
//     </TouchableOpacity>
//   );
// }
