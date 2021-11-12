export class AnnotationMode {
  name: string;
  checkpointNames: NameDistance[];
  constructor(n: string, checkpointNames: NameDistance[]) {
    this.name = n;
    this.checkpointNames = checkpointNames;
  }

  /**
   * Returns the index of the distance. Defaults to -1 if 
   * could not find
   * @param distance 
   * @returns index of the distance or -1 if could not find
   */
  public indexFromDistance = (distance: number): number => {
    return this.checkpointNames.findIndex(e => e.distanceMeter === distance);
  }

  public toString = () => this.name;
}

export interface NameDistance {
  name: string;
  distanceMeter: number;
}
