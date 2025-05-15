/**
 * Helper function to check if the application is running in development mode
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development'

/**
 * Helper function to check if we should show development-only features
 * This can be extended to include other conditions in the future
 */
export const showDevFeatures = () => isDevelopment()
