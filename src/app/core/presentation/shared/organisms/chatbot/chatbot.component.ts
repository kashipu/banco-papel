import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage, ChatMessageComponent } from '../../molecules/chat-message/chat-message.component';
import { ChatInputComponent } from '../../molecules/chat-input/chat-input.component';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, ChatMessageComponent, ChatInputComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotComponent {
  protected readonly isOpen = signal<boolean>(false);
  protected readonly messages = signal<ChatMessage[]>([]);

  protected toggleChat(): void {
    this.isOpen.update(value => !value);
  }

  protected sendMessage(text: string): void {
    const userMessage: ChatMessage = {
      text,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMessage]);

    // Simular delay de respuesta del bot
    setTimeout(() => {
      const botMessage: ChatMessage = {
        text: 'Hola bienvenido al banco de papel',
        sender: 'bot',
        timestamp: new Date()
      };
      this.messages.update(msgs => [...msgs, botMessage]);
    }, 500);
  }
}

