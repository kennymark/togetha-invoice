import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

const searchObjects: { [key: string]: string[] } = {
  customers: ['full_name', 'email', 'phone'],
  jobs: ['title', 'description', 'category', 'status', 'priority'],
  invoices: ['title', 'status', 'notes'],
  payments: ['title', 'description', 'status'],
  activities: ['summary'],
}

export default class TextSearch extends BaseCommand {
  @args.string({ description: 'Name of the table' })
  declare tableName: string

  static commandName = 'text:search'
  static description = 'A command to create a text search index'

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  }

  async run() {
    try {
      const columns = searchObjects[this.tableName]

      if (!columns) {
        throw new Error(`Table name ${this.tableName} is not defined in searchObjects`)
      }

      const vectorName = `${this.tableName}_search`
      const indexName = `${this.tableName}_search_idx`
      const triggerName = `${this.tableName}_vector_update`

      const dropTrigger = `DROP TRIGGER IF EXISTS ${triggerName} ON ${this.tableName};`
      const dropColumn = `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS ${vectorName};`

      const createColumnSQL = `
    ALTER TABLE ${this.tableName} ADD COLUMN ${vectorName} tsvector;
  `

      const createIndexSQL = `
    CREATE INDEX ${indexName} ON ${this.tableName} USING gin(${vectorName});
  `

      const createTriggerSQL = `
    CREATE TRIGGER ${triggerName}
    BEFORE INSERT OR UPDATE ON ${this.tableName}
    FOR EACH ROW EXECUTE FUNCTION
    tsvector_update_trigger(${vectorName}, 'pg_catalog.english', ${columns
      .map((col) => `"${col}"`)
      .join(', ')});
  `

      const populateVectorSQL = `
    UPDATE ${this.tableName}
    SET ${vectorName} = to_tsvector('english', ${columns
      .map((col) => `coalesce("${col}", '')`)
      .join(" || ' ' || ")});
  `

      await db.rawQuery(dropTrigger)
      await db.rawQuery(dropColumn)
      await db.rawQuery(createColumnSQL)
      await db.rawQuery(createIndexSQL)
      await db.rawQuery(createTriggerSQL)
      await db.rawQuery(populateVectorSQL)

      this.logger.info(
        'Search vector column, index, trigger, and population completed successfully',
      )
      this.logger.info(createColumnSQL + createIndexSQL + createTriggerSQL + populateVectorSQL)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
