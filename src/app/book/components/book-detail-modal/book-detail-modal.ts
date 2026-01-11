import { Component, Input } from '@angular/core';

import { IBook } from '../../interfaces/book.interface';

@Component({
  selector: 'book-detail-modal',
  standalone: false,
  templateUrl: './book-detail-modal.html',
  styleUrl: './book-detail-modal.css',
})
export class BookDetailModal {

  @Input() book?: IBook;
}
