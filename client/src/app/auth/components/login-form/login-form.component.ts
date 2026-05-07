import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from '../../models/auth.models';

type LoginFormControls = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
    @Input({ required: true }) form!: FormGroup<LoginFormControls>;
    @Input() loading = false;
    @Input() error: string | null = null;
    @Output() submitted = new EventEmitter<LoginRequest>();

    submit(): void {
      if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
      }

    this.submitted.emit({
      email: this.form.controls.email.value,
      password: this.form.controls.password.value
    });
  }
}
