import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { BookCatalogService } from '../../services/book-catalog.service';
import { IBook } from '../../interfaces/book.interface';
import { FavoriteBookService } from '../../services/favorite-book.service';
import { STORAGE_KEY } from '../../../shared/consts/storage.const';
import { Router } from '@angular/router';
import { IFavoriteBookResponse } from '../../interfaces/favorite-book-response.interface';

@Component({
  selector: 'app-book-catalog-page',
  standalone: false,
  templateUrl: './book-catalog-page.html',
  styleUrl: './book-catalog-page.css',
})
export class BookCatalogPage implements OnInit {
  private bookCatalogService = inject(BookCatalogService);
  private favoriteBookService = inject(FavoriteBookService);
  private router = inject(Router);

  public favoriteExternalIds: string[] = [];
  public favorites: IFavoriteBookResponse[] = [];
  public searchForm!: FormGroup;
  public books: IBook[] = [];

  // Variables de paginación
  public currentPage: number = 1;
  public totalPages: number = 0;
  public pageSize: number = 10;
  public totalItems: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
    });

    const userData = localStorage.getItem(STORAGE_KEY);
    if (userData) {
      const userId = JSON.parse(userData).id;

      this.favoriteBookService.getFavoritesByUser(userId).subscribe((favs) => {
        this.favorites = favs;
        this.favoriteExternalIds = favs.map((f: any) => f.externalId);
      });
    } else this.router.navigate(['/auth/login']);
  }

  searchBooks(page: number = 1) {
    const { title, author } = this.searchForm.value;
    this.currentPage = page;

    this.bookCatalogService.searchBooks(title, author, page, this.pageSize).subscribe({
      next: (data: any) => {
        this.books = data.items;
        this.totalItems = data.total;
        this.totalPages = Math.ceil(data.total / this.pageSize);
      },
    });
  }

  addToFavorites(book: IBook) {
    console.log('Libro añadido a favoritos:', book);
    const userDataCustom = localStorage.getItem(STORAGE_KEY);

    if (userDataCustom) {
      const user = JSON.parse(userDataCustom);
      const userId = user.id;
      this.favoriteBookService.addFavorite(book, userId).subscribe({
        next: (favorite) => {
          if (!this.favoriteExternalIds.includes(book.externalId)) {
            this.favoriteExternalIds.push(book.externalId);
            this.favorites.push(favorite);
          }
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Libro ${favorite.title} añadido a favoritos`,
            showConfirmButton: false,
            timer: 2000,
          });
        },
      });
    } else this.router.navigate(['/auth/login']);
  }

  removeFavorite(book: IBook) {
    this.favoriteExternalIds = this.favoriteExternalIds.filter((id) => id !== book.externalId);

    const favoriteToRemove = this.favorites.find((fav) => fav.externalId === book.externalId);

    if (favoriteToRemove) {
      const favoriteId = favoriteToRemove.id;

      this.favoriteBookService.removeFavorite(favoriteId).subscribe({
        next: (success) => {
          if (success) {
            this.favoriteExternalIds = this.favoriteExternalIds.filter(
              (id) => id !== book.externalId
            );
            this.favorites = this.favorites.filter((fav) => fav.id !== favoriteToRemove.id);
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: 'Quitado de favoritos',
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            Swal.fire('Error', 'No se pudo eliminar el favorito del servidor', 'error');
          }
        },
      });
    }
  }

  // Helper para generar el arreglo de números de página en el HTML
  getPagesArray(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  isFavorite(book: IBook): boolean {
    return this.favoriteExternalIds.includes(book.externalId);
  }

  toggleFavorite(book: IBook) {
    if (this.isFavorite(book)) {
      this.removeFavorite(book);
    } else {
      this.addToFavorites(book);
    }
  }

  toFavorite() {
    this.router.navigate(['/book/favorite-book']);
  }
}
