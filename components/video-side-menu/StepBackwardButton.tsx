// import * as React from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// import StepButtonProps from "./StepButtonProps";
// import { default as AKB } from "../../state_management/AnnotationKnowledgeBank";

// export default function StepBackwardButton(props: StepButtonProps) {
//   const goToPrevEarlyCheckpoint = () => {
//     if (props.isLoaded) {
//       const response = AKB.prevEarlyCheckpoint(props.currentPositionMillis);
//       if (response.found) {
//         props.videoRef.current!.setPositionAsync(response.time, {
//           toleranceMillisBefore: 0,
//           toleranceMillisAfter: 0,
//         });
//       }
//     }
//   };
//   return <MaterialCommunityIcons onPress={goToPrevEarlyCheckpoint} name="step-backward" size={24} color="blue" />;
// }