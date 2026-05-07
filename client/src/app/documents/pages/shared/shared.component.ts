import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsApiService } from '../../services/documents-api.service';
import { DocumentListComponent } from '../../components/document-list/document-list.component';
import { DocumentViewerComponent } from '../../components/document-viewer/document-viewer.component';
import { Document } from '../../models/document.models';
import { DocumentsFacade } from '../../store/documents.facade';

@Component({
  selector: 'app-shared-content',
  standalone: true,
  imports: [CommonModule, DocumentListComponent, DocumentViewerComponent],
  template: `
    <div class="content-section">
      <div class="section-header">
        <h2>Others' Documents</h2>
        <p class="section-subtitle">Documents uploaded by administrators</p>
      </div>

      @if (adminDocumentsLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading admin documents...</p>
        </div>
      } @else if (adminDocumentsError()) {
        <div class="error-state">
          <p class="error-icon">⚠️</p>
          <p>{{ adminDocumentsError() }}</p>
        </div>
      } @else if (adminDocuments().length === 0) {
        <div class="empty-state">
          <p class="empty-icon">📄</p>
          <h3>No admin documents</h3>
          <p>There are no documents available from administrators yet.</p>
        </div>
      } @else {
        <app-document-list
          [documents]="adminDocuments()"
          (downloadClicked)="onDownloadDocument($event)"
          (viewClicked)="onViewDocument($event)"
        />
      }
    </div>

    @if (viewedDocument(); as doc) {
      <app-document-viewer
        [document]="doc"
        (closed)="viewedDocument.set(null)"
      />
    }
  `,
  styles: [`
    .content-section {
      padding: 2rem;
      max-width: 1000px;
    }

    .section-header {
      margin-bottom: 2rem;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      color: #0f172a;
      font-size: 1.875rem;
      font-weight: 600;
    }

    .section-subtitle {
      color: #64748b;
      margin: 0;
      font-size: 0.875rem;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      gap: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .loading-state p {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      gap: 1rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 0.375rem;
      text-align: center;
    }

    .error-icon {
      font-size: 2.5rem;
      margin: 0;
    }

    .error-state p {
      color: #dc2626;
      margin: 0;
      font-size: 0.875rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      gap: 1rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 3rem;
      margin: 0;
    }

    .empty-state h3 {
      margin: 0;
      color: #0f172a;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .empty-state p {
      color: #64748b;
      margin: 0;
      font-size: 0.875rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedContentComponent implements OnInit {
      private readonly facade = inject(DocumentsFacade);
      private readonly api = inject(DocumentsApiService);

      readonly adminDocuments = this.facade.adminDocuments;
      readonly adminDocumentsLoading = this.facade.adminDocumentsLoading;
      readonly adminDocumentsError = this.facade.adminDocumentsError;
      readonly viewedDocument = signal<Document | null>(null);

      ngOnInit(): void {
        this.facade.loadAdminDocuments({ pageNumber: 0, pageSize: 50 });
      }

      onDownloadDocument(event: { id: number; filename: string }): void {
        this.facade.downloadDocument(event.id, event.filename);
      }

      onViewDocument(document: Document): void {
        this.viewedDocument.set(document);
      }
}
