import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()
      table.string('full_name').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('secondary_email', 255).nullable()
      table.string('password').notNullable()
      table.boolean('is_2fa_enabled').defaultTo(false)
      table.string('contact_number').nullable()
      table.jsonb('metadata')
      table
        .enum('status', ['pending', 'active', 'suspended', 'deleted'])
        .defaultTo('pending')
        .index()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
