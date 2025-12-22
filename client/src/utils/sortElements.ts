type SortOrder = "asc" | "desc";
type SortableValue = string | number | boolean | Date | null | undefined;

const getComparableValue = (
  item: Record<string, unknown>,
  key: string
): SortableValue => item[key] as SortableValue;

const compareValues = (a: SortableValue, b: SortableValue): number => {
  if (a === b) return 0;
  if (a === undefined || a === null) return 1;
  if (b === undefined || b === null) return -1;

  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }

  const aNumber = a instanceof Date ? a.getTime() : Number(a);
  const bNumber = b instanceof Date ? b.getTime() : Number(b);

  if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) {
    return aNumber - bNumber;
  }

  return a > b ? 1 : -1;
};

export const sortElements = <T extends Record<string, unknown>>(
  items: readonly T[],
  key: string,
  order: SortOrder
): T[] => {
  const direction = order === "desc" ? -1 : 1;

  return [...items].sort((first, second) => {
    const firstValue = getComparableValue(first, key);
    const secondValue = getComparableValue(second, key);

    return compareValues(firstValue, secondValue) * direction;
  });
};
