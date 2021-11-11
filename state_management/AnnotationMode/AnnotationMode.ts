export class AnnotationMode {
  name: string;
  checkpointNames: NameDistance[];
  constructor(n: string, checkpointNames: NameDistance[]) {
    this.name = n;
    this.checkpointNames = checkpointNames;
  }
}

export interface NameDistance {
  name: string;
  distanceMeter: number;
}
