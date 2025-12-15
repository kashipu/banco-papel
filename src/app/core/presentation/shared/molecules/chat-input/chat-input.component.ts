import { Component, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatInputComponent {
  messageSent = output<string>();

  protected readonly message = signal<string>('');

  protected sendMessage(): void {
    const text = this.message().trim();
    if (text) {
      this.messageSent.emit(text);
      this.message.set('');
    }
  }

  protected onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}

