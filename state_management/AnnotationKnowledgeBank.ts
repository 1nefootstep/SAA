import Util from "../components/Util";
import {
  AnnotationMode,
  Freestyle100mMode,
  Freestyle200mMode,
  Freestyle50mMode,
  NameDistance,
} from "./AnnotationMode/AnnotationMode";

module AnnotationKnowledgeBank {
  export interface AnnotationInformation {
    name: string;
    earlyCheckpoints: EarlyCheckpoint[];
    annotations: CheckpointAnnotation[];
    strokeCounts: StrokeCount[];
  }

  export type StrokeCount =
    | {
        hasEndTime: true;
        startTime: number;
        endTime: number;
        strokeCount: number;
      }
    | {
        hasEndTime: false;
        startTime: number;
        strokeCount: number;
      };

  export interface EarlyCheckpoint {
    description?: string;
    timestamp: number;
  }

  export interface CheckpointAnnotation {
    description?: string;
    timestamp: number;
    distance: number;
  }

  export type CheckpointResponse =
    | {
        found: false;
      }
    | {
        found: true;
        time: number;
      };

  const modes: AnnotationMode[] = [
    new Freestyle50mMode(),
    new Freestyle100mMode(),
    new Freestyle200mMode(),
  ];

  let currentMode = modes[0];

  let annotationInfo: AnnotationInformation = {
    name: "",
    earlyCheckpoints: [],
    annotations: [],
    strokeCounts: [],
  };

  let undoStack: Array<CheckpointAnnotation> = [];

  export function undoAddedAnnotation(): void {
    const ann: CheckpointAnnotation | undefined = undoStack.pop();
    if (ann !== undefined) {
      annotationInfo.annotations = annotationInfo.annotations.filter(
        (e) => e != ann
      );
    }
  }

  export function getModes(): string[] {
    return modes.map((mode) => mode.name);
  }

  export function setMode(mode: string): boolean {
    for (let i = 0; i < modes.length; i++) {
      if (modes[i].name === mode) {
        currentMode = modes[i];
        return true;
      }
    }
    return false;
  }

  export function getCurrentMode(): string {
    return currentMode.name;
  }

  export function getCurrentAnnotation(currentPosition: number): NameDistance {
    let foundIndex = -1;
    for (let i = 0; i < annotationInfo.annotations.length; i++) {
      const currAnnotation = annotationInfo.annotations[i];
      const isCurrPosAfterAndDescriptionNotNull =
        currentPosition >= currAnnotation.timestamp &&
        currAnnotation.description !== null &&
        currAnnotation.description !== undefined;
      if (isCurrPosAfterAndDescriptionNotNull) {
        for (let j = 0; j < currentMode.checkpointNames.length; j++) {
          if (
            currAnnotation.description === currentMode.checkpointNames[j].name
          ) {
            foundIndex = j;
            break;
          }
        }
      }
    }
    if (foundIndex === -1) {
      return currentMode.checkpointNames[0];
    }
    if (foundIndex + 1 < currentMode.checkpointNames.length) {
      return currentMode.checkpointNames[foundIndex + 1];
    }
    return { name: "Checkpoint", distanceMeter: 0 };
  }

  export function addStrokeCount(startTime: number): number {
    annotationInfo.strokeCounts.push({
      hasEndTime: false,
      startTime: startTime,
      strokeCount: 0,
    });
    return annotationInfo.strokeCounts.length - 1;
  }

  export function updateStrokeCountByIndex(index: number, strokeCount: number) {
    annotationInfo.strokeCounts[index].strokeCount = strokeCount;
  }

  export function addEndTimeByIndex(index: number, endTime: number) {
    annotationInfo.strokeCounts[index] = {
      ...annotationInfo.strokeCounts[index],
      hasEndTime: true,
      endTime: endTime,
    };
  }

  export function deleteStrokeCountByIndex(index: number) {
    annotationInfo.strokeCounts.splice(index, 1);
  }

  export type SearchStrokeResult =
    | {
        found: false;
      }
    | {
        found: true;
        index: number;
        stroke: StrokeCount;
      };

  export function getStrokeInTime(currentPosition: number): SearchStrokeResult {
    for (let i = 0; i < annotationInfo.strokeCounts.length; i++) {
      const curr = annotationInfo.strokeCounts[i];
      const isWithinRange = curr.hasEndTime
        ? currentPosition >= curr.startTime && currentPosition <= curr.endTime
        : currentPosition >= curr.startTime;

      if (isWithinRange) {
        return { found: true, index: i, stroke: curr };
      }
    }
    return { found: false };
  }

  export function getAllStrokes(): StrokeCount[] {
    return annotationInfo.strokeCounts;
  }

