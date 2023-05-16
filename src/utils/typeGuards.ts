export const isArrayOfNumberOrNull = (
  value: unknown
): value is (number | null)[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === "number" || item === null);

export const isArrayOfNumber = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === "number");
