import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../../models/document.models';
import { DocumentsApiService } from '../../services/documents-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentViewerComponent implements OnInit {
  @Input({ required: true }) document!: Document;
  @Output() closed = new EventEmitter<void>();

  private readonly api = inject(DocumentsApiService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly documentUrl = signal<SafeResourceUrl | null>(null);
  private rawObjectUrl: string | null = null;
  readonly canViewInline = computed(() => {
    const type = this.document?.contentType || '';
    return type.includes('pdf') || type.includes('image');
  });

  ngOnInit(): void {
    this.loadDocument();
  }

  private loadDocument(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.viewDocument(this.document.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.rawObjectUrl = url;
        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url) as SafeResourceUrl;
        this.documentUrl.set(safeUrl);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load document. Please try again.');
        this.loading.set(false);
        console.error('Document viewer error:', err);
      }
    });
  }

  downloadDocument(): void {
    const url = this.rawObjectUrl;
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = this.document.filename;
      link.click();
    }
  }

  closeViewer(): void {
    if (this.rawObjectUrl) {
      URL.revokeObjectURL(this.rawObjectUrl);
      this.rawObjectUrl = null;
    }
    this.closed.emit();
  }

  getFileIcon(): string {
    const type = this.document?.contentType || '';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('sheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  }

  getViewType(): 'pdf' | 'image' | 'other' {
    const type = this.document?.contentType || '';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('image')) return 'image';
    return 'other';
  }
}
