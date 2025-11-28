import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [RouterModule, RouterLink],
  standalone: true,
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
