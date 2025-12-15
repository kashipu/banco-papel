export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  createdAt: Date;
}

export interface AccountSummary {
  account: Account;
  lastTransactionDate?: Date;
  monthlyIncome: number;
  monthlyExpenses: number;
}

