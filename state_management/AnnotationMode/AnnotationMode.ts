import { StrokeRange } from "../AKB/StrokeCounts";

export class AnnotationMode {
  name: string;
  checkpointNames: NameDistance[];
  strokeRanges: StrokeRange[];
  constructor(n: string, checkpointNames: NameDistance[], strokeRanges: StrokeRange[]) {
    this.name = n;
    this.checkpointNames = checkpointNames;
    this.strokeRanges = strokeRanges;
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

  /**
   * Returns the next distance from the race mode.
   * If there isn't any other distance after, returns the last
   * distance in the race mode. If there is
   * nothing in the race mode, returns -1.
   * @param distance 
   * @returns the next distance
  */
  public nextDistance = (distance:number):number => {
    const len = this.checkpointNames.length;
    if (len === 0) {
      return -1;
    }
    const index = this.checkpointNames.findIndex(e=>e.distanceMeter > distance);
    // can't find so return the last distance
    if (index === -1) {
      return this.checkpointNames[len - 1].distanceMeter;
    }
    return this.checkpointNames[index].distanceMeter;
  }

  public toString = () => this.name;
}

export interface NameDistance {
  name: string;
  distanceMeter: number;
}