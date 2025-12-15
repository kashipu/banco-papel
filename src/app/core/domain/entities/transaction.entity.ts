export type TransactionType = 'transfer' | 'payment' | 'deposit' | 'withdrawal' | 'fee';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  status: TransactionStatus;
  recipientAccountNumber?: string;
  recipientName?: string;
  reference?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  description: string;
  currency?: string;
}

export interface PaymentRequest {
  accountId: string;
  serviceProvider: string;
  serviceId: string;
  amount: number;
  description: string;
}

