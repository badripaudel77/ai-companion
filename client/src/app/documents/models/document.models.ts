export interface Category {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  createdAt: string;
}

export interface Document {
  id: number;
  filename: string;
  contentType: string;
  size: number;
  categoryId: number;
  ownerId: number;
  createdAt: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort?: string[];
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  empty: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface DocumentsByCategory {
  category: Category;
  documents: Document[];
  loading: boolean;
}
