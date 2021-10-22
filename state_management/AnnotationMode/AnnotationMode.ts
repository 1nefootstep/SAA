export class AnnotationMode {
  name:string;
  checkpointNames: NameDistance[];
  constructor(n:string, checkpointNames: NameDistance[]) {
    this.name = n;
    this.checkpointNames = checkpointNames;
  }
}

export interface NameDistance {
  name: string;
  distanceMeter: number;
}

export class Freestyle50mMode extends AnnotationMode {
  constructor() {
    super("fs-50m", [
      {name: "Start", distanceMeter: 0},
      {name: "15m", distanceMeter: 15},
      {name: "25m", distanceMeter: 25},
      {name: "35m", distanceMeter: 35},
      {name: "5m BE", distanceMeter: 45},
      {name: "End", distanceMeter: 50},
    ]);
  }
}

export class Freestyle100mMode extends AnnotationMode {
  constructor() {
    super("fs-100m", [
      {name: "Start", distanceMeter: 0},
      {name: "15m", distanceMeter: 15},
      {name: "25m", distanceMeter: 25},
      {name: "35m", distanceMeter: 35},
      {name: "5m BT", distanceMeter: 45},
      {name: "50m", distanceMeter: 50},
      {name: "15m AT", distanceMeter: 65},
      {name: "75m", distanceMeter: 75},
      {name: "5m BE", distanceMeter: 95},
      {name: "End", distanceMeter: 100},
    ]);
  }
}

export class Freestyle200mMode extends AnnotationMode {
  constructor() {
    super("fs-200m", [
      {name: "Start", distanceMeter: 0},
      {name: "15m", distanceMeter: 15},
      {name: "25m", distanceMeter: 25},
      {name: "35m", distanceMeter: 35},
      {name: "5m BT1", distanceMeter: 45},
      {name: "50m", distanceMeter: 50},
      {name: "15m AT1", distanceMeter: 65},
      {name: "75m", distanceMeter: 75},
      {name: "5m BT2", distanceMeter: 95},
      {name: "100m", distanceMeter: 100},
      {name: "15m AT2", distanceMeter: 115},
      {name: "125m", distanceMeter: 125},
      {name: "5m BT3", distanceMeter: 145},
      {name: "150m", distanceMeter: 150},
      {name: "15m AT3", distanceMeter: 165},
      {name: "175m", distanceMeter: 175},
      {name: "5m BE", distanceMeter: 195},
      {name: "End", distanceMeter: 200},
    ]);
  }
}