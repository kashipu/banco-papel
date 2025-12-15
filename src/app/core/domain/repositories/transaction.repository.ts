import { Transaction, TransferRequest, PaymentRequest } from '../entities/transaction.entity';

export interface TransactionRepository {
  getAccountTransactions(accountId: string, limit?: number): Promise<Transaction[]>;
  getTransactionById(transactionId: string): Promise<Transaction | null>;
  createTransfer(request: TransferRequest): Promise<Transaction>;
  createPayment(request: PaymentRequest): Promise<Transaction>;
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;
}

