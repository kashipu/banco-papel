import { Component, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from '../../../domain/entities/account.entity';
import { MockAccountRepository } from '../../../infrastructure/repositories/mock-account.repository';
import { MockTransactionRepository } from '../../../infrastructure/repositories/mock-transaction.repository';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { InputComponent } from '../../shared/atoms/input/input.component';
import { LabelComponent } from '../../shared/atoms/label/label.component';
import { ButtonComponent } from '../../shared/atoms/button/button.component';
import { CardComponent } from '../../shared/molecules/card/card.component';
import { SpinnerComponent } from '../../shared/atoms/spinner/spinner.component';

interface ServiceProvider {
  id: string;
  name: string;
}

@Component({
  selector: 'app-payments',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    LabelComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly accountRepo = inject(MockAccountRepository);
  private readonly transactionRepo = inject(MockTransactionRepository);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly accounts = signal<Account[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<boolean>(false);

  protected readonly serviceProviders: ServiceProvider[] = [
    { id: 'electricity', name: 'Servicio de Electricidad' },
    { id: 'water', name: 'Servicio de Agua' },
    { id: 'internet', name: 'Servicio de Internet' },
    { id: 'phone', name: 'Servicio de Teléfono' }
  ];

  protected readonly paymentForm = this.fb.group({
    accountId: ['', Validators.required],
    serviceProvider: ['', Validators.required],
    serviceId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const user = this.authState.currentUser();
      if (user) {
        this.loadAccounts(user.id);
      }
    });
  }

  private async loadAccounts(userId: string): Promise<void> {
    try {
      const accounts = await this.accountRepo.getUserAccounts(userId);
      this.accounts.set(accounts);
      if (accounts.length > 0) {
        this.paymentForm.patchValue({ accountId: accounts[0].id });
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  }

  protected async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      const formValue = this.paymentForm.value;
      const account = this.accounts().find(acc => acc.id === formValue.accountId);

      if (!account) {
        throw new Error('Cuenta no encontrada');
      }

      if (account.balance < (formValue.amount || 0)) {
        throw new Error('Saldo insuficiente');
      }

      await this.transactionRepo.createPayment({
        accountId: formValue.accountId!,
        serviceProvider: formValue.serviceProvider!,
        serviceId: formValue.serviceId!,
        amount: formValue.amount!,
        description: formValue.description || 'Pago de servicio'
      });

      // Update account balance
      await this.accountRepo.updateAccountBalance(account.id, -(formValue.amount || 0));

      this.success.set(true);
      this.paymentForm.reset();
      if (this.accounts().length > 0) {
        this.paymentForm.patchValue({ accountId: this.accounts()[0].id });
      }

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error al realizar el pago');
    } finally {
      this.isLoading.set(false);
    }
  }
}

