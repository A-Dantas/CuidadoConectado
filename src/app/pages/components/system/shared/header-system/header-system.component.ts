import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuLateralSystemComponent } from "../menu-lateral-system/menu-lateral-system.component";

@Component({
  selector: 'app-header-system',
  imports: [RouterModule, MenuLateralSystemComponent],
  templateUrl: './header-system.component.html',
  styleUrl: './header-system.component.css'
})
export class HeaderSystemComponent {

}
