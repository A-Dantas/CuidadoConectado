import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer_home/footer.component';
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
    'img/carrosel/foto_carrosel_4.jpg',
    'img/carrosel/foto_carrosel_3.jpg',
    'img/carrosel/foto_carrosel_1.jpg',
    'img/carrosel/foto_carrosel_5.jpg',
    'img/carrosel/foto_carrosel_2.jpg',
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
