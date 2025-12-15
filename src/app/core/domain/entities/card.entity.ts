export type CardType = 'debit' | 'credit';

export type CardStatus = 'active' | 'blocked' | 'expired' | 'cancelled';

export interface Card {
  id: string;
  userId: string;
  accountId: string;
  cardNumber: string;
  cardHolderName: string;
  type: CardType;
  brand: 'visa' | 'mastercard' | 'amex';
  expiryMonth: number;
  expiryYear: number;
  cvv?: string;
  status: CardStatus;
  dailyLimit?: number;
  monthlyLimit?: number;
  createdAt: Date;
}

