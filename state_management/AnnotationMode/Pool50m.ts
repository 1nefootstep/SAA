import { StrokeRange } from "../AKB/StrokeCounts";
import { AnnotationMode, NameDistance } from "./AnnotationMode";

function firstLapCheckpoint(startDistance: number): Array<NameDistance> {
  return [
    { name: `${startDistance}m`, distanceMeter: startDistance },
    { name: `${startDistance + 15}m`, distanceMeter: startDistance + 15 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
    { name: `${startDistance + 35}m`, distanceMeter: startDistance + 35 },
    { name: `${startDistance + 45}m`, distanceMeter: startDistance + 45 },
    { name: `${startDistance + 50}m`, distanceMeter: startDistance + 50 },
  ];
}

function subsequentLapCheckpoint(startDistance: number): Array<NameDistance> {
  return [
    { name: `${startDistance + 15}m`, distanceMeter: startDistance + 15 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
    { name: `${startDistance + 45}m`, distanceMeter: startDistance + 45 },
    { name: `${startDistance + 50}m`, distanceMeter: startDistance + 50 },
  ];
}

function strokeRangePerLap(startDistance: number): Array<StrokeRange> {
  return [
    new StrokeRange(startDistance + 15, startDistance + 25),
    new StrokeRange(startDistance + 25, startDistance + 45),
  ];
}

class Pool50m extends AnnotationMode {
  constructor(style: string, totalDistance: number) {
    let distanceLeft = totalDistance;
    let checkpoints: Array<NameDistance> = [];
    let strokeRanges: Array<StrokeRange> = [];
    const POOL_DISTANCE = 50;
    let lastDistance = 0;
    while (distanceLeft > 0) {
      strokeRanges = strokeRanges.concat(strokeRangePerLap(lastDistance));
      if (checkpoints.length === 0) {
        checkpoints = checkpoints.concat(firstLapCheckpoint(0));
      } else {
        checkpoints = checkpoints.concat(subsequentLapCheckpoint(lastDistance));
      }
      lastDistance += POOL_DISTANCE;
      distanceLeft -= POOL_DISTANCE;
    }
    super(`${style}-${totalDistance}m`, checkpoints, strokeRanges);
  }
}

const NAME_PREFIX = '50m Pool';

export class Freestyle50mMode extends Pool50m {
  constructor() {
    super(NAME_PREFIX, 50);
  }
}

export class Freestyle100mMode extends Pool50m {
  constructor() {
    super(NAME_PREFIX, 100);
  }
}

export class Freestyle200mMode extends Pool50m {
  constructor() {
    super(NAME_PREFIX, 200);
  }
}

export class Freestyle400mMode extends Pool50m {
  constructor() {
    super(NAME_PREFIX, 400);
  }
}