  export function addEarlyCheckpoint(checkpoint: CheckpointAnnotation): void {
    annotationInfo.earlyCheckpoints.push(checkpoint);
  }

  export function clearEarlyCheckpoints(): void {
    annotationInfo.earlyCheckpoints.splice(
      0,
      annotationInfo.earlyCheckpoints.length
    );
  }

  export function getEarlyCheckpoints(): EarlyCheckpoint[] {
    return annotationInfo.earlyCheckpoints;
  }

  export function getEarlyCheckpointsTimestampArray(): Array<number> {
    // console.log(annotationInfo.earlyCheckpoints.map((cp) => cp.timestamp));
    console.log(annotationInfo.earlyCheckpoints);
    return annotationInfo.earlyCheckpoints.map((cp) => cp.timestamp);
  }

  export function nextEarlyCheckpoint(
    positionInMillis: number
  ): CheckpointResponse {
    const nextPosition = Util.binarySearch(
      annotationInfo.earlyCheckpoints,
      (cp: EarlyCheckpoint) => positionInMillis < cp.timestamp
    );
    // console.log(nextPosition);
    if (nextPosition != annotationInfo.earlyCheckpoints.length) {
      return {
        found: true,
        time: annotationInfo.earlyCheckpoints[nextPosition].timestamp,
      };
    }
    return { found: false };
  }

  export function prevEarlyCheckpoint(
    positionInMillis: number
  ): CheckpointResponse {
    const prevPosition =
      Util.binarySearch(
        annotationInfo.earlyCheckpoints,
        (cp: EarlyCheckpoint) => positionInMillis < cp.timestamp
      ) - 2;
    // console.log(prevPosition);
    if (prevPosition >= 0) {
      return {
        found: true,
        time: annotationInfo.earlyCheckpoints[prevPosition].timestamp,
      };
    }
    return { found: false };
  }

  export function annotationInfoToJson(
    callbackIfFailToJson: (e: any) => void = (e) => console.log(e)
  ): string {
    try {
      const toJson = JSON.stringify(annotationInfo);
      return toJson;
    } catch (e) {
      callbackIfFailToJson(e);
      return "{}";
    }
  }

  export function getAnnotationInfo(): AnnotationInformation {
    return annotationInfo;
  }

  export function getAnnotations(): CheckpointAnnotation[] {
    return annotationInfo.annotations;
  }

  export function nextAnnotation(positionInMillis: number): CheckpointResponse {
    const nextPosition = Util.binarySearch(
      annotationInfo.annotations,
      (cp: CheckpointAnnotation) => positionInMillis < cp.timestamp
    );
    // console.log(nextPosition);
    if (nextPosition != annotationInfo.annotations.length) {
      return {
        found: true,
        time: annotationInfo.annotations[nextPosition].timestamp,
      };
    }
    return { found: false };
  }

  export function prevAnnotation(positionInMillis: number): CheckpointResponse {
    const prevPosition =
      Util.binarySearch(
        annotationInfo.annotations,
        (cp: CheckpointAnnotation) => positionInMillis < cp.timestamp
      ) - 2;
    // console.log(prevPosition);
    if (prevPosition >= 0) {
      return {
        found: true,
        time: annotationInfo.annotations[prevPosition].timestamp,
      };
    }
    return { found: false };
  }

  export function getAnnotationsTimestampArray(): Array<number> {
    return annotationInfo.annotations.map((ann) => ann.timestamp);
  }

  export function addAnnotation(annotation: CheckpointAnnotation) {
    console.log(`Checkpointing with: ${JSON.stringify(annotation)}`);
    annotationInfo.annotations.push(annotation);
    undoStack.push(annotation);
  }

  export function deleteAnnotationByDescription(description: string) {
    // -1 indicates couldn't find
    const indexToDelete = annotationInfo["annotations"].findIndex(
      (element) => element["description"] == description
    );
    if (indexToDelete !== -1) {
      annotationInfo.annotations.splice(indexToDelete, 1);
    }
  }

