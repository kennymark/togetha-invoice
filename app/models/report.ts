import { afterCreate, BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { ModelObject } from '@adonisjs/lucid/types/model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import FileUpload from './file_upload.js'
import User from './user.js'

export default class Report extends BaseModel {
  @column({ isPrimary: true }) declare id: string

  @column() declare name: string
  @column() declare description: string
  @column() declare file: ModelObject | null
  @column() declare metadata: ModelObject
  @column() declare userId: string
  @belongsTo(() => User) declare uploader: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignName(report: Report) {
    if (!report.name) {
      report.name = report.file?.name || 'Untitled'
    }
  }

  @afterCreate()
  public static async recordFileUpload(report: Report) {
    await FileUpload.create(
      {
        name: report.name,
        size: report.file?.size,
        url: report.metadata?.url,
        fileExtension: report.file?.extname,
        uploaderId: report.userId,
      },
      { client: report.$trx },
    )
  }
}
