import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegisterRequest } from '../../models/auth.models';
import { AuthFacade } from '../../store/auth.facade';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

type RegisterFormControls = {
  fullname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RegisterFormComponent],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPageComponent {
  private readonly authFacade = inject(AuthFacade);
  protected readonly loading = this.authFacade.loading;
  protected readonly error = this.authFacade.error;

  protected readonly form = new FormGroup<RegisterFormControls>({
    fullname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    })
  });

  submit(request: RegisterRequest): void {
    this.authFacade.register(request);
  }
}
