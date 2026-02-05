export type FlatObject = {
  [key: string]: string | number | boolean | null | undefined;
};

export type RowEditState<T extends FlatObject> = Readonly<{
  markedForDeletion: boolean;
  value: Readonly<T>;
}>;

/**
 * This is a deep equality operator that checks for equality one layer deep.
 * This is intended for comparing database rows represented as objects.
 */
export function rowEquals(
  a: Readonly<FlatObject>,
  b: Readonly<FlatObject>,
): boolean {
  const keysA = new Set(Object.keys(a));
  const keysB = new Set(Object.keys(b));

  if (keysA.symmetricDifference(keysB).size > 0) {
    return false;
  }

  for (const key of keysA) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
