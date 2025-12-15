import { Component, input, ChangeDetectionStrategy, Attribute, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../../atoms/label/label.component';
import { InputComponent } from '../../atoms/input/input.component';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule, ReactiveFormsModule, LabelComponent, InputComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent {
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  id = input<string>('');
  name = input<string>('');
  error = input<string | null>(null);
  disabled = input<boolean>(false);
  
  constructor(@Optional() @Attribute('formControlName') public formControlName: string | null) {}
}

