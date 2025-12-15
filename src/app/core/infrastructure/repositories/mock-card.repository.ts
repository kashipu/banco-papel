import { Injectable } from '@angular/core';
import { CardRepository } from '../../domain/repositories/card.repository';
import { Card } from '../../domain/entities/card.entity';

@Injectable({
  providedIn: 'root'
})
export class MockCardRepository implements CardRepository {
  private readonly mockCards: Card[] = [
    {
      id: 'card-1',
      userId: '1',
      accountId: 'acc-1',
      cardNumber: '4532123456789012',
      cardHolderName: 'JUAN PEREZ',
      type: 'debit',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      status: 'active',
      dailyLimit: 5000,
      monthlyLimit: 15000,
      createdAt: new Date('2020-01-01')
    },
    {
      id: 'card-2',
      userId: '1',
      accountId: 'acc-2',
      cardNumber: '5555123456789012',
      cardHolderName: 'JUAN PEREZ',
      type: 'credit',
      brand: 'mastercard',
      expiryMonth: 6,
      expiryYear: 2026,
      status: 'active',
      dailyLimit: 3000,
      monthlyLimit: 10000,
      createdAt: new Date('2020-02-01')
    }
  ];

  async getUserCards(userId: string): Promise<Card[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockCards.filter(card => card.userId === userId);
  }

  async getCardById(cardId: string): Promise<Card | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const card = this.mockCards.find(c => c.id === cardId);
    if (!card) {
      return null;
    }
    // No devolver CVV en producción
    const { cvv, ...cardWithoutCvv } = card;
    return cardWithoutCvv as Card;
  }

  async updateCardStatus(cardId: string, status: Card['status']): Promise<Card> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const card = this.mockCards.find(c => c.id === cardId);
    if (!card) {
      throw new Error('Tarjeta no encontrada');
    }

    card.status = status;
    const { cvv, ...cardWithoutCvv } = card;
    return cardWithoutCvv as Card;
  }
}

