import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly authState = inject(AuthStateService);

  protected readonly user = this.authState.currentUser;
  protected readonly isAuthenticated = this.authState.isAuthenticated;

  protected logout(): void {
    this.authState.logout();
  }
}

