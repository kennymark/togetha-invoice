import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'jobs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.string('customer_id').notNullable()
      table.string('category').notNullable()
      table.string('status').notNullable()
      table.string('priority').notNullable()
      table.dateTime('due_date').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
