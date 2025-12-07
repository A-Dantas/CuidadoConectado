import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface DadosGestor {
  nome: string;
  email: string;
  telefone: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _estaLogado = signal<boolean>(false);
  estaLogado = this._estaLogado.asReadonly();

  private _perfil = signal<string | null>(null);
  perfil = this._perfil.asReadonly();

  private senhaGestor = '123456'; // Senha padrão inicial

  private dadosGestor: DadosGestor = {
    nome: 'Administrador',
    email: 'admin@cuidado.com',
    telefone: '(11) 99999-9999'
  };

  constructor(private router: Router) {
    if (sessionStorage.getItem('estaLogado') === 'true') {
      this._estaLogado.set(true);
      this._perfil.set(sessionStorage.getItem('perfil'));
    }

    // Carrega senha personalizada se existir
    const senhaSalva = localStorage.getItem('senhaGestor');
    if (senhaSalva) {
      this.senhaGestor = senhaSalva;
    }

    // Carrega dados do perfil se existirem
    const dadosSalvos = localStorage.getItem('dadosGestor');
    if (dadosSalvos) {
      this.dadosGestor = JSON.parse(dadosSalvos);
    }
  }


  entrar(usuario: string, senha: string): boolean {
    if (usuario === 'gestor' && senha === this.senhaGestor) {
      this._estaLogado.set(true);
      this._perfil.set('gestor');

      sessionStorage.setItem('estaLogado', 'true');
      sessionStorage.setItem('perfil', 'gestor');

      this.router.navigate(['/gestor']);
      return true;
    }

    this._estaLogado.set(false);
    this._perfil.set(null);
    sessionStorage.removeItem('estaLogado');
    sessionStorage.removeItem('perfil');
    return false;
  }

  sair(): void {
    this._estaLogado.set(false);
    this._perfil.set(null);

    // Remove apenas as chaves de autenticação, mantendo os dados da sessão (pacientes, chat, etc)
    // até que a aba seja fechada.
    sessionStorage.removeItem('estaLogado');
    sessionStorage.removeItem('perfil');

    this.router.navigate(['/login']);
  }

  atualizarSenhaGestor(novaSenha: string): void {
    this.senhaGestor = novaSenha;
    localStorage.setItem('senhaGestor', novaSenha);
  }

  getDadosGestor(): DadosGestor {
    return { ...this.dadosGestor };
  }

  atualizarDadosGestor(novosDados: DadosGestor): void {
    this.dadosGestor = { ...this.dadosGestor, ...novosDados };
    localStorage.setItem('dadosGestor', JSON.stringify(this.dadosGestor));
  }
}