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
      {name: "Free swimming 15m", distanceMeter: 15},
      {name: "5m before end", distanceMeter: 45},
      {name: "End", distanceMeter: 50},
    ]);
  }
}

export class Freestyle100mMode extends AnnotationMode {
  constructor() {
    super("fs-100m", [
      {name: "Start", distanceMeter: 0},
      {name: "Free swimming 15m", distanceMeter: 15},
      {name: "7.5m before turn", distanceMeter: 42.5},
      {name: "7.5m after turn", distanceMeter: 57.5},
      {name: "End", distanceMeter: 100},
    ]);
  }
}

// export class AnnotationMode {
//   name:string;
//   checkpointNames: NameDistance[];
//   constructor(n:string, checkpointNames: NameDistance[]) {
//     this.name = n;
//     this.checkpointNames = checkpointNames;
//   }
// }


// export class Freestyle50mMode extends AnnotationMode {
//   constructor() {
//     super("fs-50m", [
//       {name: "Start", distanceMeter: 0},
//       {name: "Free swimming 15m", distanceMeter: 15},
//       {name: "5m before end", distanceMeter: 45},
//       {name: "End", distanceMeter: 50},
//     ]);
//   }
// }

// export class Freestyle100mMode extends AnnotationMode {
//   constructor() {
//     super("fs-100m", [
//       {name: "Start", distanceMeter: 0},
//       {name: "Free swimming 15m", distanceMeter: 15},
//       {name: "7.5m before turn", distanceMeter: 42.5},
//       {name: "7.5m after turn", distanceMeter: 57.5},
//       {name: "End", distanceMeter: 100},
//     ]);
//   }
// }