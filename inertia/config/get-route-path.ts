import { ROUTE_PATHS, type RouteKey, type RouteParams } from './route-map'

/**
 * Generates a type-safe route path with optional parameters.
 * This function ensures that routes requiring parameters cannot be accessed without them,
 * and routes without parameters cannot be called with parameters.
 *
 * @param route - The route key from ROUTE_PATHS
 * @param params - Optional parameters for dynamic routes
 * @returns The complete route path with parameters interpolated
 *
 * @example
 * ```ts
 * // Static route (no parameters)
 * getRoutePath('home') // '/'
 * getRoutePath('about_us') // '/about-us'
 *
 * // Dynamic route (parameters required)
 * getRoutePath('individual_event', { eventId: 123 }) // '/events/123'
 * getRoutePath('individual_resale', { eventId: 'abc' }) // '/resale/abc'
 *
 * // TypeScript errors
 * getRoutePath('individual_event') // ❌ Error: missing parameters
 * getRoutePath('home', { eventId: 123 }) // ❌ Error: unexpected parameters
 * ```
 */
export function getRoutePath<K extends RouteKey>(
  route: K,
  ...params: RouteParams[K] extends never ? [] : [RouteParams[K]]
): string {
  let path: string = ROUTE_PATHS[route]
  if (params.length > 0) {
    const paramObj = params[0] as Record<string, string | number>
    for (const [key, value] of Object.entries(paramObj)) {
      path = path.replace(`:${key}`, String(value))
    }
  }
  return path
}
