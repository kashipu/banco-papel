import { Component, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../domain/entities/card.entity';
import { MockCardRepository } from '../../../infrastructure/repositories/mock-card.repository';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { CardComponent } from '../../shared/molecules/card/card.component';
import { BadgeComponent } from '../../shared/atoms/badge/badge.component';
import { SpinnerComponent } from '../../shared/atoms/spinner/spinner.component';

@Component({
  selector: 'app-cards',
  imports: [
    CommonModule,
    CardComponent,
    BadgeComponent,
    SpinnerComponent
  ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent {
  private readonly cardRepo = inject(MockCardRepository);
  private readonly authState = inject(AuthStateService);

  protected readonly cards = signal<Card[]>([]);
  protected readonly isLoading = signal<boolean>(true);

  constructor() {
    effect(() => {
      const user = this.authState.currentUser();
      if (user) {
        this.loadCards(user.id);
      }
    });
  }

  private async loadCards(userId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const cards = await this.cardRepo.getUserCards(userId);
      this.cards.set(cards);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected maskCardNumber(cardNumber: string): string {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  }

  protected getCardTypeLabel(type: Card['type']): string {
    return type === 'debit' ? 'Débito' : 'Crédito';
  }

  protected getCardBrandLabel(brand: Card['brand']): string {
    const brands: Record<Card['brand'], string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express'
    };
    return brands[brand] || brand;
  }

  protected getStatusVariant(status: Card['status']): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (status) {
      case 'active':
        return 'success';
      case 'blocked':
        return 'error';
      case 'expired':
        return 'warning';
      case 'cancelled':
        return 'neutral';
      default:
        return 'neutral';
    }
  }

  protected getStatusLabel(status: Card['status']): string {
    const labels: Record<Card['status'], string> = {
      active: 'Activa',
      blocked: 'Bloqueada',
      expired: 'Expirada',
      cancelled: 'Cancelada'
    };
    return labels[status] || status;
  }
}

