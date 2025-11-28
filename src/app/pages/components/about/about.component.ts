import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer_home/footer.component";

@Component({
  selector: 'app-about',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
