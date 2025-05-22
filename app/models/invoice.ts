import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Customer from './customer.js'
import Service from './service.js'
import User from './user.js'

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
  @column() declare isDiscountedType: string
  @column() declare isDiscountedValue: number

  @column() declare notes: string

  @belongsTo(() => Customer) declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => User) declare user: BelongsTo<typeof User>

  @hasMany(() => Service) declare properties: HasMany<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async beforeCreate(invoice: Invoice) {
    invoice.status = 'pending'
  }
}
