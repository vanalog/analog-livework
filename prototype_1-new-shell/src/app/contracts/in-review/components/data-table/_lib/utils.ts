/**
 * Calculate the difference between two numeric properties in a data object.
 * Returns undefined if the data object is undefined or if either property is undefined.
 *
 * @param data - The data object containing the properties
 * @param currentKey - Key for the current value
 * @param previousKey - Key for the previous value to compare against
 * @returns The difference (current - previous) or undefined
 */
export function calculateStatsDiff<T extends Record<string, unknown>>(
  data: T | undefined,
  currentKey: keyof T,
  previousKey: keyof T,
): number | undefined {
  if (!data) return undefined;

  const current = data[currentKey];
  const previous = data[previousKey];

  if (typeof current === "number" && typeof previous === "number") {
    return current - previous;
  }

  return undefined;
}
