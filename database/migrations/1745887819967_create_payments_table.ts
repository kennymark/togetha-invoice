import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()
      table.text('title').notNullable()
      table.text('description').notNullable()
      table.float('amount').notNullable()
      table.string('currency_code').notNullable()
      table.string('customer_id').references('id').inTable('customers')
      table
        .enum('status', [
          [
            'paid',
            'processing',
            'overpaid',
            'underpaid',
            'unpaid',
            'pending',
            'failed',
            'refunded',
          ],
        ])
        .index()
        .notNullable()
      table.string('payment_provider').notNullable()
      table.string('payment_method').notNullable()
      table.string('payment_url').notNullable()
      table.timestamp('payment_date', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
