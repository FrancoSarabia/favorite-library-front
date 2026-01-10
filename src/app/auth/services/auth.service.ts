import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';


import { LoginResponse } from '../interfaces/login-response.interface';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject( Router );
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor() {}

  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/auth/login`;
    const body = { username, password };

    // Usando coockie para guardar el refreshToken
    return this.http.post<LoginResponse>(url, body).pipe(
      map((resp) => {
        return resp;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  resetPassword(token: string, password: string) {
    const url = `${environment.apiUrl}/auth/reset-password`;
    const body = { token, password };
    return this.http.post(url, body).pipe(
      tap((resp) =>
        console.log('respuesta del observable: ', console.log(resp))
      ),
      catchError((err) => throwError(() => err.error.message))
    );
  }
}
