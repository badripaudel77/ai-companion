import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentsFacade } from '../../store/documents.facade';

interface CreateCategoryForm {
  name: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-create-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateContentComponent {
  private readonly documentsFacade = inject(DocumentsFacade);

  protected readonly categoryCreateLoading = this.documentsFacade.categoryCreateLoading;
  protected readonly categoryCreateError = this.documentsFacade.categoryCreateError;

  protected readonly form = new FormGroup<CreateCategoryForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)]
    })
  });

  protected readonly submit = (): void => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.documentsFacade.createCategory({
      name: this.form.controls.name.value.trim(),
      description: this.form.controls.description.value.trim()
    });

    this.form.reset({ name: '', description: '' });
  };
}