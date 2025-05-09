import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Service from './service.js'

export type InvoiceStatus = 'pending' | 'paid' | 'overdue'
export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column() declare userId: string
  @column() declare customerId: string
  @column() declare title: string
  @column() declare invoiceNumber: string
  @column() declare currency: string
  @column() declare dueDate: Date
  @column() declare amount: number
  @column() declare status: InvoiceStatus

  @column() declare isRecurringInvoice: boolean
  @column() declare isRecurringStartDate: Date
  @column() declare isRecurringEndDate: Date
  @column() declare isRecurringFrequency: string

  @column() declare isDiscounted: boolean
  @column() declare isDiscountedAmount: number
  @column() declare isDiscountedPercentage: number

  @column() declare notes: string

  @hasMany(() => Service) declare properties: HasMany<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
