import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/atoms/button/button.component';
import { ChatbotComponent } from '../../shared/organisms/chatbot/chatbot.component';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink, ButtonComponent, ChatbotComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {}

