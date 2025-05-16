import { format } from 'date-fns'

/**
 * Helper function to check if the application is running in development mode
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development'

/**
 * Helper function to check if we should show development-only features
 * This can be extended to include other conditions in the future
 */
export const showDevFeatures = () => isDevelopment()

/**
 * Date format styles for consistent date formatting across the application
 */
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
