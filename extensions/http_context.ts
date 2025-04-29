import { HttpContext } from '@adonisjs/core/http'
import type { CookieOptions } from '@adonisjs/core/types/http'

HttpContext.getter('cookie', function (this: HttpContext) {
  return {
    get: (key: string, defaultValue?: string) => this.request.cookie(key, defaultValue),
    set: (key: string, value: any, options?: CookieOptions & { encode: boolean }) =>
      this.response.plainCookie(key, value, {
        httpOnly: false,
        secure: false,
        encode: false,
        ...options,
      }),
    clear: (key: string) => this.response.clearCookie(key),
  }
})

declare module '@adonisjs/core/http' {
  interface HttpContext {
    cookie: {
      get: (key: string, defaultValue?: string) => string | undefined
      set: (key: string, value: string, options?: CookieOptions & { encode: boolean }) => void
      clear: (key: string) => void
    }
  }
}
