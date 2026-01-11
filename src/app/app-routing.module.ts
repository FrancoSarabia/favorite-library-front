import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './layout/auth/auth-layout.component';
import { MainLayoutComponent } from './layout/main/main-layout.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then( m => m.UserModule )
      },
      {
        path: 'book',
        loadChildren: () => import('./book/book.module').then( m => m.BookModule )
      },
      {
        path: '**',
        redirectTo: 'book/book-catalog'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
