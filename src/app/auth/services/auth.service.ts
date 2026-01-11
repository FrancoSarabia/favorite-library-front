import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';


import { LoginResponse } from '../interfaces/login-response.interface';
import { environment } from '../../environment/environment';
import { STORAGE_KEY } from '../../shared/consts/storage.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject( Router );

  constructor() {}

  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/users/login`;
    const body = { username, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap( ( user ) => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } ),
      map((resp) => {
        return resp;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }
}
