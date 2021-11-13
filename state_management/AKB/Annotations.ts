import { compareMaps } from "../../components/Util";

export type Distance = number;
export type Timestamp = number;

export class Annotations {
  annotations: Map<Distance, Timestamp>;
  constructor(arg: Array<[Distance, Timestamp]> | string) {
    if (typeof arg === "string") {
        try {
            const arr = JSON.parse(arg);
            this.annotations = new Map(arr);
        } catch (err) {
            console.log(`JSON conversion of annotation map failed: ${err}`);
            this.annotations = new Map();
        }
    } else {
      this.annotations = new Map(arg);
    }
  }

  public toJSON = (): string => {
    return JSON.stringify(Array.from(this.annotations.entries()));
  };

  public toString = this.toJSON;

  public equals = (other: Annotations) => {
    return compareMaps(this.annotations, other.annotations);
  };
}
