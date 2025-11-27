import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // menuOpen = false;
  // scrolled = false;
  menuBranco = false;

  // toggleMenu() {
  //   this.menuOpen = !this.menuOpen;
  // }

  // closeMenu() {
  //   this.menuOpen = false;
  // }

  @HostListener('window:scroll', [])
  onWindowScroll() {
  
    if (window.scrollY > 80) {
      this.menuBranco = true;
    } else {
      this.menuBranco = false;
    }
  }
}
