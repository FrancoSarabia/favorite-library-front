import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  standalone: false
})
export class MainLayoutComponent {
  backgroundColor = signal<string>('#e7f2fd');

  changeBackgroundColor = (color: string) => {
    this.backgroundColor.set(color);
  }
}
