import { VineString } from '@vinejs/vine'
import { type DbOptions, existsRule, uniqueRule } from './db.js'

declare module '@vinejs/vine' {
  interface VineString {
    unique(options: DbOptions): this
    exists(options: DbOptions): this
  }
}

VineString.macro('unique', function (this: VineString, options: DbOptions) {
  return this.use(uniqueRule(options))
})

VineString.macro('exists', function (this: VineString, options: DbOptions) {
  return this.use(existsRule(options))
})
