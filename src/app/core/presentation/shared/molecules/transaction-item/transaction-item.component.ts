import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { BadgeComponent } from '../../atoms/badge/badge.component';

@Component({
  selector: 'app-transaction-item',
  imports: [CommonModule, DatePipe, CurrencyPipe, BadgeComponent],
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionItemComponent {
  transaction = input.required<Transaction>();

  protected get amountClass(): string {
    const amount = this.transaction().amount;
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  }

  protected get statusVariant(): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    const status = this.transaction().status;
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'neutral';
      default:
        return 'neutral';
    }
  }

  protected get typeLabel(): string {
    const type = this.transaction().type;
    const labels: Record<Transaction['type'], string> = {
      transfer: 'Transferencia',
      payment: 'Pago',
      deposit: 'Depósito',
      withdrawal: 'Retiro',
      fee: 'Comisión'
    };
    return labels[type] || type;
  }
}

