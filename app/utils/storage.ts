import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Balance } from '../types/transaction';
import { Account } from '../types/account';

const TRANSACTIONS_KEY = '@transactions';
const BALANCE_KEY = '@balance';
const ACCOUNTS_KEY = '@accounts';

// Initialize main account if none exists
const initializeMainAccount = async () => {
  const accounts = await AsyncStorage.getItem(ACCOUNTS_KEY);
  if (!accounts) {
    const mainAccount: Account = {
      id: 'main',
      name: 'Main Account',
      balance: 0,
      type: 'main'
    };
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify([mainAccount]));
    return mainAccount;
  }
  return JSON.parse(accounts)[0];
};

export const StorageUtils = {
  // Account methods
  async getAccounts(): Promise<Account[]> {
    try {
      const accounts = await AsyncStorage.getItem(ACCOUNTS_KEY);
      if (!accounts) {
        const mainAccount = await initializeMainAccount();
        return [mainAccount];
      }
      return JSON.parse(accounts);
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  },

  async addAccount(account: Account): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      accounts.push(account);
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  },

  async deleteAccount(accountId: string): Promise<void> {
    try {
      // Get all accounts
      const accounts = await this.getAccounts();
      const filteredAccounts = accounts.filter(account => account.id !== accountId);
      
      // Get all transactions
      const transactions = await this.getTransactions();
      const filteredTransactions = transactions.filter(
        transaction => transaction.accountId !== accountId
      );

      // Update storage
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filteredAccounts));
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filteredTransactions));

      // Recalculate total balance
      const total = filteredTransactions.reduce((sum, transaction) => {
        return sum + (transaction.type === 'Income' ? transaction.amount : -transaction.amount);
      }, 0);
      await this.updateBalance(total);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  async updateAccountBalance(accountId: string, amount: number): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const updatedAccounts = accounts.map(account => {
        if (account.id === accountId) {
          return { ...account, balance: account.balance + amount };
        }
        return account;
      });
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
    } catch (error) {
      console.error('Error updating account balance:', error);
      throw error;
    }
  },

  // Transaction methods
  async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      transactions.push(transaction);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

      // Update account balance
      const amount = transaction.type === 'Income' ? transaction.amount : -transaction.amount;
      await this.updateAccountBalance(transaction.accountId, amount);

      // Update total balance
      const total = transactions.reduce((sum, t) => {
        return sum + (t.type === 'Income' ? t.amount : -t.amount);
      }, 0);
      await this.updateBalance(total);
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  },

  async getTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      return transactions ? JSON.parse(transactions) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },

  async getRecentTransactions(limit?: number): Promise<Transaction[]> {
    try {
      const transactions = await this.getTransactions();
      const sorted = transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return limit ? sorted.slice(0, limit) : sorted;
    } catch (error) {
      console.error('Error getting recent transactions:', error);
      return [];
    }
  },

  // Balance methods
  async getBalance(): Promise<Balance> {
    try {
      const balance = await AsyncStorage.getItem(BALANCE_KEY);
      return balance ? JSON.parse(balance) : { total: 0, lastUpdated: new Date().toISOString() };
    } catch (error) {
      console.error('Error getting balance:', error);
      return { total: 0, lastUpdated: new Date().toISOString() };
    }
  },

  async updateBalance(newTotal: number): Promise<void> {
    try {
      const newBalance: Balance = {
        total: newTotal,
        lastUpdated: new Date().toISOString(),
      };
      await AsyncStorage.setItem(BALANCE_KEY, JSON.stringify(newBalance));
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  },
}; 