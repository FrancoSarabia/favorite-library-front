import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { BookCatalogService } from '../../services/book-catalog.service';
import { IBook } from '../../interfaces/book.interface';
import { FavoriteBookService } from '../../services/favorite-book.service';
import { STORAGE_KEY } from '../../../shared/consts/storage.const';
import { IFavoriteBook } from '../../interfaces/favorite-book.interface';

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
  public favorites: IFavoriteBook[] = [];
  public searchForm!: FormGroup;
  public books: IBook[] = [];
  public selectedBook?: IBook;
  public isLoading: boolean = false;

  // Variables de paginación
  public currentPage: number = 1;
  public totalPages: number = 0;
  public pageSize: number = 20;
  public totalItems: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const saved = this.bookCatalogService.lastSearch;
    this.searchForm = this.fb.group({
      title: [saved.title, [Validators.required, Validators.minLength(3)]],
      author: [saved.author, [Validators.required, Validators.minLength(3)]],
    });

    this.loadState();
    this.loadBooks();
  }

  loadBooks() {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (!userData) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const userId = JSON.parse(userData).id;

    this.favoriteBookService.getFavoritesByUser(userId).subscribe({
      next: (favs: IFavoriteBook[]) => {
        this.favorites = favs;
        this.favoriteExternalIds = favs.map((f: any) => f.externalId);
      },
      error: (err) => {
        console.error('Error obteniendo favoritos', err);
        localStorage.removeItem(STORAGE_KEY);
        this.router.navigate(['/auth/login']);
      },
    });
  }

  loadState() {
    // Recuperar resultados previos si existen
    if (this.bookCatalogService.lastSearch.books.length > 0) {
      this.books = this.bookCatalogService.lastSearch.books;
      this.currentPage = this.bookCatalogService.lastSearch.currentPage;
      this.totalPages = this.bookCatalogService.lastSearch.totalPages;
      this.totalItems = this.bookCatalogService.lastSearch.totalItems;
    }

    console.log(this.currentPage);
    console.log(this.totalPages);
    console.log(this.totalItems);
  }

  searchBooks(page: number = 1) {
    const { title, author } = this.searchForm.value;
    this.currentPage = page;

    this.isLoading = true;

    this.bookCatalogService.searchBooks(title, author, page, this.pageSize).subscribe({
      next: (data: any) => {
        this.books = data.items;
        this.totalItems = data.total;
        this.totalPages = Math.ceil(data.total / this.pageSize);

        // GUARDAR ESTADO EN EL SERVICIO
        this.bookCatalogService.lastSearch = {
          title,
          author,
          books: this.books,
          currentPage: this.currentPage,
          totalPages: this.totalPages,
          totalItems: this.totalItems,
        };

        this.getPagesArray(this.currentPage, this.totalPages);

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', 'No se pudo cargar la información buscada', err);
      },
    });
  }

  addToFavorites(book: IBook) {
    console.log('Libro añadido a favoritos:', book);
    const userData = localStorage.getItem(STORAGE_KEY);

    if (!userData) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const user = JSON.parse(userData);
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
      error: (err) => {
        Swal.fire('Error', err.message ?? 'No se pudo agregar el favorito', 'error');
      },
    });
  }

  removeFavorite(book: IBook) {
    this.favoriteExternalIds = this.favoriteExternalIds.filter((id) => id !== book.externalId);

    const favoriteToRemove = this.favorites.find((fav) => fav.externalId === book.externalId);

    if (!favoriteToRemove) {
      Swal.fire('Error', 'No se pudo agregar eliminar de favoritos', 'error');
      return;
    }

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
        }
      },
      error: (err) => {
        Swal.fire('Error', err.message ?? 'No se pudo eliminar de favoritos', 'error');
      },
    });
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que volver a ingresar para ver tus favoritos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3e4684',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // 1. Limpiar el localStorage
        localStorage.removeItem(STORAGE_KEY);

        // 2. LIMPIAR EL ESTADO DEL SERVICIO (Importante para tu persistencia)
        this.bookCatalogService.lastSearch = {
          title: '',
          author: '',
          books: [],
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
        };

        // 3. Redirigir al login
        this.router.navigate(['/auth/login']);
      }
    });
  }

  openDetail(book: IBook) {
    this.selectedBook = book;
  }

  // Helper para generar el arreglo de números de página en el HTML
  getPagesArray(currentPage?: number, totalPages?: number): number[] {
    if (!currentPage) currentPage = this.currentPage;
    if (!totalPages) totalPages = this.totalPages;

    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);

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
