import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookCatalogPage } from './pages/book-catalog-page/book-catalog-page';
import { BookFavoritesPage } from './pages/book-favorites-page/book-favorites-page';
import { FormsModule } from "@angular/forms";
import { SharedModule } from '../shared/shared-module';
import { BookDetailModal } from './components/book-detail-modal/book-detail-modal';



@NgModule({
  declarations: [
    BookCatalogPage,
    BookFavoritesPage,
    BookDetailModal
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    SharedModule,
    FormsModule
]
})
export class BookModule { }
