import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, RouterLink, NgIf],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuBranco = false;
  isHome = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isHome = this.router.url.startsWith('/home') || this.router.url === '/';
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.menuBranco = window.scrollY > 80;
  }
}
