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

  static async generateSummary(
    type: ActivityType,
    entity: { id: string; name?: string; title?: string; fullName?: string },
  ) {
    const entityName = entity.name || entity.title || entity.fullName || 'Unknown'
    const entityType = entity.fullName
      ? 'Customer'
      : entity.title
        ? 'Job'
        : entity.name
          ? 'Invoice'
          : 'Unknown'

    const summaries: Record<ActivityType, string> = {
      created: `${entityType} "${entityName}" has been created`,
      deleted: `${entityType} "${entityName}" has been deleted`,
      updated: `${entityType} "${entityName}" has been updated`,
      other: `${entityType} "${entityName}" has been modified`,
      accepted: `${entityType} "${entityName}" has been accepted`,
      rejected: `${entityType} "${entityName}" has been rejected`,
      renewed: `${entityType} "${entityName}" has been renewed`,
      archived: `${entityType} "${entityName}" has been archived`,
      uploaded: `${entityType} "${entityName}" has been uploaded`,
      completed: `${entityType} "${entityName}" has been completed`,
      commented: `A comment has been added to ${entityType} "${entityName}"`,
      paid: `${entityType} "${entityName}" has been marked as paid`,
      verified: `${entityType} "${entityName}" has been verified`,
      approved: `${entityType} "${entityName}" has been approved`,
    }

    return summaries[type]
  }
}
