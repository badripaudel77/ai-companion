import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DocumentsApiService } from '../services/documents-api.service';
import { Pageable } from '../models/document.models';
import { documentsActions } from './documents.actions';

function getErrorMessage(error: unknown, fallback = 'Failed to load documents. Please try again.'): string {
  const httpError = error as { error?: { message?: string }; message?: string };
  return httpError.error?.message ?? httpError.message ?? fallback;
}

export const loadCategories$ = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(DocumentsApiService)
  ) =>
    actions$.pipe(
      ofType(documentsActions.loadCategories),
      switchMap(({ pageable }) =>
        api.listMyCategories(pageable).pipe(
          map((categories) => documentsActions.loadCategoriesSuccess({ categories })),
          catchError((error) =>
            of(documentsActions.loadCategoriesFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    ),
  { functional: true }
);

export const createCategory$ = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(DocumentsApiService)
  ) =>
    actions$.pipe(
      ofType(documentsActions.createCategory),
      switchMap(({ request }) =>
        api.createCategory(request).pipe(
          map((category) => documentsActions.createCategorySuccess({ category })),
          catchError((error) =>
            of(documentsActions.createCategoryFailure({ error: getErrorMessage(error, 'Failed to create category. Please try again.') }))
          )
        )
      )
    ),
  { functional: true }
);

export const uploadDocument$ = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(DocumentsApiService)
  ) =>
    actions$.pipe(
      ofType(documentsActions.uploadDocument),
      switchMap(({ categoryId, file }) =>
        api.uploadDocument(categoryId, file).pipe(
          map(() => documentsActions.uploadDocumentSuccess({ categoryId })),
          catchError((error) =>
            of(
              documentsActions.uploadDocumentFailure({
                categoryId,
                error: getErrorMessage(error, 'Failed to upload document. Please try again.')
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const refreshCategoriesAfterCreate$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(documentsActions.createCategorySuccess),
      map(() =>
        documentsActions.loadCategories({
          pageable: { pageNumber: 0, pageSize: 100 }
        })
      )
    ),
  { functional: true }
);

export const refreshDocumentsAfterUpload$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(documentsActions.uploadDocumentSuccess),
      map(({ categoryId }) =>
        documentsActions.loadDocumentsByCategory({
          categoryId,
          pageable: { pageNumber: 0, pageSize: 50 }
        })
      )
    ),
  { functional: true }
);

export const loadDocumentsByCategory$ = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(DocumentsApiService)
  ) =>
    actions$.pipe(
      ofType(documentsActions.loadDocumentsByCategory),
      switchMap(({ categoryId, pageable }) =>
        api.listMyDocuments(categoryId, pageable).pipe(
          map((documents) =>
            documentsActions.loadDocumentsByCategorySuccess({
              categoryId,
              documents
            })
          ),
          catchError((error) =>
            of(
              documentsActions.loadDocumentsByCategoryFailure({
                categoryId,
                error: getErrorMessage(error)
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const downloadDocument$ = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(DocumentsApiService)
  ) =>
    actions$.pipe(
      ofType(documentsActions.downloadDocument),
      switchMap(({ id, filename }) =>
        api.downloadDocument(id).pipe(
          tap((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
          }),
          map(() => documentsActions.downloadDocumentSuccess({ id })),
          catchError((error) =>
            of(documentsActions.downloadDocumentFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    ),
  { functional: true }
);

export const loadAdminDocuments$ = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(DocumentsApiService)
  ) =>
    actions$.pipe(
      ofType(documentsActions.loadAdminDocuments),
      switchMap(({ pageable }) =>
        api.listAdminDocuments(pageable).pipe(
          map((documents) =>
            documentsActions.loadAdminDocumentsSuccess({ documents })
          ),
          catchError((error) =>
            of(
              documentsActions.loadAdminDocumentsFailure({
                error: getErrorMessage(error, 'Failed to load admin documents. Please try again.')
              })
            )
          )
        )
      )
    ),
  { functional: true }
);
