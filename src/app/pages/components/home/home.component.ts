import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer_home/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    CommonModule,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  pictures: string[] = [
    'img/carrosel/carrosel_5.jpg',
    'img/carrosel/carrosel_6.jpg',

  ];

  position: number = 0;

  get currentImage(): string {
    return this.pictures[this.position];
  }

  moveRight(): void {
    if (this.position >= this.pictures.length - 1) {
      this.position = 0;
      return;
    }
    this.position++;
  }

  moveLeft(): void {
    if (this.position < 1) {
      this.position = this.pictures.length - 1;
      return;
    }
    this.position--;
  }
}
