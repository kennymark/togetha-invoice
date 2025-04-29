import type { QueryParams } from '#utils/vine'
import { Request, Response } from '@adonisjs/core/http'
import type { CookieOptions } from '@adonisjs/core/types/http'
import { DateTime } from 'luxon'

type AppEnv = 'dev' | 'prod'

Request.macro('appEnv', function (this: Request): AppEnv {
  const headers = this.headers()
  const appEnv = headers['app-env'] || ''
  return appEnv as AppEnv
})

Request.macro('timeZone', function (this: Request): string {
  const headers = this.headers()
  const timezone = headers['Timezone'] || ''
  return timezone?.toString()
})

Request.macro('userDateTime', function (this: Request): DateTime {
  const timezone = this.timeZone()
  const dateTime = DateTime.now().setZone(timezone)
  return dateTime
})

Request.macro('appDateTime', function (this: Request): DateTime {
  const timezone = 'Europe/London'

  const dateTime = DateTime.now().setZone(timezone)
  return dateTime
})

Response.macro(
  'setCookie',
  function (
    this: Response,
    name: string,
    value: string,
    options: CookieOptions & { encode: boolean },
  ) {
    return this.plainCookie(name, value, options)
  },
)

declare module '@adonisjs/core/http' {
  interface Request {
    appEnv(): 'dev' | 'prod'
    appHost(): string
    timeZone(): string
    userDateTime(): DateTime
    appDateTime(): DateTime
    paginationQs(): Promise<QueryParams>
    authHeader(data: {}): Record<string, string>
  }
  interface Response {
    setCookie(
      name: string,
      value: string,
      options?: Partial<CookieOptions & { encode: boolean }>,
    ): void
  }
}
