import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer_home/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forms',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {

}
