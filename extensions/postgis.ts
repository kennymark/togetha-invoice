import { Database } from '@adonisjs/lucid/database'
import knexPostgis, { type KnexPostgis } from 'knex-postgis'

declare module '@adonisjs/lucid/database' {
  interface Database {
    st(): KnexPostgis
  }
}

Database.macro('st', function (this: Database, connectionName?: string) {
  connectionName = connectionName || this.primaryConnectionName
  this.manager.connect(connectionName)

  const connection = this.getRawConnection(connectionName)!.connection!

  /**
   * Ensure we are dealing with a PostgreSQL connection
   */
  if (connection.dialectName !== 'postgres') {
    throw new Error('The "st" function can only be used with PostgreSQL')
  }

  /**
   * Configure extension if not already configured
   */
  // @ts-ignore
  if (!connection.client!['postgis']) {
    knexPostgis(connection.client!)
    if (connection.hasReadWriteReplicas) {
      knexPostgis(connection.readClient!)
    }
  }

  // @ts-ignore
  return connection.client!['postgis']
})
