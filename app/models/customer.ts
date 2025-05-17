import { afterDelete, afterSave, BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Invoice from './invoice.js'
import Job from './job.js'
import User from './user.js'
import meiliSearchClient from '#services/meilisearch_service'

export default class Customer extends BaseModel {
  @column({ isPrimary: true }) declare id: string

  @column() declare userId: string

  @column() declare fullName: string

  @column() declare email: string

  @column() declare phone: string

  @column() declare address: string

  @column() declare postCode: string

  @column() declare state: string

  @column() declare city: string

  @column() declare country: string

  @column() declare businessName: string

  @column() declare businessAddress: string

  @belongsTo(() => User) declare user: BelongsTo<typeof User>

  @hasMany(() => Job) declare jobs: HasMany<typeof Job>

  @hasMany(() => Invoice) declare invoices: HasMany<typeof Invoice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterSave()
  public static async updateSearchIndex(customer: Customer) {
    meiliSearchClient
      .index('customers')
      .updateDocuments([
        {
          id: customer.id,
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          postCode: customer.postCode,
          state: customer.state,
          city: customer.city,
          country: customer.country,
          businessName: customer.businessName,
          businessAddress: customer.businessAddress,
          userId: customer.userId,
        },
      ])
      .catch(console.log)
  }

  @afterDelete()
  public static async deleteFromSearchIndex(customer: Customer) {
    meiliSearchClient.index('customers').deleteDocument(customer.id).catch(console.log)
  }
}
