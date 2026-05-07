import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthFacade } from '../../store/auth.facade';
import { LoginRequest } from '../../models/auth.models';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

type LoginFormControls = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, LoginFormComponent],
    templateUrl: './login.page.html',
    styleUrl: './login.page.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly route = inject(ActivatedRoute);
  protected readonly loading = this.authFacade.loading;
  protected readonly error = this.authFacade.error;
  protected readonly registeredMessage = signal('');

  protected readonly form = new FormGroup<LoginFormControls>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    })
  });

  constructor() {
    if (this.route.snapshot.queryParamMap.get('registered') === 'true') {
          this.registeredMessage.set('Account created successfully. Sign in to continue.');
    }
  }

  submit(request: LoginRequest): void {
        this.authFacade.login(request);
  }
}
