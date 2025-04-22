export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'main' | 'savings' | 'credit' | 'other';
} 