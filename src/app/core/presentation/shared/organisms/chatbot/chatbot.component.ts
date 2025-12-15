import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage, ChatMessageComponent } from '../../molecules/chat-message/chat-message.component';
import { ChatInputComponent } from '../../molecules/chat-input/chat-input.component';
import { AnalyticsService } from '../../../../infrastructure/services/analytics.service';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, ChatMessageComponent, ChatInputComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotComponent {
  private readonly analyticsService = inject(AnalyticsService);

  protected readonly isOpen = signal<boolean>(false);
  protected readonly messages = signal<ChatMessage[]>([]);
  private chatOpenedAt: number | null = null;
  private messagesSentCount = 0;
  private messagesReceivedCount = 0;

  protected toggleChat(): void {
    const wasOpen = this.isOpen();

    if (wasOpen) {
      // Cerrando el chat - enviar evento con métricas
      this.trackChatClose();
      this.resetChatMetrics();
    } else {
      // Abriendo el chat - iniciar tracking
      this.chatOpenedAt = Date.now();
      this.analyticsService.trackChatbotOpen();
    }

    this.isOpen.update(value => !value);
  }

  protected sendMessage(text: string): void {
    const userMessage: ChatMessage = {
      text,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    this.messagesSentCount++;

    // Simular delay de respuesta del bot
    setTimeout(() => {
      const botMessage: ChatMessage = {
        text: 'Hola bienvenido al banco de papel',
        sender: 'bot',
        timestamp: new Date()
      };
      this.messages.update(msgs => [...msgs, botMessage]);
      this.messagesReceivedCount++;
    }, 500);
  }

  private trackChatClose(): void {
    const chatDuration = this.chatOpenedAt
      ? Math.floor((Date.now() - this.chatOpenedAt) / 1000)
      : 0;

    this.analyticsService.trackChatbotClose({
      chatDuration,
      messagesSent: this.messagesSentCount,
      messagesReceived: this.messagesReceivedCount,
      userEngaged: this.messagesSentCount > 0
    });
  }

  private resetChatMetrics(): void {
    this.chatOpenedAt = null;
    this.messagesSentCount = 0;
    this.messagesReceivedCount = 0;
  }
}

