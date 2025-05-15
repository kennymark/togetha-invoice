import { convertBytesToMb } from '#utils/function'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Document from './document.js'
import User from './user.js'

export default class FileUpload extends BaseModel {
  @column({ isPrimary: true }) declare id: string

  @column() declare documentId: string

  @column() declare name: string

  @column() declare size: number

  @column() declare mimeType: string

  @column() declare url: string

  @column() declare fileExtension: string

  @column() declare uploaderId: string

  @belongsTo(() => User, { foreignKey: 'uploaderId' })
  declare uploader: BelongsTo<typeof User>

  @belongsTo(() => Document) declare document: BelongsTo<typeof Document>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave() static async sizeInMb(file: FileUpload) {
    if (file.$dirty.password) {
      file.size = Number(convertBytesToMb(file.size))
    }
  }
}
