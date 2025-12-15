import { Injectable } from '@angular/core';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import {
  Transaction,
  TransferRequest,
  PaymentRequest,
  TransactionType,
  TransactionStatus
} from '../../domain/entities/transaction.entity';

@Injectable({
  providedIn: 'root'
})
export class MockTransactionRepository implements TransactionRepository {
  private mockTransactions: Transaction[] = [
    {
      id: 'txn-1',
      accountId: 'acc-1',
      type: 'transfer',
      amount: -500.0,
      currency: 'USD',
      description: 'Transferencia a cuenta 9876543210',
      status: 'completed',
      recipientAccountNumber: '9876543210',
      recipientName: 'María García',
      createdAt: new Date('2024-01-15T10:30:00'),
      completedAt: new Date('2024-01-15T10:30:05')
    },
    {
      id: 'txn-2',
      accountId: 'acc-1',
      type: 'payment',
      amount: -120.0,
      currency: 'USD',
      description: 'Pago de servicios - Electricidad',
      status: 'completed',
      reference: 'PAY-2024-001',
      createdAt: new Date('2024-01-14T14:20:00'),
      completedAt: new Date('2024-01-14T14:20:03')
    },
    {
      id: 'txn-3',
      accountId: 'acc-1',
      type: 'deposit',
      amount: 2000.0,
      currency: 'USD',
      description: 'Depósito en efectivo',
      status: 'completed',
      createdAt: new Date('2024-01-13T09:15:00'),
      completedAt: new Date('2024-01-13T09:15:02')
    },
    {
      id: 'txn-4',
      accountId: 'acc-2',
      type: 'transfer',
      amount: -1000.0,
      currency: 'USD',
      description: 'Transferencia a cuenta 1111111111',
      status: 'completed',
      recipientAccountNumber: '1111111111',
      recipientName: 'Carlos López',
      createdAt: new Date('2024-01-12T16:45:00'),
      completedAt: new Date('2024-01-12T16:45:04')
    }
  ];

  async getAccountTransactions(accountId: string, limit?: number): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    let transactions = this.mockTransactions.filter(txn => txn.accountId === accountId);
    transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return limit ? transactions.slice(0, limit) : transactions;
  }

  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockTransactions.find(txn => txn.id === transactionId) || null;
  }

  async createTransfer(request: TransferRequest): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      accountId: request.fromAccountId,
      type: 'transfer',
      amount: -request.amount,
      currency: request.currency || 'USD',
      description: request.description,
      status: 'completed',
      recipientAccountNumber: request.toAccountNumber,
      createdAt: new Date(),
      completedAt: new Date()
    };

    this.mockTransactions.unshift(transaction);
    return transaction;
  }

  async createPayment(request: PaymentRequest): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      accountId: request.accountId,
      type: 'payment',
      amount: -request.amount,
      currency: 'USD',
      description: `${request.serviceProvider} - ${request.description}`,
      status: 'completed',
      reference: `PAY-${Date.now()}`,
      createdAt: new Date(),
      completedAt: new Date()
    };

    this.mockTransactions.unshift(transaction);
    return transaction;
  }

  async getUserTransactions(userId: string, limit?: number): Promise<Transaction[]> {
    // En un caso real, esto buscaría todas las transacciones de todas las cuentas del usuario
    // Por ahora, simulamos obteniendo todas las transacciones
    await new Promise(resolve => setTimeout(resolve, 300));
    let transactions = [...this.mockTransactions];
    transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return limit ? transactions.slice(0, limit) : transactions;
  }
}

