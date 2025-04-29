import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'

export default class Customer extends BaseModel {
  @column({ isPrimary: true }) declare id: string

  @column() declare fullName: string

  @column() declare email: string

  @column() declare phone: string

  @column() declare address: string

  @column() declare postCode: string

  @column() declare state: string

  @column() declare city: string

  @column() declare country: string

  @column() declare businessName: string

  @column() declare businessAddress: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
