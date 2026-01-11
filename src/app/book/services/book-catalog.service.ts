import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IPaginatedBooks } from '../interfaces/paginated-books.interface';
import { environment } from '../../environment/environment';
import { IBook } from '../interfaces/book.interface';

@Injectable({
  providedIn: 'root',
})
export class BookCatalogService {
  private httpClient = inject(HttpClient);

  // ESTADO PERSISTENTE
  public lastSearch = {
    title: '',
    author: '',
    books: [] as IBook[],
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  };

  constructor() {}

  searchBooks(
    title: string,
    author: string,
    page: number,
    pageSize: number
  ): Observable<IPaginatedBooks> {
    return this.httpClient.get<IPaginatedBooks>(
      `${environment.apiUrl}/books/search?title=${title}&author=${author}&page=${page}&pageSize=${pageSize}`
    );
  }
}
