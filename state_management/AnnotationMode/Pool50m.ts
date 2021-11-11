import { AnnotationMode, NameDistance } from "./AnnotationMode";

function firstLap(startDistance: number): Array<NameDistance> {
  return [
    { name: `${startDistance}m`, distanceMeter: startDistance },
    { name: `${startDistance + 15}m`, distanceMeter: startDistance + 15 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
    { name: `${startDistance + 35}m`, distanceMeter: startDistance + 35 },
    { name: `${startDistance + 45}m`, distanceMeter: startDistance + 45 },
    { name: `${startDistance + 50}m`, distanceMeter: startDistance + 50 },
  ];
}

function subsequentLap(startDistance: number): Array<NameDistance> {
  return [
    { name: `${startDistance + 15}m`, distanceMeter: startDistance + 15 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
    { name: `${startDistance + 45}m`, distanceMeter: startDistance + 45 },
    { name: `${startDistance + 50}m`, distanceMeter: startDistance + 50 },
  ];
}

class Pool50m extends AnnotationMode {
  constructor(style: string, totalDistance: number) {
    let distanceLeft = totalDistance;
    let checkpoints: Array<NameDistance> = [];
    const POOL_DISTANCE = 50;
    while (distanceLeft > 0) {
      if (checkpoints.length === 0) {
        checkpoints = checkpoints.concat(firstLap(0));
      } else {
        const lastDistance = checkpoints[checkpoints.length - 1].distanceMeter;
        checkpoints = checkpoints.concat(subsequentLap(lastDistance));
      }
      distanceLeft -= POOL_DISTANCE;
    }
    super(`${style}-${totalDistance}m`, checkpoints);
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
