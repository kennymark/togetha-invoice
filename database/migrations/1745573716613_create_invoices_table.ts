import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()
      table.string('customer_id').notNullable()
      table.string('title').notNullable()
      table.string('invoice_number').notNullable()
      table.string('currency').notNullable()
      table.date('due_date').notNullable()
      table.float('amount').notNullable()
      table.string('status').notNullable()
      table.boolean('is_recurring_invoice').notNullable()
      table.date('is_recurring_start_date').notNullable()
      table.date('is_recurring_end_date').notNullable()
      table.string('is_recurring_frequency').notNullable()
      table.boolean('is_discounted').notNullable()
      table.float('is_discounted_amount').notNullable()
      table.float('is_discounted_percentage').notNullable()
      table.string('notes').notNullable()
      table.string('services').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
