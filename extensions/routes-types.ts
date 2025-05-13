
export const API_ROUTES = {
  GET: ['openapi',
    'api/v1/users/me',
    'api/v1/customers/all',
    'api/v1/customers/stats',
    'api/v1/customers/:id',
    'api/v1/jobs/dashboard',
    'api/v1/jobs',
    'api/v1/payments',
    'api/v1/invoices',
    'api/v1/health'] as const,
  POST: ['api/v1/users',
    'api/v1/users/login',
    'api/v1/customers',
    'api/v1/jobs',
    'api/v1/payments',
    'api/v1/invoices'] as const,
  PUT: ['api/v1/users/:id',
    'api/v1/customers/:id',
    'api/v1/jobs/:id',
    'api/v1/payments/:id',
    'api/v1/invoices/:id'] as const,
  DELETE: ['api/v1/users/:id',
    'api/v1/customers/:id',
    'api/v1/jobs/:id',
    'api/v1/payments/:id',
    'api/v1/invoices/:id'] as const,
};

type ReplaceParam<T extends string> =
  T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? `${Start}${string}/${ReplaceParam<Rest>}`
    : T extends `${infer Start}:${infer Param}`
      ? `${Start}${string}`
      : T;

type TransformRoutes<T extends readonly string[]> = {
  [K in keyof T]: T[K] | ReplaceParam<T[K]>;
}[number];

export type APIRoutes = {
  [K in keyof typeof API_ROUTES]: TransformRoutes<typeof API_ROUTES[K]>;
};

export type APIRouteStatic = {
  [K in keyof typeof API_ROUTES]: typeof API_ROUTES[K][number];
};

// Usage example:
// const apiRoutes: APIRoutes = API_ROUTES as any;
