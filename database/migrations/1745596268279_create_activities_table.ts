import { BaseSchema } from '@adonisjs/lucid/schema'
const activityTypes = [
  'created',
  'deleted',
  'updated',
  'other',
  'accepted',
  'rejected',
  'renewed',
  'archived',
  'uploaded',
  'completed',
  'commented',
  'paid',
  'verified',
  'approved',
] as const

export type ActivityType = (typeof activityTypes)[number]

export default class extends BaseSchema {
  protected tableName = 'activities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()
      table.text('summary')
      table.enum('type', activityTypes).index()
      table.string('user_id').references('users.id').onDelete('CASCADE')
      table.string('job_id').references('id').inTable('jobs').onDelete('CASCADE')
      table.string('invoice_id').references('id').inTable('invoices').onDelete('CASCADE')
      table.string('customer_id').references('id').inTable('customers').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
