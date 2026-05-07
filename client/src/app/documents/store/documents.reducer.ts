import { createFeature, createReducer, on } from '@ngrx/store';
import { Category, Document, PagedResponse, DocumentsByCategory } from '../models/document.models';
import { documentsActions } from './documents.actions';

export interface DocumentsByCategoryMap {
  [categoryId: string]: DocumentsByCategory;
}

export interface DocumentsState {
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  categoryCreateLoading: boolean;
  categoryCreateError: string | null;
  uploadingCategoryIds: Set<number>;
  uploadErrors: Record<string, string | null>;
  documentsByCategory: DocumentsByCategoryMap;
  downloadingIds: Set<number>;
  downloadError: string | null;
  adminDocuments: Document[];
  adminDocumentsLoading: boolean;
  adminDocumentsError: string | null;
}

export const initialDocumentsState: DocumentsState = {
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  categoryCreateLoading: false,
  categoryCreateError: null,
  uploadingCategoryIds: new Set(),
  uploadErrors: {},
  documentsByCategory: {},
  downloadingIds: new Set(),
  downloadError: null,
  adminDocuments: [],
  adminDocumentsLoading: false,
  adminDocumentsError: null
};

const documentsReducer = createReducer(
  initialDocumentsState,
  on(documentsActions.loadCategories, (state) => ({
    ...state,
    categoriesLoading: true,
    categoriesError: null
  })),
  on(documentsActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories: categories.content,
    categoriesLoading: false
  })),
  on(documentsActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    categoriesLoading: false,
    categoriesError: error
  })),
  on(documentsActions.createCategory, (state) => ({
    ...state,
    categoryCreateLoading: true,
    categoryCreateError: null
  })),
  on(documentsActions.createCategorySuccess, (state, { category }) => ({
    ...state,
    categories: [category, ...state.categories],
    categoryCreateLoading: false,
    categoryCreateError: null
  })),
  on(documentsActions.createCategoryFailure, (state, { error }) => ({
    ...state,
    categoryCreateLoading: false,
    categoryCreateError: error
  })),
  on(documentsActions.uploadDocument, (state, { categoryId }) => ({
    ...state,
    uploadingCategoryIds: new Set([...state.uploadingCategoryIds, categoryId]),
    uploadErrors: {
      ...state.uploadErrors,
      [categoryId.toString()]: null
    }
  })),
  on(documentsActions.uploadDocumentSuccess, (state, { categoryId }) => ({
    ...state,
    uploadingCategoryIds: new Set([...state.uploadingCategoryIds].filter((id) => id !== categoryId)),
    uploadErrors: {
      ...state.uploadErrors,
      [categoryId.toString()]: null
    }
  })),
  on(documentsActions.uploadDocumentFailure, (state, { categoryId, error }) => ({
    ...state,
    uploadingCategoryIds: new Set([...state.uploadingCategoryIds].filter((id) => id !== categoryId)),
    uploadErrors: {
      ...state.uploadErrors,
      [categoryId.toString()]: error
    }
  })),
  on(documentsActions.loadDocumentsByCategory, (state, { categoryId }) => ({
    ...state,
    documentsByCategory: {
      ...state.documentsByCategory,
      [categoryId.toString()]: {
        category: state.categories.find((c) => c.id === categoryId)!,
        documents: [],
        loading: true
      }
    }
  })),
  on(documentsActions.loadDocumentsByCategorySuccess, (state, { categoryId, documents }) => ({
    ...state,
    documentsByCategory: {
      ...state.documentsByCategory,
      [categoryId.toString()]: {
        ...state.documentsByCategory[categoryId.toString()],
        documents: documents.content,
        loading: false
      }
    }
  })),
  on(documentsActions.loadDocumentsByCategoryFailure, (state, { categoryId }) => ({
    ...state,
    documentsByCategory: {
      ...state.documentsByCategory,
      [categoryId.toString()]: {
        ...state.documentsByCategory[categoryId.toString()],
        loading: false
      }
    }
  })),
  on(documentsActions.downloadDocument, (state, { id }) => ({
    ...state,
    downloadingIds: new Set([...state.downloadingIds, id]),
    downloadError: null
  })),
  on(documentsActions.downloadDocumentSuccess, (state, { id }) => ({
    ...state,
    downloadingIds: new Set([...state.downloadingIds].filter((downloadId) => downloadId !== id))
  })),
  on(documentsActions.downloadDocumentFailure, (state, { error }) => ({
    ...state,
    downloadError: error
  })),
  on(documentsActions.loadAdminDocuments, (state) => ({
    ...state,
    adminDocumentsLoading: true,
    adminDocumentsError: null
  })),
  on(documentsActions.loadAdminDocumentsSuccess, (state, { documents }) => ({
    ...state,
    adminDocuments: documents.content,
    adminDocumentsLoading: false,
    adminDocumentsError: null
  })),
  on(documentsActions.loadAdminDocumentsFailure, (state, { error }) => ({
    ...state,
    adminDocumentsLoading: false,
    adminDocumentsError: error
  })),
  on(documentsActions.clearDocuments, () => initialDocumentsState)
);

export const documentsFeature = createFeature({
  name: 'documents',
  reducer: documentsReducer
});

export const {
  selectDocumentsState,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectCategoryCreateLoading,
  selectCategoryCreateError,
  selectUploadingCategoryIds,
  selectUploadErrors,
  selectDocumentsByCategory,
  selectDownloadingIds,
  selectDownloadError,
  selectAdminDocuments,
  selectAdminDocumentsLoading,
  selectAdminDocumentsError
} = documentsFeature;
