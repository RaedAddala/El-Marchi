import { HttpParams } from '@angular/common/http';

export interface Pagination {
  page: number;
  size: number;
  sort: string[];
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
  sort: Sort;
}

export function createPaginationOption(pagination: Pagination): HttpParams {
  let params = new HttpParams();
  params = params.set('page', pagination.page.toString());
  params = params.set('size', pagination.size.toString());

  // Append each sort parameter as a separate query param
  for (const sort of pagination.sort) {
    params = params.append('sort', sort);
  }

  return params;
}
