import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentUploadComponent {
  @Input() categoryName = '';
  @Input() isUploading = false;
  @Input() error: string | null = null;
  @Output() uploadRequested = new EventEmitter<File>();

  protected selectedFile: File | null = null;

  protected readonly onFileSelected = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  };

  protected readonly submit = (): void => {
    if (!this.selectedFile || this.isUploading) {
      return;
    }

    this.uploadRequested.emit(this.selectedFile);
    this.selectedFile = null;
  };

  protected readonly clearSelectedFile = (): void => {
    this.selectedFile = null;
  };
}
