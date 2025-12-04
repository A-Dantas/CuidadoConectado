import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu-lateral-system',
  imports: [],
  templateUrl: './menu-lateral-system.component.html',
  styleUrl: './menu-lateral-system.component.css'
})
export class MenuLateralSystemComponent {
  menuSelecionado: number = 1;

  @Output() menuSelecionadoChange = new EventEmitter<number>();

  selecionarMenu(numeroMenu: number): void {
    this.menuSelecionado = numeroMenu;
    this.menuSelecionadoChange.emit(numeroMenu);
  }
}
