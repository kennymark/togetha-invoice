import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Customer from './customer.js'
import User from './user.js'

export type JobStatus = 'pending' | 'completed' | 'cancelled'
export type JobPriority = 'low' | 'medium' | 'high'

export default class Job extends BaseModel {
  @column({ isPrimary: true }) declare id: string

  @column() declare userId: string

  @column() declare customerId: string

  @column() declare title: string

  @column() declare description: string

  @column() declare category: string

  @column() declare status: JobStatus

  @column() declare priority: JobPriority

  @column() declare dueDate: Date

  @belongsTo(() => Customer) declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => User) declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
