import { Component } from '@angular/core';
import { HeaderSystemComponent } from "../shared/header-system/header-system.component";
import { MenuLateralSystemComponent } from "../shared/menu-lateral-system/menu-lateral-system.component";
import { Menu1Component } from './menu1/menu1.component';
import { Menu2Component } from "./menu2/menu2.component";

@Component({
  selector: 'app-gestor',
  imports: [HeaderSystemComponent, MenuLateralSystemComponent, Menu1Component, Menu2Component],
  templateUrl: './gestor.component.html',
  styleUrl: './gestor.component.css'
})
export class GestorComponent {

}
