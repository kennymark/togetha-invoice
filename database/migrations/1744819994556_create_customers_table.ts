import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()

      table.string('full_name').notNullable()
      table.string('email').notNullable().unique()
      table.string('phone').notNullable()
      table.string('address').notNullable()
      table.string('post_code').notNullable()
      table.string('state').notNullable()
      table.string('city').notNullable()
      table.string('country').notNullable()
      table.string('business_name')
      table.string('business_address')
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.index('email')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
