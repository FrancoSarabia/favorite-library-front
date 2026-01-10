import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { IBook } from "../interfaces/book.interface";
import { catchError, map, Observable, of } from "rxjs";
import { IFavoriteBookResponse } from "../interfaces/favorite-book-response.interface";

@Injectable({
  providedIn: 'root',
})
export class FavoriteBookService {

    private httpClient = inject(HttpClient);
    private apiUrl = 'http://localhost:5089/api';

    constructor() { }

    getFavoritesByUser( userId: string ): Observable<IFavoriteBookResponse[]> {
       return this.httpClient.get<IFavoriteBookResponse[]>(`${this.apiUrl}/favorites/user/${ userId }`);
    }

    addFavorite(book: IBook, userId: string): Observable<IFavoriteBookResponse> {
        const favoriteData = {
            ...book,
            userId: userId
        };
        return this.httpClient.post<IFavoriteBookResponse>(`${this.apiUrl}/favorites`, favoriteData);
    }

    removeFavorite( favoriteId: string ): Observable<boolean> {
        return this.httpClient.delete( `${this.apiUrl}/favorites/${ favoriteId }` ).pipe(
            map( () => true ),
            catchError((error) => {
                return of(false);
            })
        );
    }
}