import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DocumentsApiService} from '../../services/documents-api.service';

@Component({
  selector: 'app-ai-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-modal.component.html',
  styleUrl: './ai-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiModalComponent {
  @Input({required: true}) documentName: string = '';
  @Input({required: true}) documentId: number = 0;
  @Output() closed = new EventEmitter<void>();

  private readonly documentsApi = inject(DocumentsApiService);
  protected readonly question = signal<string>('');
  protected readonly loading = signal<boolean>(false);
  protected readonly aiResponse = signal<string | null>(null);

  protected readonly onClose = (): void => {
    this.closed.emit();
  };

  protected readonly onQuestionChange = (value: string): void => {
    this.question.set(value);
  };

  protected readonly onSubmit = (): void => {
    const q = this.question().trim();
    if (!q || this.loading()) {
        return;
    }

    this.loading.set(true);
    this.aiResponse.set(null);

    this.documentsApi.askAi(q, this.documentId).subscribe({
      next: (response) => {
        this.aiResponse.set(response?.trim() || null);
        this.question.set('');
        this.loading.set(false);
      },
      error: (error) => {
        console.error('AI request failed', error);
        this.aiResponse.set('Sorry, the AI request failed. Please try again.');
        this.loading.set(false);
      }
    });
  };

  protected readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.onSubmit();
    }
  };
}
