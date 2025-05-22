import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('services')
      table.dropColumn('is_discounted_amount')
      table.dropColumn('is_discounted_percentage')
      table.string('is_discounted_type').notNullable()
      table.decimal('is_discounted_value').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('services').notNullable()
      table.decimal('is_discounted_amount').notNullable()
      table.decimal('is_discounted_percentage').notNullable()
      table.dropColumn('is_discounted_type')
      table.dropColumn('is_discounted_value')
    })
  }
}
