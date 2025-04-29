import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  /**
   * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
   * set to the instance of the currently logged in user.
   */
  async handle({ auth, inertia, session }: HttpContext, next: NextFn) {
    const isLoggedIn = await auth.check()
    inertia.share({
      session: session.all(),
      errors: (ctx: HttpContext) => ctx.session?.flashMessages.get('errors'),
    })
    if (isLoggedIn) {
      const user = await auth.authenticate()
      inertia.share({
        user: user,
        isAuthenticated: true,
      })
    }

    return next()
  }
}
