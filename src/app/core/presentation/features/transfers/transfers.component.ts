import { Component, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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

@Component({
  selector: 'app-transfers',
  imports: [
    CommonModule,
    CurrencyPipe,
    ReactiveFormsModule,
    InputComponent,
    LabelComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent
  ],
  templateUrl: './transfers.component.html',
  styleUrl: './transfers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransfersComponent {
  private readonly fb = inject(FormBuilder);
  private readonly accountRepo = inject(MockAccountRepository);
  private readonly transactionRepo = inject(MockTransactionRepository);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly accounts = signal<Account[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<boolean>(false);

  protected readonly transferForm = this.fb.group({
    fromAccountId: ['', Validators.required],
    toAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
        this.transferForm.patchValue({ fromAccountId: accounts[0].id });
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  }

  protected async onSubmit(): Promise<void> {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      const formValue = this.transferForm.value;
      const fromAccount = this.accounts().find(acc => acc.id === formValue.fromAccountId);

      if (!fromAccount) {
        throw new Error('Cuenta de origen no encontrada');
      }

      if (fromAccount.balance < (formValue.amount || 0)) {
        throw new Error('Saldo insuficiente');
      }

      await this.transactionRepo.createTransfer({
        fromAccountId: formValue.fromAccountId!,
        toAccountNumber: formValue.toAccountNumber!,
        amount: formValue.amount!,
        description: formValue.description || 'Transferencia',
        currency: fromAccount.currency
      });

      // Update account balance
      await this.accountRepo.updateAccountBalance(fromAccount.id, -(formValue.amount || 0));

      this.success.set(true);
      this.transferForm.reset();
      if (this.accounts().length > 0) {
        this.transferForm.patchValue({ fromAccountId: this.accounts()[0].id });
      }

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error al realizar la transferencia');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected get fromAccountError(): string | null {
    const control = this.transferForm.get('fromAccountId');
    return control?.touched && control?.errors?.['required'] ? 'Selecciona una cuenta' : null;
  }

  protected get toAccountError(): string | null {
    const control = this.transferForm.get('toAccountNumber');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'El número de cuenta es requerido';
      }
      if (control.errors['pattern']) {
        return 'El número de cuenta debe tener 10 dígitos';
      }
    }
    return null;
  }

  protected get amountError(): string | null {
    const control = this.transferForm.get('amount');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'El monto es requerido';
      }
      if (control.errors['min']) {
        return 'El monto debe ser mayor a 0';
      }
    }
    return null;
  }

  protected get descriptionError(): string | null {
    const control = this.transferForm.get('description');
    return control?.touched && control?.errors?.['required'] ? 'La descripción es requerida' : null;
  }
}

