import { Platform } from 'react-native'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { myAppSchema } from './models/schema'
import Account from './models/Account'
// Import other models here as they are created
// import Transaction from './models/Transaction'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema: myAppSchema,
  // (You might want to comment out migrations for initial development,
  // unless you're adding columns/tables immediately)
  // migrations,
  // dbName: 'MyAppDatabase', // optional database name or file system path
  // Pass this option to improve performance if you have your database write to the disk frequently:
  jsi: Platform.OS === 'ios' || Platform.OS === 'android', // Enable JSI on mobile platforms for performance
  // Optional: disable JSI on Android (supported starting WatermelonDB 0.24.0)
  // jsi: Platform.OS === 'ios',
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
    console.error("Database setup error:", error);
    // Add crash reporting here if desired
  }
})

// Then, make a Database object
export const database = new Database({
  adapter,
  modelClasses: [
    Account,
    // Add other models here:
    // Transaction,
  ],
}) 