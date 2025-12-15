import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Account } from '../../../../domain/entities/account.entity';

@Component({
  selector: 'app-account-summary',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './account-summary.component.html',
  styleUrl: './account-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSummaryComponent {
  account = input.required<Account>();

  protected get accountTypeLabel(): string {
    const type = this.account().accountType;
    const labels: Record<Account['accountType'], string> = {
      checking: 'Cuenta Corriente',
      savings: 'Cuenta de Ahorros',
      investment: 'Cuenta de Inversión'
    };
    return labels[type] || type;
  }
}

