import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ICreateUserResponse } from '../interfaces/create-user-response.interface';
import { CreateUser } from '../interfaces/create-user.interface';
import { STORAGE_KEY } from '../../shared/consts/storage.const';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:5089/api';

  constructor() {}

  public userRegister(
    formValues: CreateUser
  ): Observable<ICreateUserResponse> {
    return this.httpClient.post<ICreateUserResponse>(
      `${this.apiUrl}/users`,
      {
        FirstName: formValues.firstName,
        LastName: formValues.lastName,
        UserName: formValues.username,
        Password: formValues.password
      }
    )
    .pipe(
      tap(user => this.saveUserToStorage(user))
    );
  }

  getUserById(id: string) {
    return this.httpClient.get(`${ this.apiUrl }/worker/${ id }`);
  }

  private saveUserToStorage(user: ICreateUserResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  public getUserFromStorage(): ICreateUserResponse | null {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  public clearUserStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

}
