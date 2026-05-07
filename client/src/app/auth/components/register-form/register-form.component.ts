import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterRequest } from '../../models/auth.models';

type RegisterFormControls = {
    fullname: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
};

@Component({
    selector: 'app-register-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register-form.component.html',
    styleUrl: './register-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent {
  @Input({ required: true }) form!: FormGroup<RegisterFormControls>;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() submitted = new EventEmitter<RegisterRequest>();

  submit(): void {
    if (this.form.invalid) {
          this.form.markAllAsTouched();
          return;
    }

    this.submitted.emit({
        fullname: this.form.controls.fullname.value,
        email: this.form.controls.email.value,
        password: this.form.controls.password.value
    });
  }
}
