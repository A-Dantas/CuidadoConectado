import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _estaLogado = signal<boolean>(false);
  estaLogado = this._estaLogado.asReadonly();

  private _perfil = signal<string | null>(null);
  perfil = this._perfil.asReadonly();

  constructor(private router: Router) {
    if (sessionStorage.getItem('estaLogado') === 'true') {
      this._estaLogado.set(true);
      this._perfil.set(sessionStorage.getItem('perfil'));
    }
  }


  entrar(usuario: string, senha: string): boolean {
    if (usuario === 'gestor' && senha === '123456') {
      this._estaLogado.set(true);
      this._perfil.set('gestor');

      sessionStorage.setItem('estaLogado', 'true');
      sessionStorage.setItem('perfil', 'gestor');

      this.router.navigate(['/gestor']);
      return true;
    }

    this._estaLogado.set(false);
    this._perfil.set(null);
    sessionStorage.clear();
    return false;
  }

  sair(): void {
    this._estaLogado.set(false);
    this._perfil.set(null);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}