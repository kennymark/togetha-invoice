import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.decimal('unit_price', 10, 2).notNullable()
      table.integer('quantity').notNullable()
      table.decimal('total_price', 10, 2).notNullable()
      table.string('invoice_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
