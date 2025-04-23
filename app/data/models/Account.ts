import { Model } from '@nozbe/watermelondb'
import { field, text, writer, date } from '@nozbe/watermelondb/decorators'

export default class Account extends Model {
  // Define the table name associated with this model
  static table = 'accounts'

  // Define model fields corresponding to schema columns
  // Use decorators that match the column type in schema.ts
  @text('name') name!: string
  @field('balance') balance!: number
  @text('type') type!: 'main' | 'savings' | 'credit' | 'other'

  // WatermelonDB automatically handles timestamps if columns are named
  // 'created_at' and 'last_modified' (or 'updated_at') and are type 'number'
  @date('created_at') createdAt!: Date
  @date('last_modified') updatedAt!: Date

  // --- Actions (Example) ---

  // Example action to update the account balance
  @writer async updateBalance(newBalance: number) {
    await this.update(account => {
      account.balance = newBalance
    })
  }

  // Example action to update account details
  @writer async updateDetails(details: { name?: string, type?: 'main' | 'savings' | 'credit' | 'other' }) {
    await this.update(account => {
      if (details.name !== undefined) {
        account.name = details.name;
      }
      if (details.type !== undefined) {
        account.type = details.type;
      }
    })
  }

  // Define other actions like adding transactions, deleting accounts, etc. here
} 