  export function deleteAnnotationByIndex(index: number) {
    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < annotationInfo.annotations.length
    ) {
      annotationInfo.annotations.splice(index, 1);
    }
  }

  export function clearAnnotations() {
    annotationInfo.annotations.splice(0, annotationInfo.annotations.length);
  }

  // export async function saveAnnotationInfo(filename: string) {
  //   return FileHandler.saveTextToAppFolder(filename, annotationInfoToJson());
  // }

  // export async function saveAnnotationInfoWithVideoFilePath(
  //   videoFilePath: string
  // ) {
  //   return FileHandler.saveTextToAppFolder(
  //     `${FileHandler.getBaseName(videoFilePath)}.txt`,
  //     annotationInfoToJson()
  //   );
  // }

  // export async function loadAnnotationInfoWithVideoFilePath(
  //   videoFilePath: string
  // ) {
  //   const response = await FileHandler.readTextWithVideoFile(videoFilePath);
  //   if (response.isAvailable) {
  //     loadAnnotationInfo(response.response, (e) =>
  //       console.log(`load annotation info failed: ${e}`)
  //     );
  //   } else {
  //     console.log("response is not available.");
  //   }
  // }

  // export function loadAnnotationInfo(
  //   infoInJson: string,
  //   callbackIfFailParse: (e: any) => void
  // ) {
  //   try {
  //     annotationInfo = JSON.parse(infoInJson);
  //     console.log(annotationInfo);
  //   } catch (e: any) {
  //     callbackIfFailParse(e);
  //   }
  // }

    export function loadAnnotationInfo(a: AnnotationInformation) {
      console.log(`loading...`);
      console.log(a);
      annotationInfo = a;
      
    }

  export type DataAndTimeRange =
    | {
        hasData: true;
        data: number;
        startTime: number;
        endTime: number;
      }
    | {
        hasData: false;
        startTime: number;
        endTime: number;
      };

  function computeStrokeFrequencies(): Array<DataAndTimeRange> {
    const sc = annotationInfo.strokeCounts;
    return sc
      .filter((s) => s.hasEndTime)
      .map((s) => {
        if (s.hasEndTime) {
          const time = (s.endTime - s.startTime) / 1000; //convert to seconds
          return {
            hasData: true,
            data: s.strokeCount / time,
            startTime: s.startTime,
            endTime: s.endTime,
          };
        }
        // should never reach this line
        throw "Should have already filtered non end-time strokes";
      });
  }

  function getDistanceTimeMap(): Array<{ distance: number; time: number }> {
    const anns = annotationInfo.annotations;
    return anns.map((e) => {
      return { distance: e.distance, time: e.timestamp };
    });
  }

  function computeAverageVelocities(): Array<DataAndTimeRange> {
    const anns = annotationInfo.annotations;
    let prevTimestamp = -1;
    let prevDistance = -1;
    let isFirst = true;
    const result: Array<DataAndTimeRange> = [];
    for (let i = 0; i < anns.length; i++) {
      if (isFirst) {
        isFirst = false;
        prevTimestamp = anns[i].timestamp;
        prevDistance = anns[i].distance;
      } else {
        const currTimestamp = anns[i].timestamp;
        const currDistance = anns[i].distance;
        const timeTaken = (currTimestamp - prevTimestamp) / 1000; // convert to seconds
        const distance = currDistance - prevDistance;
        result.push({
          hasData: true,
          data: distance / timeTaken,
          startTime: prevTimestamp,
          endTime: currTimestamp,
        });
        prevTimestamp = currTimestamp;
        prevDistance = currDistance;
      }
    }
    return result;
  }

  function computeEfficiency(strokeLength: number, strokeFrequency: number) {
    return strokeLength / strokeFrequency;
  }

  export interface ComputedResult {
    distanceToTimeMap: { distance: number; time: number }[];
    strokeLengths: DataAndTimeRange[];
    strokeFrequencies: DataAndTimeRange[];
    averageVelocities: DataAndTimeRange[];
  }

  export function computeResult(): ComputedResult {
    const averageVelocitiesWithTimestamp = computeAverageVelocities();
    const strokeFrequenciesWithTimestamp = computeStrokeFrequencies();
    const findStrokeFreqForCheckpoint = (startTime: number, endTime: number) =>
      strokeFrequenciesWithTimestamp.find(
        (e) => e.startTime >= startTime && e.endTime <= endTime
      );

    const strokeLengthsWithTimestamp: Array<DataAndTimeRange> =
      averageVelocitiesWithTimestamp.map((e) => {
        const found = findStrokeFreqForCheckpoint(e.startTime, e.endTime);
        if (e.hasData && found !== undefined && found.hasData) {
          return {
            hasData: true,
            data: e.data / found.data,
            startTime: e.startTime,
            endTime: e.endTime,
          };
        }
        return { hasData: false, startTime: e.startTime, endTime: e.endTime };
      });
    
    const distanceTimeMap = getDistanceTimeMap();
    return {
      averageVelocities: averageVelocitiesWithTimestamp,
      strokeFrequencies: strokeFrequenciesWithTimestamp,
      strokeLengths: strokeLengthsWithTimestamp,
      distanceToTimeMap: distanceTimeMap,
    };
  }
}

export default AnnotationKnowledgeBank;
