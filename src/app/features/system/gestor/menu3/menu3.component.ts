import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService, Usuario } from '../usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu3.component.html',
  styleUrl: './menu3.component.css'
})
export class Menu3Component implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.usuarioService.getUsuarios().subscribe(usuarios => {
        this.usuarios = usuarios;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
