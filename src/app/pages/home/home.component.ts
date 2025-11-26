import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header_home/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./components/footer_home/footer.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
