import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookCatalogPage } from './pages/book-catalog-page/book-catalog-page';
import { BookFavoritesPage } from './pages/book-favorites-page/book-favorites-page';
import { FormsModule } from "@angular/forms";
import { SharedModule } from '../shared/shared-module';



@NgModule({
  declarations: [
    BookCatalogPage,
    BookFavoritesPage
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    SharedModule,
    FormsModule
]
})
export class BookModule { }
