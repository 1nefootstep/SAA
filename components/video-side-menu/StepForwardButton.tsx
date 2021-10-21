// import * as React from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// import StepButtonProps from "./StepButtonProps";
// import { default as AKB } from "../../state_management/AnnotationKnowledgeBank";

// export default function StepForwardButton(props: StepButtonProps) {
//   const goToNextEarlyCheckpoint = () => {
//     if (props.isLoaded) {
//       const response = AKB.nextEarlyCheckpoint(props.currentPositionMillis);
//       if (response.found) {
//         props.videoRef.current!.setPositionAsync(response.time, {
//           toleranceMillisBefore: 0,
//           toleranceMillisAfter: 0,
//         });
//       }
//     }
//   };
//   return (
//     <MaterialCommunityIcons
//       onPress={goToNextEarlyCheckpoint}
//       name="step-forward"
//       size={24}
//       color="blue"
//     />
//   );
// }
