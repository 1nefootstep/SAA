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

export function compareMaps<K, V>(map1: Map<K, V>, map2: Map<K, V>) {
  var testVal;
  if (map1.size !== map2.size) {
    return false;
  }
  for (var [key, val] of map1) {
    testVal = map2.get(key);
    // in cases of an undefined value, make sure the key
    // actually exists on the object so there are no false positives
    if (testVal !== val || (testVal === undefined && !map2.has(key))) {
      return false;
    }
  }
  return true;
}
