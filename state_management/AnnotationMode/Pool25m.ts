import { AnnotationMode, NameDistance } from "./AnnotationMode";

function firstLap(startDistance: number): Array<NameDistance> {
  return [
    { name: `${startDistance}m`, distanceMeter: startDistance },
    { name: `${startDistance + 15}m`, distanceMeter: startDistance + 15 },
    { name: `${startDistance + 20}m`, distanceMeter: startDistance + 20 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
  ];
}

function subsequentLap(startDistance: number): Array<NameDistance> {
  return [
    { name: `${startDistance + 10}m`, distanceMeter: startDistance + 10 },
    { name: `${startDistance + 20}m`, distanceMeter: startDistance + 20 },
    { name: `${startDistance + 25}m`, distanceMeter: startDistance + 25 },
  ];
}

class Pool25m extends AnnotationMode {
  constructor(style: string, totalDistance: number) {
    let distanceLeft = totalDistance;
    let checkpoints: Array<NameDistance> = [];
    const POOL_DISTANCE = 25;
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

const NAME_PREFIX = "25m Pool";

export class Freestyle25mMode extends Pool25m {
  constructor() {
    super(NAME_PREFIX, 25);
  }
}

export class Freestyle50mMode extends Pool25m {
  constructor() {
    super(NAME_PREFIX, 50);
  }
}

export class Freestyle100mMode extends Pool25m {
  constructor() {
    super(NAME_PREFIX, 100);
  }
}

export class Freestyle200mMode extends Pool25m {
  constructor() {
    super(NAME_PREFIX, 200);
  }
}

export class Freestyle400mMode extends Pool25m {
  constructor() {
    super(NAME_PREFIX, 400);
  }
}
