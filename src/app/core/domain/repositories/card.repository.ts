import { Card } from '../entities/card.entity';

export interface CardRepository {
  getUserCards(userId: string): Promise<Card[]>;
  getCardById(cardId: string): Promise<Card | null>;
  updateCardStatus(cardId: string, status: Card['status']): Promise<Card>;
}

