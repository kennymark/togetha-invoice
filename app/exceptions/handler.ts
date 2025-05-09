import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { inertia }) => inertia.render('errors/not_found', { error }),
    '500..599': (error, { inertia }) => inertia.render('errors/server_error', { error }),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    const { response } = ctx
    console.log(error)
    if (error.code === 'E_VALIDATION_EXCEPTION') {
      console.log('error', error.messages)
      return response.badRequest({
        error: 'Validation failed',
        type: 'validation',
        messages: error.messages,
      })
    }

    if (error.code === 'E_VALIDATION_ERROR') {
      return response.badRequest({
        error: 'Validation failed',
        type: 'validation',
        messages: error.messages,
      })
    }

    if (error.code === 'E_AUTHORIZATION_FAILURE') {
      return ctx.response.status(403).send({
        error: 'You are not authorized to perform this action',
        type: 'auth',
      })
    }

    if (error.code === 'E_INVALID_CREDENTIALS') {
      return response.unauthorized({ error: 'Your email or password is incorrect' })
    }

    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return response.unauthorized({
        error: 'Unauthorized access',
        type: 'authorization',
      })
    }

    // db field can not be null
    if (error.code === '23502') {
      return response.internalServerError({
        error: `The ${error.column} field is required and can not be null`,
        table: error.table,
      })
    }

    // duplicate key error
    if (error.code === '23505') {
      return response.badRequest({ error: convertToReadableFormat(error.detail) })
    }

    if (error.code === 'E_BAD_CSRF_TOKEN') {
      return response.badRequest({ error: 'CSRF token mismatch' })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}

// Key (email)=(agency@yourgaff.co.uk) already exists.
// convert this string to a more readable format
function convertToReadableFormat(error: string) {
  const regex = /Key \((.*?)\)=\((.*?)\) already exists./
  const match = error.match(regex)
  if (match) {
    return `The ${match[1]} ${match[2]} already exists.`
  }
  return error
}
