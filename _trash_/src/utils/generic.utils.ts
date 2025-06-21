export function randomPositiveNumber(max: number): number {
  return Math.abs(Math.floor(Math.random() * max));
}

export function randomizeArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((val1, val2) => val1.sort - val2.sort)
    .map(({ value }) => value);
}
