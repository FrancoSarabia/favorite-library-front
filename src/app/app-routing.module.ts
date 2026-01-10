import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './layout/auth/auth-layout.component';
import { MainLayoutComponent } from './layout/main/main-layout.component';


const routes: Routes = [
  // AUTH
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
        path: '',
        redirectTo: 'user/register',
        pathMatch: 'full',
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
