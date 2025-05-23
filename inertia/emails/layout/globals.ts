import env from '#start/env'
import { DateTime } from 'luxon'
import { format } from 'date-fns'

export const appUrl = env.get('APP_URL') || 'http://localhost:3333'

export function getDateRange(startDate?: string, endDate?: string): [string, string] {
  const now = DateTime.now()
  return startDate && endDate ? [startDate, endDate] : ['1970-01-01', now.toISODate()!]
}

export const ordinalize = (num: number) => {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) {
    return `${num}st`
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`
  }
  return `${num}th`
}

export const pluralize = (num: number, word: string) => {
  if (num > 1) {
    return `${word}s`
  }
  return word
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''

  // Replace underscores and hyphens with spaces
  const modifiedStr = str.replace(/[_-]/g, ' ')

  // Capitalize the first letter
  const firstLetter = modifiedStr.charAt(0).toUpperCase()
  const restOfString = modifiedStr.slice(1)

  return firstLetter + restOfString
}

export function startCase(str?: string): string {
  if (!str) {
    return ''
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // add space between camelCase words
    .replace(/[_-]/g, ' ') // replace underscores and hyphens with spaces
    .replace(/\b\w/g, (match) => match.toUpperCase()) // capitalize first letter of each word
}

export function lowerCase(str: string): string {
  if (typeof str !== 'string') {
    console.warn('Input is not a string')
    return ''
  }
  return str.toLowerCase()
}

export const dateFormats = {
  short: 'MMM d', // Jan 15
  medium: 'MMM d, yyyy', // Jan 15, 2024
  long: 'MMMM d, yyyy', // January 15, 2024
  time: 'h:mm a', // 3:30 PM
  dateTime: 'MMM d, yyyy h:mm a', // Jan 15, 2024 3:30 PM
  iso: 'yyyy-MM-dd', // 2024-01-15
  full: 'EEEE, MMMM d, yyyy', // Monday, January 15, 2024
} as const

type DateFormatStyle = keyof typeof dateFormats

/**
 * Universal date formatter function
 * @param date - Date to format (string, Date object, or timestamp)
 * @param style - Format style to use (defaults to 'medium')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date | number,
  style: DateFormatStyle = 'medium',
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, dateFormats[style])
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
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
