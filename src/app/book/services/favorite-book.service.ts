import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";

import { IBook } from "../interfaces/book.interface";
import { IFavoriteBook } from "../interfaces/favorite-book.interface";
import { IPaginatedFavoriteBooks } from "../interfaces/paginated-favorite-books.interface";
import { environment } from "../../environment/environment";

@Injectable({
  providedIn: 'root',
})
export class FavoriteBookService {

    private httpClient = inject(HttpClient);

    constructor() { }

    getFavoritesByUser( userId: string ): Observable<IFavoriteBook[]> {
       return this.httpClient.get<IFavoriteBook[]>(`${environment.apiUrl}/favorites/user/${ userId }`);
    }

    getFavoritesByUserPaginated( userId: string, page: number, pageSize: number ): Observable<IPaginatedFavoriteBooks> {
       return this.httpClient.get<IPaginatedFavoriteBooks>(
            `${environment.apiUrl}/favorites/user-paginated/${ userId }?page=${page}&pageSize=${pageSize}`
        );
    }

    addFavorite(book: IBook, userId: string): Observable<IFavoriteBook> {

        if (!book.authors || book.authors.length === 0) {
            return throwError(() => new Error('El libro no tiene autores'));
        }
        const favoriteData = {
            ...book,
            userId: userId
        };
        return this.httpClient.post<IFavoriteBook>(`${environment.apiUrl}/favorites`, favoriteData);
    }

    removeFavorite( favoriteId: string ): Observable<boolean> {
        return this.httpClient.delete( `${environment.apiUrl}/favorites/${ favoriteId }` ).pipe(
            map( () => true ),
            catchError((error) => {
                return throwError(() => new Error(error));
            })
        );
    }
}