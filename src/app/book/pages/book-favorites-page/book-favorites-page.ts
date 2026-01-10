import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { IFavoriteBookResponse } from '../../interfaces/favorite-book-response.interface';
import { FavoriteBookService } from '../../services/favorite-book.service';
import { STORAGE_KEY } from '../../../shared/consts/storage.const';

@Component({
  selector: 'app-book-favorites-page',
  standalone: false,
  templateUrl: './book-favorites-page.html',
  styleUrl: './book-favorites-page.css',
})
export class BookFavoritesPage implements OnInit {
  private favoriteBookService = inject(FavoriteBookService);
  private router = inject(Router);

  public favorites: IFavoriteBookResponse[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites() {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (userData) {
      const userId = JSON.parse(userData).id;

      this.favoriteBookService.getFavoritesByUser(userId).subscribe((favs) => {
        this.favorites = favs;
      });
    } else this.router.navigate(['/auth/login']);
  }

  removeFavorite(favorite: IFavoriteBookResponse) {
    const favoriteToRemove = this.favorites.find((fav) => fav.id === favorite.id);

    if (favoriteToRemove) {
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
            } else {
              Swal.fire('Error', 'No se pudo eliminar el favorito.', 'error');
            }
          },
        });
      });
    } else {
      Swal.fire('Error', 'No se pudo eliminar el favorito.', 'error');
    }
  }
}
