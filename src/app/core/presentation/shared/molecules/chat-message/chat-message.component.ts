import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule, DatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {
  message = input.required<ChatMessage>();

  protected get isUser(): boolean {
    return this.message().sender === 'user';
  }

  protected get messageClass(): string {
    return this.isUser
      ? 'bg-blue-600 text-white ml-auto'
      : 'bg-gray-200 text-gray-900 mr-auto';
  }
}


