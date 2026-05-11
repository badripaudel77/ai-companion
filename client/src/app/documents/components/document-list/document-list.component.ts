import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../../models/document.models';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentListComponent {
  @Input({ required: true }) documents: Document[] = [];
  @Input() downloadingIds: Set<number> = new Set();
  @Output() downloadClicked = new EventEmitter<{ id: number; filename: string }>();
  @Output() viewClicked = new EventEmitter<Document>();
  @Output() askAIClicked = new EventEmitter<Document>();

  protected readonly onDownload = (doc: Document): void => {
    this.downloadClicked.emit({ id: doc.id, filename: doc.filename });
  };

  protected readonly onView = (doc: Document): void => {
    this.viewClicked.emit(doc);
  };

  protected readonly onAskAI = (doc: Document): void => {
    this.askAIClicked.emit(doc);
  };

  protected readonly formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  protected readonly formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  protected readonly getFileIcon = (contentType: string): string => {
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('word')) return '📝';
    if (contentType.includes('sheet')) return '📊';
    if (contentType.includes('image')) return '🖼️';
    return '📎';
  };
}
