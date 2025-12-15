import { Component, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { MockTransactionRepository } from '../../../infrastructure/repositories/mock-transaction.repository';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { TransactionListComponent } from '../../shared/organisms/transaction-list/transaction-list.component';
import { SearchBarComponent } from '../../shared/molecules/search-bar/search-bar.component';
import { CardComponent } from '../../shared/molecules/card/card.component';
import { SpinnerComponent } from '../../shared/atoms/spinner/spinner.component';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule,
    TransactionListComponent,
    SearchBarComponent,
    CardComponent,
    SpinnerComponent
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {
  private readonly transactionRepo = inject(MockTransactionRepository);
  private readonly authState = inject(AuthStateService);

  protected readonly allTransactions = signal<Transaction[]>([]);
  protected readonly filteredTransactions = signal<Transaction[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly searchTerm = signal<string>('');

  constructor() {
    effect(() => {
      const user = this.authState.currentUser();
      if (user) {
        this.loadTransactions(user.id);
      }
    });

    effect(() => {
      this.filterTransactions();
    });
  }

  private async loadTransactions(userId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const transactions = await this.transactionRepo.getUserTransactions(userId);
      this.allTransactions.set(transactions);
      this.filteredTransactions.set(transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  private filterTransactions(): void {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      this.filteredTransactions.set(this.allTransactions());
      return;
    }

    const filtered = this.allTransactions().filter(txn =>
      txn.description.toLowerCase().includes(term) ||
      txn.type.toLowerCase().includes(term) ||
      txn.recipientAccountNumber?.toLowerCase().includes(term) ||
      txn.reference?.toLowerCase().includes(term)
    );
    this.filteredTransactions.set(filtered);
  }
}

