export const getFromLocalStorage = <T>(
  key: string,
  typeGuard: (value: unknown) => value is T
) => {
  const item = localStorage.getItem(key);
  if (item === null || item === "undefined") {
    return null;
  }
  const parsedValue = JSON.parse(item);

  if (typeGuard(parsedValue)) {
    return parsedValue;
  }
  return null;
};
