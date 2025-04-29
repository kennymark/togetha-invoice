import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the unique rule
 */
export type DbOptions = {
  table: string
  column: string
  connection?: string
}

// ensure the value exists in the database
async function exists(value: unknown, options: DbOptions, field: FieldContext) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }

  const row = await db
    .connection(options.connection)
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (!row) {
    field.report('The {{ field }} field does not exist', 'exist', field)
  }
}

/**
 * Implementation
 */
async function unique(value: unknown, options: DbOptions, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }

  const row = await db
    .connection(options.connection)
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (row) {
    field.report('The {{ field }} field is not unique', 'unique', field)
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const uniqueRule = vine.createRule(unique)
export const existsRule = vine.createRule(exists)
