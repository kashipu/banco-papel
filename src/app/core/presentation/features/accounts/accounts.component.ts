import { Component, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../../domain/entities/account.entity';
import { MockAccountRepository } from '../../../infrastructure/repositories/mock-account.repository';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { AccountCardComponent } from '../../shared/organisms/account-card/account-card.component';
import { SpinnerComponent } from '../../shared/atoms/spinner/spinner.component';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, AccountCardComponent, SpinnerComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent {
  private readonly accountRepo = inject(MockAccountRepository);
  private readonly authState = inject(AuthStateService);

  protected readonly accounts = signal<Account[]>([]);
  protected readonly isLoading = signal<boolean>(true);

  constructor() {
    effect(() => {
      const user = this.authState.currentUser();
      if (user) {
        this.loadAccounts(user.id);
      }
    });
  }

  private async loadAccounts(userId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const accounts = await this.accountRepo.getUserAccounts(userId);
      this.accounts.set(accounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}

