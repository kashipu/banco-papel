import { Component, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Account } from '../../../domain/entities/account.entity';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { MockAccountRepository } from '../../../infrastructure/repositories/mock-account.repository';
import { MockTransactionRepository } from '../../../infrastructure/repositories/mock-transaction.repository';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { AccountCardComponent } from '../../shared/organisms/account-card/account-card.component';
import { TransactionListComponent } from '../../shared/organisms/transaction-list/transaction-list.component';
import { CardComponent } from '../../shared/molecules/card/card.component';
import { ButtonComponent } from '../../shared/atoms/button/button.component';
import { SpinnerComponent } from '../../shared/atoms/spinner/spinner.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    AccountCardComponent,
    TransactionListComponent,
    CardComponent,
    ButtonComponent,
    SpinnerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly accountRepo = inject(MockAccountRepository);
  private readonly transactionRepo = inject(MockTransactionRepository);
  private readonly authState = inject(AuthStateService);

  protected readonly accounts = signal<Account[]>([]);
  protected readonly transactions = signal<Transaction[]>([]);
  protected readonly isLoading = signal<boolean>(true);

  constructor() {
    effect(() => {
      const user = this.authState.currentUser();
      if (user) {
        this.loadData(user.id);
      }
    });
  }

  private async loadData(userId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const [accounts, transactions] = await Promise.all([
        this.accountRepo.getUserAccounts(userId),
        this.transactionRepo.getUserTransactions(userId, 5)
      ]);
      this.accounts.set(accounts);
      this.transactions.set(transactions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected get totalBalance(): number {
    return this.accounts().reduce((sum, acc) => sum + acc.balance, 0);
  }
}

