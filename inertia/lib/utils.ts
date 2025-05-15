import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string | null, currency: string | null = 'USD') {
  if (value === null) {
    return '-'
  }

  const numericValue = typeof value === 'string' ? Number.parseInt(value) : value

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue)
}

// format to like 500k, 100k, 10m, 100m, etc
export function formatNumber(value: number | string) {
  if (typeof value === 'string') {
    value = Number.parseInt(value, 10)
  }

  const suffixes = ['', 'k', 'm', 'b', 't']
  const tier = (Math.log10(value) / 3) | 0

  if (tier === 0) return value.toString()

  const suffix = suffixes[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = value / scale

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix
}

export function getTwoInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

/**
 * Converts a PostGIS geometry point to latitude and longitude coordinates
 * @param postgisPoint - The PostGIS geometry point in EWKB format
 * @returns An object containing latitude and longitude
 */
export function parsePostgisPoint(postgisPoint: string): { lat: number; lng: number } | null {
  try {
    // Remove the SRID prefix if present (first 18 characters)
    const hexString = postgisPoint.slice(18)

    // Convert hex to buffer
    const buffer = Buffer.from(hexString, 'hex')

    // Read the coordinates (double precision, 8 bytes each)
    const lng = buffer.readDoubleLE(0)
    const lat = buffer.readDoubleLE(8)

    return { lat, lng }
  } catch (error) {
    console.error('Error parsing PostGIS point:', error)
    return null
  }
}

/**
 * Helper function to check if the application is running in development mode
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development'

/**
 * Helper function to check if we should show development-only features
 * This can be extended to include other conditions in the future
 */
export const showDevFeatures = () => isDevelopment()
