import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()
      table.json('file').notNullable()
      table.string('alt_name').nullable()
      table.string('user_id').references('users.id').onDelete('CASCADE').notNullable()
      table.string('customer_id').references('customers.id').onDelete('CASCADE').notNullable()
      table.string('job_id').references('jobs.id').onDelete('CASCADE').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
