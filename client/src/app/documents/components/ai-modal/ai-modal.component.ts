import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-modal.component.html',
  styleUrl: './ai-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiModalComponent {
  @Input({ required: true }) documentName: string = '';
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<string>();

  protected readonly question = signal<string>('');

  protected readonly onClose = (): void => {
    this.closed.emit();
  };

  protected readonly onQuestionChange = (value: string): void => {
    this.question.set(value);
  };

  protected readonly onSubmit = (): void => {
    const q = this.question().trim();
    if (q) {
      this.submitted.emit(q);
      this.question.set('');
    }
  };

  protected readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.onSubmit();
    }
  };
}
