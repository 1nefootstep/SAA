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

/**
 * This is meant to replicate the behaviour for map.
 * But somehow, [T1, G][].map => [T2, G][][].
 * Instead, this function take [T1, G][] and returns [T2, G][].
 * @param nestedArr [T1, G][]
 * @param fn function for T1 => T2
 * @returns [T2, G][]
 */
export function nestedArrayMap<T1, T2, G>(
  nestedArr: Array<[T1, G]>,
  fn: (t1: T1) => T2
) {
  const prepareArg: Array<[T2, G]> = [];
  nestedArr.forEach((e) => prepareArg.push([fn(e[0]), e[1]]));
  return prepareArg;
}

/**
 * Converts an array of number to string
 * by joining with '-'
 * @param nums Array of number
 */
export function numbersToStringRange(nums: Array<number>) {
  console.log(`numbersToStringRange, args: ${nums}`);
  return nums.map(e=>e.toString()).join('-');
}