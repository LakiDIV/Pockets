import { appSchema } from '@nozbe/watermelondb'
import { tableSchema } from '@nozbe/watermelondb/Schema'

// Define the application's database schema.
// Increment the version number when making changes to the schema that require migration.
export const myAppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [
        // Columns from Account model
        { name: 'name', type: 'string' },
        { name: 'balance', type: 'number' },
        { name: 'type', type: 'string' },

        // WatermelonDB recommended timestamp columns
        { name: 'created_at', type: 'number' },
        { name: 'last_modified', type: 'number' },
      ]
    }),
    // tableSchema({
    //   name: 'transactions', // Example future table
    //   columns: [
    //     { name: 'description', type: 'string' },
    //     { name: 'amount', type: 'number' },
    //     { name: 'date', type: 'number' }, // Store dates as numbers (Unix timestamps)
    //     { name: 'account_id', type: 'string', isIndexed: true }, // Link to accounts table
    //     { name: 'category', type: 'string', isOptional: true },
    //     { name: 'created_at', type: 'number' },
    //     { name: 'last_modified', type: 'number' }, // Consistency with accounts table
    //   ]
    // })
  ]
}) 