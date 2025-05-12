export function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (typeof acc === 'object' && acc !== null && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

export function isNumeric(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return false
  return !Number.isNaN(Number(value))
}

export function compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  // Handle null/undefined values
  if (a === undefined || a === null) return direction === 'asc' ? -1 : 1
  if (b === undefined || b === null) return direction === 'asc' ? 1 : -1

  // Check if both values can be converted to numbers
  if (isNumeric(a) && isNumeric(b)) {
    const numA = Number(a)
    const numB = Number(b)
    return direction === 'asc' ? numA - numB : numB - numA
  }

  // String comparison for non-numeric values
  const strA = String(a).toLowerCase()
  const strB = String(b).toLowerCase()

  if (strA < strB) return direction === 'asc' ? -1 : 1
  if (strA > strB) return direction === 'asc' ? 1 : -1
  return 0
}
