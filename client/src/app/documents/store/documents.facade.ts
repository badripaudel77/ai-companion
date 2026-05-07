import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CreateCategoryRequest, Pageable } from '../models/document.models';
import { documentsActions } from './documents.actions';
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoryCreateError,
  selectCategoryCreateLoading,
  selectDocumentsByCategory,
  selectUploadErrors,
  selectUploadingCategoryIds,
  selectAdminDocuments,
  selectAdminDocumentsLoading,
  selectAdminDocumentsError
} from './documents.selectors';

@Injectable({ providedIn: 'root' })
export class DocumentsFacade {
  private readonly store = inject(Store);

  readonly categories = this.store.selectSignal(selectCategories);
  readonly categoriesLoading = this.store.selectSignal(selectCategoriesLoading);
  readonly categoryCreateLoading = this.store.selectSignal(selectCategoryCreateLoading);
  readonly categoryCreateError = this.store.selectSignal(selectCategoryCreateError);
  readonly uploadingCategoryIds = this.store.selectSignal(selectUploadingCategoryIds);
  readonly uploadErrors = this.store.selectSignal(selectUploadErrors);
  readonly documentsByCategory = this.store.selectSignal(selectDocumentsByCategory);
  readonly adminDocuments = this.store.selectSignal(selectAdminDocuments);
  readonly adminDocumentsLoading = this.store.selectSignal(selectAdminDocumentsLoading);
  readonly adminDocumentsError = this.store.selectSignal(selectAdminDocumentsError);
  readonly hasCategories = computed(() => this.categories().length > 0);

  loadCategories(pageable: Pageable): void {
    this.store.dispatch(documentsActions.loadCategories({ pageable }));
  }

  createCategory(request: CreateCategoryRequest): void {
    this.store.dispatch(documentsActions.createCategory({ request }));
  }

  uploadDocument(categoryId: number, file: File): void {
    this.store.dispatch(documentsActions.uploadDocument({ categoryId, file }));
  }

  loadDocumentsByCategory(categoryId: number, pageable: Pageable): void {
    this.store.dispatch(
      documentsActions.loadDocumentsByCategory({ categoryId, pageable })
    );
  }

  downloadDocument(id: number, filename: string): void {
    this.store.dispatch(documentsActions.downloadDocument({ id, filename }));
  }

  loadAdminDocuments(pageable: Pageable): void {
    this.store.dispatch(documentsActions.loadAdminDocuments({ pageable }));
  }

  clearDocuments(): void {
    this.store.dispatch(documentsActions.clearDocuments());
  }
}
