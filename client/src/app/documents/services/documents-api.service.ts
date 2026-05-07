import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Category,
  CreateCategoryRequest,
  Document,
  Pageable,
  PagedResponse
} from '../models/document.models';

@Injectable({ providedIn: 'root' })
export class DocumentsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  listMyCategories(pageable: Pageable): Observable<PagedResponse<Category>> {
    return this.http.get<PagedResponse<Category>>(
      `${this.baseUrl}/categories/mine`,
      { params: this.buildPaginationParams(pageable) }
    );
  }

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, request);
  }

  uploadDocument(categoryId: number, file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Document>(`${this.baseUrl}/documents/upload/${categoryId}`, formData);
  }

  listMyDocuments(categoryId: number, pageable: Pageable): Observable<PagedResponse<Document>> {
    return this.http.get<PagedResponse<Document>>(
      `${this.baseUrl}/documents/mine/${categoryId}`,
      { params: this.buildPaginationParams(pageable) }
    );
  }

  listAllDocuments(pageable: Pageable): Observable<PagedResponse<Document>> {
    return this.http.get<PagedResponse<Document>>(
      `${this.baseUrl}/documents/all`,
      { params: this.buildPaginationParams(pageable) }
    );
  }

  listAdminDocuments(pageable: Pageable): Observable<PagedResponse<Document>> {
    return this.http.get<PagedResponse<Document>>(
      `${this.baseUrl}/documents/admin`,
      { params: this.buildPaginationParams(pageable) }
    );
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/documents/download/${id}`, {
      responseType: 'blob'
    });
  }

  viewDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/documents/view/${id}`, {
      responseType: 'blob'
    });
  }

  private buildPaginationParams(pageable: Pageable): HttpParams {
    let params = new HttpParams();
    params = params.set('page', pageable.pageNumber.toString());
    params = params.set('size', pageable.pageSize.toString());

    if (pageable.sort && pageable.sort.length > 0) {
      params = params.set('sort', pageable.sort.join(','));
    }

    return params;
  }
}
