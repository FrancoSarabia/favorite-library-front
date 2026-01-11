import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { IFavoriteBook } from '../../interfaces/favorite-book.interface';
import { FavoriteBookService } from '../../services/favorite-book.service';
import { STORAGE_KEY } from '../../../shared/consts/storage.const';
import { IPaginatedFavoriteBooks } from '../../interfaces/paginated-favorite-books.interface';
import { BookCatalogService } from '../../services/book-catalog.service';

@Component({
  selector: 'app-book-favorites-page',
  standalone: false,
  templateUrl: './book-favorites-page.html',
  styleUrl: './book-favorites-page.css',
})
export class BookFavoritesPage implements OnInit {
  private favoriteBookService = inject(FavoriteBookService);
  private bookCatalogService = inject(BookCatalogService);
  private router = inject(Router);

  public favorites: IFavoriteBook[] = [];

  // Variables de paginación
  public currentPage: number = 1;
  public totalPages: number = 0;
  public pageSize: number = 10;
  public totalItems: number = 0;
  public selectedBook?: IFavoriteBook;
  public isLoading: boolean = false;
  public userName: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(page: number = 1, pageSize: number = 10) {
    const userData = localStorage.getItem(STORAGE_KEY);

    if (!userData) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.userName = JSON.parse(userData).firstName + ' ' + JSON.parse(userData).lastName;
    const userId = JSON.parse(userData).id;

    this.isLoading = true;

    this.favoriteBookService.getFavoritesByUserPaginated(userId, page, pageSize).subscribe({
      next: (favs: IPaginatedFavoriteBooks) => {
        this.favorites = favs.items;
        this.totalItems = favs.total;
        this.totalPages = Math.ceil(favs.total / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', 'No se pudo cargar la información buscada', err);
      },
    });
  }

  removeFavorite(favorite: IFavoriteBook) {
    const favoriteToRemove = this.favorites.find((fav) => fav.id === favorite.id);

    if (!favoriteToRemove) {
      Swal.fire('Error', 'No se pudo agregar eliminar de favoritos', 'error');
      return;
    }
    const favoriteId = favoriteToRemove.id;

    Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Estas seguro?`,
      icon: 'question',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#ef4444',
    }).then((result) => {
      this.favoriteBookService.removeFavorite(favoriteId).subscribe({
        next: (success) => {
          if (success) {
            this.favorites = this.favorites.filter((fav) => fav.id !== favoriteToRemove.id);
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: 'Quitado de favoritos',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        },
        error: (err) => {
          Swal.fire('Error', err.message ?? 'No se pudo eliminar de favoritos', 'error');
        }
      });
    });
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Se cerrará tu sesión actual.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3e4684',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // 1. Limpiar sesión
        localStorage.removeItem(STORAGE_KEY);

        // 2. Limpiar el estado de búsqueda para que no quede basura al re-ingresar
        this.bookCatalogService.lastSearch = {
          title: '',
          author: '',
          books: [],
          currentPage: 1,
          totalPages: 0,
          totalItems: 0
        };

        // 3. Redirigir
        this.router.navigate(['/auth/login']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/book/book-catalog']);
  }

  searchBooks(page: number = 1) {
    this.currentPage = page;
    this.loadFavorites(page, this.pageSize);
  }

  openDetail(book: IFavoriteBook) {
    this.selectedBook = book;
  }

  getPagesArray(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
