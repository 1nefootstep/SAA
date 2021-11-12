import { binarySearch, isNotNullNotUndefined } from "../components/Util";
import { AnnotationMode, NameDistance } from "./AnnotationMode/AnnotationMode";
import * as Pool50m from "./AnnotationMode/Pool50m";
import * as Pool25m from "./AnnotationMode/Pool25m";

module AnnotationKnowledgeBank {
  export interface AnnotationInformation {
    name: string;
    poolDistance: PoolDistance;
    modeIndex: number;
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

  export enum PoolDistance {
    Unassigned,
    D25m,
    D50m,
  }

  /**
   * Returns pool distance based on the number. Defaults to Unassigned if
   * no matching pool distance found.
   * @param num distance of pool in metres
   * @returns PoolDistance enum
   */
  export function numberToPoolDistance(num: number): PoolDistance {
    switch (num) {
      case 25:
        return PoolDistance.D25m;
      case 50:
        return PoolDistance.D50m;
      default:
        return PoolDistance.Unassigned;
    }
  }

  /**
   * Returns pool distance in metres based on the enum PoolDistance. 
   * Defaults to 50m pool if no matching pool distance found.
   * @param pd PoolDistance enum
   * @returns pool distance in metres
   */
  export function poolDistanceToNumber(pd: PoolDistance): number {
    switch (pd) {
      case PoolDistance.D25m:
        return 25;
      case PoolDistance.D50m:
        return 50;
      default:
        return 50;
    }
  }

  export type Modes = Map<PoolDistance, Array<AnnotationMode>>;

  const modes = new Map([
    [
      PoolDistance.D25m,
      [
        new Pool25m.Freestyle25mMode(),
        new Pool25m.Freestyle50mMode(),
        new Pool25m.Freestyle100mMode(),
        new Pool25m.Freestyle200mMode(),
        new Pool25m.Freestyle400mMode(),
      ],
    ],
    [
      PoolDistance.D50m,
      [
        new Pool50m.Freestyle50mMode(),
        new Pool50m.Freestyle100mMode(),
        new Pool50m.Freestyle200mMode(),
        new Pool50m.Freestyle400mMode(),
      ],
    ],
  ]);

  export function getModes(): Modes {
    return modes;
  }

  const modePool25m: AnnotationMode[] = [];

  // let currentMode = modes.get(PoolDistance.D50m)![0];
  
  export function defaultAKB():AnnotationInformation {
    return {
      name: "",
      poolDistance: PoolDistance.Unassigned,
      modeIndex: -1,
      earlyCheckpoints: [],
      annotations: [],
      strokeCounts: [],
    };
  }

  let annotationInfo = defaultAKB();

  let undoStack: Array<CheckpointAnnotation> = [];

  export function reset() {
    annotationInfo = defaultAKB();
  }

  export function undoAddedAnnotation(): void {
    const ann: CheckpointAnnotation | undefined = undoStack.pop();
    if (isNotNullNotUndefined(ann)) {
      annotationInfo.annotations = annotationInfo.annotations.filter(
        (e) => e != ann
      );
    }
  }

  /**
   * Set annotation mode.
   * @param poolDistance PoolDistance enum
   * @param modeIndex index of the race distance
   * @returns true if succeeded, else false.
   */
  export function setMode(pd: PoolDistance, modeIndex: number): boolean {
    if (pd === PoolDistance.Unassigned) {
      pd = PoolDistance.D50m;
    }
    const modeToSelect = modes.get(pd)![modeIndex];
    if (isNotNullNotUndefined(modeToSelect)) {
      annotationInfo.poolDistance = pd;
      annotationInfo.modeIndex = modeIndex;
      return true;
    }
    return false;
  }

  export function getCurrentMode(): AnnotationMode {
    const defaultMode = modes.get(PoolDistance.D50m)![0];
    const isUnassigned = annotationInfo.poolDistance === PoolDistance.Unassigned;
    if (isUnassigned) {
      return defaultMode;
    }
    return modes.get(annotationInfo.poolDistance)![annotationInfo.modeIndex] ?? defaultMode;
  }

  export function getCurrentAnnotation(currentPosition: number): NameDistance {
    let foundIndex = -1;
    const currentMode = getCurrentMode();
    for (let i = 0; i < annotationInfo.annotations.length; i++) {
      const currAnnotation = annotationInfo.annotations[i];
      const isCurrPosAfterAndDescriptionNotNull =
        currentPosition >= currAnnotation.timestamp &&
        isNotNullNotUndefined(currAnnotation.description);

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
    const nextPosition = binarySearch(
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
      binarySearch(
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
    const nextPosition = binarySearch(
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
      binarySearch(
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
