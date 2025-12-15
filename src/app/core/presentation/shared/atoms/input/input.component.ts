import { Component, input, output, ChangeDetectionStrategy, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  type = input<string>('text');
  placeholder = input<string>('');
  disabledInput = input<boolean>(false);
  required = input<boolean>(false);
  id = input<string>('');
  name = input<string>('');
  valueChanged = output<string>();

  private readonly _disabled = signal<boolean>(false);
  protected readonly disabled = this._disabled.asReadonly();

  private _value = '';
  private _onChange = (_: string) => {};
  private _onTouched = () => {};

  protected get value(): string {
    return this._value;
  }

  protected set value(val: string) {
    this._value = val;
    this._onChange(val);
    this.valueChanged.emit(val);
  }

  writeValue(value: string): void {
    this._value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  protected get isDisabled(): boolean {
    return this.disabledInput() || this.disabled();
  }

  protected onBlur(): void {
    this._onTouched();
  }
}

