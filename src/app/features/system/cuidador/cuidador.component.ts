import { Component } from '@angular/core';
import { HeaderSystemComponent } from '../shared/header-system/header-system.component';
import { MenuLateralSystemComponent } from '../shared/menu-lateral-system/menu-lateral-system.component';
import { MenuCuidador1Component } from './menu-cuidador-1/menu-cuidador-1.component';
import { MenuCuidador2Component } from './menu-cuidador-2/menu-cuidador-2.component';
import { MenuCuidador3Component } from './menu-cuidador-3/menu-cuidador-3.component';
import { MenuCuidador4Component } from './menu-cuidador-4/menu-cuidador-4.component';

@Component({
  selector: 'app-cuidador',
  imports: [
    HeaderSystemComponent,
    MenuLateralSystemComponent,
    MenuCuidador1Component,
    MenuCuidador2Component,
    MenuCuidador3Component,
    MenuCuidador4Component
  ],
  templateUrl: './cuidador.component.html',
  styleUrl: './cuidador.component.css'
})
export class CuidadorComponent {
  menuAtivo: number = 1;

  onMenuChange(menuId: number) {
    this.menuAtivo = menuId;
  }
}
