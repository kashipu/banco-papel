import { Injectable } from '@angular/core';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { Account, AccountSummary } from '../../domain/entities/account.entity';

@Injectable({
  providedIn: 'root'
})
export class MockAccountRepository implements AccountRepository {
  private readonly mockAccounts: Account[] = [
    {
      id: 'acc-1',
      userId: '1',
      accountNumber: '1234567890',
      accountType: 'checking',
      balance: 50000.0,
      currency: 'USD',
      status: 'active',
      createdAt: new Date('2020-01-01')
    },
    {
      id: 'acc-2',
      userId: '1',
      accountNumber: '0987654321',
      accountType: 'savings',
      balance: 150000.0,
      currency: 'USD',
      status: 'active',
      createdAt: new Date('2020-01-15')
    }
  ];

  async getUserAccounts(userId: string): Promise<Account[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockAccounts.filter(acc => acc.userId === userId);
  }

  async getAccountById(accountId: string): Promise<Account | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockAccounts.find(acc => acc.id === accountId) || null;
  }

  async getAccountSummary(accountId: string): Promise<AccountSummary | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const account = await this.getAccountById(accountId);
    if (!account) {
      return null;
    }

    return {
      account,
      lastTransactionDate: new Date('2024-01-15'),
      monthlyIncome: 5000.0,
      monthlyExpenses: 2500.0
    };
  }

  async updateAccountBalance(accountId: string, amount: number): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const account = this.mockAccounts.find(acc => acc.id === accountId);
    if (!account) {
      throw new Error('Cuenta no encontrada');
    }

    account.balance += amount;
    return { ...account };
  }
}

