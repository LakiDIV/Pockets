export interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  amount: number;
  description: string;
  date: string;
  accountId: string;
  category?: string;
}

export interface Balance {
  total: number;
  lastUpdated: string;
} 