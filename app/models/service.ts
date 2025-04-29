import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column() declare name: string
  @column() declare description: string
  @column() declare quantity: number
  @column() declare unitPrice: number
  @column() declare totalPrice: number
  @column() declare invoiceId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
