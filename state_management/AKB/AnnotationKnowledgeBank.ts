import { binarySearch, isNotNullNotUndefined } from "../../components/Util";
import { AnnotationMode, NameDistance } from "../AnnotationMode/AnnotationMode";
import * as Pool50m from "../AnnotationMode/Pool50m";
import * as Pool25m from "../AnnotationMode/Pool25m";
import { Annotations, Distance, Timestamp } from "./Annotations";
import { StrokeCountWithTimes, StrokeCounts, StrokeRange } from "./StrokeCounts";

module AnnotationKnowledgeBank {
  export interface AnnotationInformation {
    name: string;
    poolDistance: PoolDistance;
    modeIndex: number;
    annotations: Annotations;
    strokeCounts: StrokeCounts;
  }

  export type CheckpointResponse =
    | {
        found: false;
      }
    | {
        found: true;
        time: Timestamp;
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

  export function defaultAKB(): AnnotationInformation {
    return {
      name: "",
      poolDistance: PoolDistance.Unassigned,
      modeIndex: -1,
      annotations: new Annotations([]),
      strokeCounts: new StrokeCounts([]),
    };
  }

  let annotationInfo = defaultAKB();

  export function reset() {
    annotationInfo = defaultAKB();
  }

  export function deleteAnnotation(distance: Distance) {
    const map = annotationInfo.annotations.annotations;
    map.delete(distance);
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
    const isUnassigned =
      annotationInfo.poolDistance === PoolDistance.Unassigned;
    if (isUnassigned) {
      return defaultMode;
    }
    return (
      modes.get(annotationInfo.poolDistance)![annotationInfo.modeIndex] ??
      defaultMode
    );
  }

  export function addStrokeCount(sr: StrokeRange, sc: StrokeCountWithTimes) {
    annotationInfo.strokeCounts.set(sr, sc);
  }


  export function getStrokeCounts(): StrokeCounts {
    return annotationInfo.strokeCounts;
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

  export function getAnnotations(): Annotations {
    return annotationInfo.annotations;
  }

  function getAnnotationWithSearch(
    positionInMillis: number,
    fn: (sortedTimestamps: Array<Timestamp>, positionInMillis: number) => number
  ): CheckpointResponse {
    const timestamps = getAnnotationsTimestampArray();

    const index = fn(timestamps, positionInMillis);

    if (index < timestamps.length && index >= 0) {
      return {
        found: true,
        time: timestamps[index],
      };
    }
    return { found: false };
  }

  export function nextAnnotation(positionInMillis: number): CheckpointResponse {
    return getAnnotationWithSearch(
      positionInMillis,
      (timestamps, positionInMillis) =>
        binarySearch(timestamps, (t) => positionInMillis < t)
    );
  }

  export function prevAnnotation(positionInMillis: number): CheckpointResponse {
    return getAnnotationWithSearch(
      positionInMillis,
      (timestamps, positionInMillis) =>
        binarySearch(timestamps, (t) => positionInMillis < t) - 2
    );
  }

  export function getAnnotationsTimestampArray(): Array<number> {
    try {
      return Array.from(annotationInfo.annotations.annotations.values()).sort(
        (a, b) => a - b
      );
    } catch (err) {
      console.log(`AKB, getAnnotationsTimestampArray err: ${err}`);
      return [];
    }
  }

  export function addAnnotation(distTimeObject: {distance: Distance, timestamp: Timestamp}) {
    console.log(`Annotated ${distTimeObject.distance}m at ${(distTimeObject.timestamp / 1000).toFixed(2)}s`);
    annotationInfo.annotations.annotations.set(distTimeObject.distance, distTimeObject.timestamp);
  }

  export function deleteAnnotationByDistance(distance: number) {
    annotationInfo.annotations.annotations.delete(distance);
  }

  export function clearAnnotations() {
    annotationInfo.annotations.annotations.clear();
  }

  export function loadAnnotationInfo(a: any) {
    console.log(`AKB - loading...`);
    console.log(`AKB - ${JSON.stringify(a)}...`);
    annotationInfo.name = a.name;
    annotationInfo.poolDistance = a.poolDistance;
    annotationInfo.modeIndex = a.modeIndex;
    annotationInfo.annotations = new Annotations(a.annotations);
    annotationInfo.strokeCounts = new StrokeCounts(a.strokeCounts);
  }
}

export default AnnotationKnowledgeBank;
