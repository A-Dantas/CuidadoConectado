import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-header-system',
  imports: [RouterModule],
  templateUrl: './header-system.component.html',
  styleUrl: './header-system.component.css'
})
export class HeaderSystemComponent {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.sair();
  }
}
