export function isArrayOfObjects<T>(data: unknown): data is T[] {
  return Array.isArray(data) && data.every((item) => typeof item === 'object' && item !== null);
}

export function isArrayOfStrings(data: unknown): data is string[] {
  return Array.isArray(data) && data.every((item) => typeof item === 'string');
}
export function isObject<T>(data: unknown): data is T {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}
