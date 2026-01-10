import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookFavoritesPage } from './pages/book-favorites-page/book-favorites-page';
import { BookCatalogPage } from './pages/book-catalog-page/book-catalog-page';

const routes: Routes = [
    {
      path: 'book-catalog',
      component: BookCatalogPage
    },
    {
      path: 'favorites',
      component: BookFavoritesPage
    },
    {
      path: '**',
      redirectTo: 'register'
    },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [ RouterModule ]
})
export class BookRoutingModule { }
