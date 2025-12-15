import { Account, AccountSummary } from '../entities/account.entity';

export interface AccountRepository {
  getUserAccounts(userId: string): Promise<Account[]>;
  getAccountById(accountId: string): Promise<Account | null>;
  getAccountSummary(accountId: string): Promise<AccountSummary | null>;
  updateAccountBalance(accountId: string, amount: number): Promise<Account>;
}

