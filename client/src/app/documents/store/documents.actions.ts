import { createAction, props } from '@ngrx/store';
import { Category, CreateCategoryRequest, Document, PagedResponse, Pageable } from '../models/document.models';

export const loadCategories = createAction(
  '[Documents Page] Load Categories',
  props<{ pageable: Pageable }>()
);

export const loadCategoriesSuccess = createAction(
  '[Documents API] Load Categories Success',
  props<{ categories: PagedResponse<Category> }>()
);

export const loadCategoriesFailure = createAction(
  '[Documents API] Load Categories Failure',
  props<{ error: string }>()
);

export const createCategory = createAction(
  '[Create Category Form] Create Category',
  props<{ request: CreateCategoryRequest }>()
);

export const createCategorySuccess = createAction(
  '[Documents API] Create Category Success',
  props<{ category: Category }>()
);

export const createCategoryFailure = createAction(
  '[Documents API] Create Category Failure',
  props<{ error: string }>()
);

export const uploadDocument = createAction(
  '[Document Upload] Upload Document',
  props<{ categoryId: number; file: File }>()
);

export const uploadDocumentSuccess = createAction(
  '[Documents API] Upload Document Success',
  props<{ categoryId: number }>()
);

export const uploadDocumentFailure = createAction(
  '[Documents API] Upload Document Failure',
  props<{ categoryId: number; error: string }>()
);

export const loadDocumentsByCategory = createAction(
  '[Category Group] Load Documents',
  props<{ categoryId: number; pageable: Pageable }>()
);

export const loadDocumentsByCategorySuccess = createAction(
  '[Documents API] Load Documents By Category Success',
  props<{ categoryId: number; documents: PagedResponse<Document> }>()
);

export const loadDocumentsByCategoryFailure = createAction(
  '[Documents API] Load Documents By Category Failure',
  props<{ categoryId: number; error: string }>()
);

export const downloadDocument = createAction(
  '[Document List] Download Document',
  props<{ id: number; filename: string }>()
);

export const downloadDocumentSuccess = createAction(
  '[Documents API] Download Document Success',
  props<{ id: number }>()
);

export const downloadDocumentFailure = createAction(
  '[Documents API] Download Document Failure',
  props<{ error: string }>()
);

export const loadAdminDocuments = createAction(
  '[Shared Content] Load Admin Documents',
  props<{ pageable: Pageable }>()
);

export const loadAdminDocumentsSuccess = createAction(
  '[Documents API] Load Admin Documents Success',
  props<{ documents: PagedResponse<Document> }>()
);

export const loadAdminDocumentsFailure = createAction(
  '[Documents API] Load Admin Documents Failure',
  props<{ error: string }>()
);

export const clearDocuments = createAction('[Documents] Clear');

export const documentsActions = {
  loadCategories,
  loadCategoriesSuccess,
  loadCategoriesFailure,
  createCategory,
  createCategorySuccess,
  createCategoryFailure,
  uploadDocument,
  uploadDocumentSuccess,
  uploadDocumentFailure,
  loadDocumentsByCategory,
  loadDocumentsByCategorySuccess,
  loadDocumentsByCategoryFailure,
  downloadDocument,
  downloadDocumentSuccess,
  downloadDocumentFailure,
  loadAdminDocuments,
  loadAdminDocumentsSuccess,
  loadAdminDocumentsFailure,
  clearDocuments
};
