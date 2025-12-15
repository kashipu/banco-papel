import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { CardComponent } from '../../shared/molecules/card/card.component';
import { SpinnerComponent } from '../../shared/atoms/spinner/spinner.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, CardComponent, SpinnerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private readonly authState = inject(AuthStateService);

  protected readonly user = this.authState.currentUser;
  protected readonly isLoading = this.authState.isLoading;
}

