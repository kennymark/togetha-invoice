import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import type { ModelObject } from '@adonisjs/lucid/types/model'
import type { DateTime } from 'luxon'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column() declare fullName: string

  @column() declare email: string

  @column() declare secondaryEmail: string

  @column({ serializeAs: null }) declare password: string

  @column({ columnName: 'is_2fa_enabled' }) declare is2faEnabled: boolean

  @column() declare contactNumber: string

  @column()
  declare resetToken: string | null

  @column.dateTime()
  declare resetTokenExpiresAt: DateTime | null

  @column() declare metadata: ModelObject

  @column() declare status: 'active' | 'inactive' | 'suspended' | 'pending'

  @computed() get isActive() {
    return this.status === 'active'
  }

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30d',
  })

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
