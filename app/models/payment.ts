import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Customer from './customer.js'

export type PaymentStatus =
  | 'paid'
  | 'processing'
  | 'overpaid'
  | 'underpaid'
  | 'unpaid'
  | 'pending'
  | 'failed'
  | 'refunded'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column() declare title: string
  @column() declare description: string
  @column() declare amount: number
  @column() declare currencyCode: string
  @column() declare status: PaymentStatus
  @column() declare paymentProvider: string
  @column() declare paymentMethod: string
  @column() declare paymentUrl: string
  @column() declare paymentDate: Date

  @belongsTo(() => Customer) declare customer: BelongsTo<typeof Customer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
