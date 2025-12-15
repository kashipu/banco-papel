import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label',
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelComponent {
  for = input<string>('');
  required = input<boolean>(false);
}

