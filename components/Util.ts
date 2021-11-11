/**
 * Returns i such that 0 ≤ i ≤ array.length and
 * the given predicate is false for array[i - 1]
 * and true for array[i].
 * If the predicate is false everywhere, array.length is returned.
 */
export function binarySearch<T>(array: T[], pred: (a: T) => boolean) {
  let lo = -1,
    hi = array.length;
  while (1 + lo < hi) {
    const mi = lo + ((hi - lo) >> 1);
    if (pred(array[mi])) {
      hi = mi;
    } else {
      lo = mi;
    }
  }
  return hi;
}

export function isNotNullNotUndefined(anything: any) {
  return anything !== undefined && anything !== null;
}

export function isNullOrUndefined(anything: any) {
  return anything === undefined || anything === null;
}
