/**
 * A constant map of all available routes in the application.
 * Each key represents a route identifier in snake_case format,
 * and each value represents the actual URL path.
 *
 * @example
 * ```ts
 * ROUTE_PATHS.home // '/'
 * ROUTE_PATHS.individual_event // '/events/:eventId'
 * ```
 */
export const ROUTE_PATHS = {
  home: '/',
  about: '/about',
  auth_create_account: '/auth/create-account',
  auth_login: '/auth/login',
  dashboard: '/dashboard',
  dashboard_customers: '/dashboard/customers',
  dashboard_customers_create: '/dashboard/customers/create',
  dashboard_customers_edit: '/dashboard/customers/:customerId/edit',
  dashboard_jobs: '/dashboard/jobs',
  dashboard_jobs_create: '/dashboard/jobs/create',
  dashboard_jobs_edit: '/dashboard/jobs/:jobId/edit',
  dashboard_invoices: '/dashboard/invoices',
  dashboard_invoices_create: '/dashboard/invoices/create',
  dashboard_payments: '/dashboard/payments',
  dashboard_payments_create: '/dashboard/payments/create',
  dashboard_finance: '/dashboard/finance',
  dashboard_settings: '/dashboard/settings',
  dashboard_customers_individual: '/dashboard/customers/:customerId',
  not_found: '*',
} as const

/**
 * Type representing all valid route keys from ROUTE_PATHS.
 * Used for type-safe route access throughout the application.
 */
export type RouteKey = keyof typeof ROUTE_PATHS

/**
 * Interface defining the required parameters for each route.
 * Routes that don't require parameters are marked with `never`.
 * Routes with dynamic segments (like :eventId) require corresponding parameters.
 *
 * @example
 * ```ts
 * // No parameters needed
 * RouteParams.home // never
 *
 * // Parameters required
 * RouteParams.individual_event // { eventId: string | number }
 * ```
 */
export interface RouteParams {
  home: never
  about: never
  auth_create_account: never
  auth_login: never
  dashboard: never
  dashboard_customers: never
  dashboard_customers_create: never
  dashboard_customers_edit: { customerId: string }
  dashboard_jobs: never
  dashboard_jobs_create: never
  dashboard_jobs_edit: { jobId: string }
  dashboard_invoices: never
  dashboard_invoices_create: never
  dashboard_payments: never
  dashboard_payments_create: never
  dashboard_finance: never
  dashboard_settings: never
  not_found: never
  dashboard_customers_individual: { customerId: string }
}
