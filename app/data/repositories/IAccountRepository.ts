import Account from "../models/Account";
import { Observable } from 'rxjs';

// Define the structure for creating or updating an account
// We can omit the id and timestamps as they are handled by the DB
export interface AccountData {
  name: string;
  balance: number;
  type: 'main' | 'savings' | 'credit' | 'other';
}

// Interface defining the contract for account data operations
export interface IAccountRepository {
  // Observe all accounts - returns an Observable that emits the full list whenever it changes
  observeAccounts(): Observable<Account[]>;

  // Observe a single account by ID
  observeAccount(accountId: string): Observable<Account | null>;

  // Get a snapshot of all accounts (less reactive than observeAccounts)
  getAccounts(): Promise<Account[]>;

  // Get a single account by ID
  getAccountById(accountId: string): Promise<Account | null>;

  // Create a new account
  createAccount(data: AccountData): Promise<Account>;

  // Update an existing account
  updateAccount(accountId: string, data: Partial<AccountData>): Promise<void>;

  // Delete an account
  deleteAccount(accountId: string): Promise<void>;

  // Maybe add specific query methods if needed later, e.g.:
  // findAccountsByType(type: string): Promise<Account[]>;
} 