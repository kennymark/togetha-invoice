import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { attachment } from '@jrmc/adonis-attachment'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import type { DateTime } from 'luxon'
import Customer from './customer.js'
import Job from './job.js'
import User from './user.js'

export default class Document extends BaseModel {
  @column({ isPrimary: true }) declare id: string

  @attachment({
    folder: 'documents',
  })
  declare file: Attachment

  @column() declare altName: string

  @column() declare userId: string

  @column() declare customerId: string

  @column() declare jobId: string

  @belongsTo(() => User) declare user: BelongsTo<typeof User>

  @belongsTo(() => Customer) declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => Job) declare job: BelongsTo<typeof Job>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
