import {
  isNotNullNotUndefined,
  isNullOrUndefined,
  numbersToStringRange,
} from "../components/Util";
import { default as AKB } from "./AKB/AnnotationKnowledgeBank";
import { StrokeRange } from "./AKB/StrokeCounts";

// Metres per second
export interface VelocityStatistic {
  velocity: number;
  startDist: number;
  endDist: number;
}

// Strokes
export interface SCStatistic {
  strokeCount: number;
  startDist: number;
  endDist: number;
}

// Strokes per minute
export interface SRStatistic {
  strokeRate: number;
  startDist: number;
  endDist: number;
}

// Distance(m) per stroke
export interface DPSStatistic {
  strokeRate: number;
  startDist: number;
  endDist: number;
}

type DistanceToTime = Map<number, number>;

function getDistanceTimeMap(): DistanceToTime {
  const annotationInfo = AKB.getAnnotationInfo();
  const annMap = annotationInfo.annotations.annotations;
  const dttMap = new Map();
  Array.from(annMap.entries()).forEach((e) => {
    dttMap.set(e[0], e[1]);
  });
  return dttMap;
}

type VelocityMap = Map<string, number>;

function computeAverageVelocities(
  distanceToTime?: DistanceToTime
): VelocityMap {
  let dttMap: DistanceToTime;
  if (isNotNullNotUndefined(distanceToTime)) {
    dttMap = distanceToTime!;
  } else {
    dttMap = getDistanceTimeMap();
  }
  const ranges = AKB.getCurrentMode().strokeRanges;
  const vMap: VelocityMap = new Map();

  ranges.forEach((e) => {
    const start = e.startRange;
    const end = e.endRange;
    console.log(`velocity compute: start: ${start}, end: ${end}`);
    const t1 = dttMap.get(start);
    const t2 = dttMap.get(end);
    const key = numbersToStringRange([start, end]);
    if (isNullOrUndefined(t1) || isNullOrUndefined(t2)) {
      vMap.set(key, 0);
    } else {
      console.log(`Velocity for ${start}-${end}: ${(end - start) / ((t2! - t1!) / 1000)}`);
      vMap.set(key, (end - start) / ((t2! - t1!) / 1000)); // convert from ms to s
    }
  });
  return vMap;
}

type SrMap = Map<string, number>;

function computeStrokeRate(): SrMap {
  const annotationInfo = AKB.getAnnotationInfo();
  const sc = annotationInfo.strokeCounts.entries();
  const srMap: SrMap = new Map();
  sc.forEach((e) => {
    const { strokeCount: sc, startTime: t1, endTime: t2 } = e[1];
    const time = (t2 - t1) / 60000; // in minutes
    srMap.set(e[0].toHashString(), sc / time);
  });
  return srMap;
}

type ScMap = Map<string, number>;

function computeStrokeCounts(
  distanceToTime?: DistanceToTime,
  strokeRateMap?: SrMap
): ScMap {
  const scMap: ScMap = new Map();

  let dttMap: DistanceToTime;
  if (isNotNullNotUndefined(distanceToTime)) {
    dttMap = distanceToTime!;
  } else {
    dttMap = getDistanceTimeMap();
  }
  let srMap: SrMap;
  if (isNotNullNotUndefined(strokeRateMap)) {
    srMap = strokeRateMap!;
  } else {
    srMap = computeStrokeRate();
  }
  Array.from(srMap.entries()).forEach((e) => {
    const key = e[0];
    const sr = e[1];
    const splitted = key.split("-");
    if (splitted.length !== 2) {
      console.log(`computeStrokeCounts - splitted has length of ${splitted.length}`);
      return;
    }
    const d1 = parseInt(splitted[0]);
    const d2 = parseInt(splitted[1]);
    if (
      isNullOrUndefined(sr) ||
      isNullOrUndefined(d1) ||
      isNullOrUndefined(d2)
    ) {
      console.log(`computeStrokeCounts - sr: ${sr} d1: ${d1} d2: ${d2}`);
      return;
    }
    const t1 = dttMap.get(d1);
    const t2 = dttMap.get(d2);

    if (isNullOrUndefined(t1) || isNullOrUndefined(t2)) {
      console.log(`computeStrokeCounts - t1: ${t1} t2: ${t2}`);
      return;
    }
    const timeTaken = (t2! - t1!) / 60000; // to minutes

    scMap.set(key, sr * timeTaken);
  });
  return scMap;
}

export interface ComputedResult {
  distanceToTimeMap: DistanceToTime;
  strokeCounts: ScMap;
  strokeRates: SrMap;
  averageVelocities: VelocityMap;
}

export function computeResult(): ComputedResult {
  const dttMap = getDistanceTimeMap();
  const vMap = computeAverageVelocities(dttMap);
  const srMap = computeStrokeRate();
  const scMap = computeStrokeCounts(dttMap, srMap);
  return {
    distanceToTimeMap: dttMap,
    strokeCounts: scMap,
    strokeRates: srMap,
    averageVelocities: vMap,
  };
}
