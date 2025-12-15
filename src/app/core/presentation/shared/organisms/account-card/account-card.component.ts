import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../../../domain/entities/account.entity';
import { AccountSummaryComponent } from '../../molecules/account-summary/account-summary.component';
import { CardComponent } from '../../molecules/card/card.component';

@Component({
  selector: 'app-account-card',
  imports: [CommonModule, AccountSummaryComponent, CardComponent],
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountCardComponent {
  account = input.required<Account>();
}

