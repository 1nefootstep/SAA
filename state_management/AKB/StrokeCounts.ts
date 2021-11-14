import { compareMaps, isNullOrUndefined, nestedArrayMap, numbersToStringRange } from "../../components/Util";
import { Timestamp } from "./Annotations";

export interface StrokeCountWithTimes {
  strokeCount: number;
  startTime: number;
  endTime: number;
}

export class StrokeRange {
  startRange: Timestamp;
  endRange: Timestamp;
  constructor(sr: Timestamp, er: Timestamp) {
    this.startRange = sr === NaN ? 0 : sr;
    this.endRange = er === NaN ? 0 : er;
  }

  toString() {
    return `SC ${this.startRange}-${this.endRange}m`;
  }

  toHashString() {
    return numbersToStringRange([this.startRange, this.endRange]);
  }

  static fromHashString(str: string) {
    const splitted = str.split("-");
    try {
      const sr = parseInt(splitted[0]);
      const er = parseInt(splitted[1]);
      return new StrokeRange(sr, er);
    } catch (err) {
      console.log(`string is incorrectly formatted. error was: ${err}`);
      return new StrokeRange(0, 0);
    }
  }
}

export class StrokeCounts {
  private strokeCounts: Map<string, StrokeCountWithTimes>;

  constructor(arg: Array<[StrokeRange, StrokeCountWithTimes]>) {
    // const prepareArg: Array<[string, StrokeCount]> = [];
    // arg.forEach((e) => prepareArg.push([e[0].toString(), e[1]]));
    const mapped = nestedArrayMap<StrokeRange, string, StrokeCountWithTimes>(
      arg,
      (sr: StrokeRange) => sr.toHashString()
    );
    this.strokeCounts = new Map(mapped);
  }

  static fromJSON(arg: Array<[string, StrokeCountWithTimes]>) {
    const toStrokeRange: Array<[StrokeRange, StrokeCountWithTimes]> = [];
    arg.forEach((e) =>
      toStrokeRange.push([StrokeRange.fromHashString(e[0]), e[1]])
    );
    return new StrokeCounts(toStrokeRange);
  }

  toJSON() {
    return Array.from(this.strokeCounts.entries());
  }

  entries = () =>
    nestedArrayMap<string, StrokeRange, StrokeCountWithTimes>(
      Array.from(this.strokeCounts.entries()),
      (s: string) => StrokeRange.fromHashString(s)
    );
  values = () => this.strokeCounts.values();
  keys = () =>
    Array.from(this.strokeCounts.keys()).map((e) =>
      StrokeRange.fromHashString(e)
    );
  set = (sr: StrokeRange, sc: StrokeCountWithTimes) => {
    this.strokeCounts.set(sr.toHashString(), sc);
  };
  get = (sr: StrokeRange) => { 
    if (isNullOrUndefined(sr)) {
      return undefined;
    }
    return this.strokeCounts.get(sr.toHashString());
  };
  public toString = this.toJSON;

  public equals = (other: StrokeCounts) => {
    return compareMaps(this.strokeCounts, other.strokeCounts);
  };
}
