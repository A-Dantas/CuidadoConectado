import { Component } from '@angular/core';
import { HeaderSystemComponent } from "../shared/header-system/header-system.component";
import { MenuLateralSystemComponent } from "../shared/menu-lateral-system/menu-lateral-system.component";
import { HeaderComponent } from "../../../../shared/header/header.component";

@Component({
  selector: 'app-gestor',
  imports: [HeaderSystemComponent, MenuLateralSystemComponent, HeaderComponent],
  templateUrl: './gestor.component.html',
  styleUrl: './gestor.component.css'
})
export class GestorComponent {

}
