/**
 * This is a deep equality operator that checks for equality one layer deep.
 * This is intended for comparing database rows represented as objects.
 */
export function rowEquals(a: Readonly<object>, b: Readonly<object>): boolean {
  const keysA = new Set(Object.keys(a));
  const keysB = new Set(Object.keys(b));

  if (keysA.symmetricDifference(keysB).size > 0) {
    return false;
  }

  for (const key of keysA) {
    if (a[key as keyof typeof a] !== b[key as keyof typeof b]) {
      return false;
    }
  }

  return true;
}
