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
  'passwordUpdated',
] as const

export type ActivityType = (typeof activityTypes)[number]

export type EntityType = 'customer' | 'job' | 'invoice' | 'user'

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
    activityType: ActivityType,
    entity: { id: string; name?: string; title?: string; fullName?: string },
    entityType: EntityType,
  ) {
    const entityName = entity.name || entity.title || entity.fullName || 'Unknown'

    // Check if this is a user activity first
    if (entityType === 'user') {
      if (activityType === 'passwordUpdated') {
        return 'You updated your password'
      }
      if (activityType === 'updated') {
        return 'You updated your account details'
      }
    }

    const entityTypeDisplay = entityType.charAt(0).toUpperCase() + entityType.slice(1)

    const summaries: Record<ActivityType, string> = {
      created: `${entityTypeDisplay} "${entityName}" has been created`,
      deleted: `${entityTypeDisplay} "${entityName}" has been deleted`,
      updated: `${entityTypeDisplay} "${entityName}" has been updated`,
      passwordUpdated: `Password for ${entityTypeDisplay} "${entityName}" has been updated`,
      other: `${entityTypeDisplay} "${entityName}" has been modified`,
      accepted: `${entityTypeDisplay} "${entityName}" has been accepted`,
      rejected: `${entityTypeDisplay} "${entityName}" has been rejected`,
      renewed: `${entityTypeDisplay} "${entityName}" has been renewed`,
      archived: `${entityTypeDisplay} "${entityName}" has been archived`,
      uploaded: `${entityTypeDisplay} "${entityName}" has been uploaded`,
      completed: `${entityTypeDisplay} "${entityName}" has been completed`,
      commented: `A comment has been added to ${entityTypeDisplay} "${entityName}"`,
      paid: `${entityTypeDisplay} "${entityName}" has been marked as paid`,
      verified: `${entityTypeDisplay} "${entityName}" has been verified`,
      approved: `${entityTypeDisplay} "${entityName}" has been approved`,
    }

    return summaries[activityType]
  }
}
