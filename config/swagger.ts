// for AdonisJS v6
import path from 'node:path'
import url from 'node:url'
// ---

export default {
  // path: __dirname + "/../", for AdonisJS v5
  path: `${path.dirname(url.fileURLToPath(import.meta.url))}/../`, // for AdonisJS v6
  title: 'Foo', // use info instead
  version: '1.0.0', // use info instead
  description: '', // use info instead
  tagIndex: 3,
  info: {
    title: 'owomi API',
    version: '1.0.0',
    description: 'This is the API documentation for the owomi API',
  },
  snakeCase: true,
  debug: false, // set to true, to get some useful debug output
  ignore: ['/swagger', '/docs', '*/dashboard', '/dashboard/*', '/auth/*'],

  preferredPutPatch: 'PUT', // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Bearer',
    },
  }, // optional
  // authMiddlewares: ['auth:api'], // optional
  // defaultSecurityScheme: 'Bearer', // optional
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: true, // the path displayed after endpoint summary
}
