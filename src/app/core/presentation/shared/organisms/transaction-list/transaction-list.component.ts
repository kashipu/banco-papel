import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { TransactionItemComponent } from '../../molecules/transaction-item/transaction-item.component';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, TransactionItemComponent],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent {
  transactions = input.required<Transaction[]>();
  emptyMessage = input<string>('No hay transacciones disponibles');
}

