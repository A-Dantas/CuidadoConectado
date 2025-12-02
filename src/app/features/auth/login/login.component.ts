import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer_home/footer.component';

@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
