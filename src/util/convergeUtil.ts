export const convergeToArray = <T>(e: undefined | null | T | (() => T) |  (() => T[]) | T[]): T[] => {
  if (!e || e === null) {
    return [];
  }

  if (typeof e === "function") { e = (e as () => T | T[])() }

  return Array.isArray(e) ? e : [e];
};

export const convergeToValue = <T>(
  e: undefined | null | T | (() => T),
  defaultValue?: T,
): T => {
  if (!e || e === null) return defaultValue as T;

  if (typeof e === "function") {
    return (e as () => T)();
  }

  return e;
};
