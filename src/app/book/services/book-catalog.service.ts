import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPaginatedBooks } from '../interfaces/paginated-books.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookCatalogService {
  private httpClient = inject(HttpClient);

  private apiUrl = 'http://localhost:5089/api';

  constructor() { }

  searchBooks(title: string, author: string, page: number, pageSize: number): Observable<IPaginatedBooks> {
    return this.httpClient.get<IPaginatedBooks>(
        `${this.apiUrl}/books/search?title=${title}&author=${author}&page=${page}&pageSize=${pageSize}`,
    )
  }
}
