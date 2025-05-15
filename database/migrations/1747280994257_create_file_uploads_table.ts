import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'file_uploads'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(this.raw('nanoid()')).primary().unique()

      table.text('url').notNullable().unique()
      table.string('name').notNullable()
      table.string('file_extension')

      // expressed in mb
      table.float('size').notNullable()
      table.string('uploader_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('document_id').references('id').inTable('documents').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
