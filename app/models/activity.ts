import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Customer from './customer.js'
import Invoice from './invoice.js'
import Job from './job.js'

const activityTypes = [
  'created',
  'deleted',
  'updated',
  'other',
  'accepted',
  'rejected',
  'renewed',
  'archived',
  'uploaded',
  'completed',
  'commented',
  'paid',
  'verified',
  'approved',
] as const

export type ActivityType = (typeof activityTypes)[number]
export default class Activity extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column() declare summary: string
  @column() declare type: ActivityType
  @column() declare userId: string
  @column() declare jobId: string
  @column() declare invoiceId: string
  @column() declare customerId: string

  @belongsTo(() => Job) declare job: BelongsTo<typeof Job>
  @belongsTo(() => Invoice) declare invoice: BelongsTo<typeof Invoice>
  @belongsTo(() => Customer) declare customer: BelongsTo<typeof Customer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
