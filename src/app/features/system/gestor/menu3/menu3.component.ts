import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu3.component.html',
  styleUrl: './menu3.component.css'
})
export class Menu3Component implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  filtroRole: string = 'Todos';
  private subscription: Subscription = new Subscription();

  get usuariosFiltrados(): Usuario[] {
    const usuariosSemGestor = this.usuarios.filter(u => {
      const role = u.role.toLowerCase();
      return role !== 'manager' && role !== 'gestor';
    });

    if (this.filtroRole === 'Todos') {
      return usuariosSemGestor;
    }
    return usuariosSemGestor.filter(u => u.role === this.filtroRole);
  }

  // Modal states
  modalEdicaoAberto: boolean = false;
  modalConfirmacaoExclusaoAberto: boolean = false;
  modalSucessoEdicaoAberto: boolean = false;
  modalSucessoExclusaoAberto: boolean = false;
  modalCartaoCuidadorAberto: boolean = false;

  // Edit/Delete tracking
  usuarioEditando: Usuario = {
    userName: '',
    sobrenome: '',
    email: '',
    role: '',
    dataNascimento: '',
    idade: undefined,
    telefone: '',
    whatsapp: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    endereco: ''
  };
  cuidadorSelecionado: Usuario | null = null;
  indiceEditando: number = -1;
  indiceExcluindo: number = -1;

  // Double-click tracking for overlay
  private lastClickTime: number = 0;
  private readonly DOUBLE_CLICK_DELAY = 300;

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

  // Método para abrir cartão do cuidador
  abrirModalCartao(usuario: Usuario): void {
    if (usuario.role === 'Caregiver') {
      this.cuidadorSelecionado = usuario;
      this.modalCartaoCuidadorAberto = true;
    }
  }

  fecharModalCartao(): void {
    this.modalCartaoCuidadorAberto = false;
    this.cuidadorSelecionado = null;
  }

  // Métodos para Edição
  abrirModalEdicao(usuario: Usuario, index: number): void {
    // Evita abrir o cartão ao clicar no botão de editar
    // O evento de clique no card deve ser tratado separadamente dos botões de ação
    this.usuarioEditando = { ...usuario };
    this.indiceEditando = index;
    this.modalEdicaoAberto = true;
  }

  fecharModalEdicao(): void {
    this.modalEdicaoAberto = false;
    this.indiceEditando = -1;
    this.resetarUsuarioEditando();
  }

  salvarEdicao(): void {
    if (this.indiceEditando !== -1) {
      this.usuarioService.atualizarUsuario(this.indiceEditando, this.usuarioEditando);
      this.fecharModalEdicao();
      this.modalSucessoEdicaoAberto = true;
    }
  }

  fecharModalSucessoEdicao(): void {
    this.modalSucessoEdicaoAberto = false;
  }

  // Métodos para Exclusão
  abrirModalConfirmacaoExclusao(index: number): void {
    this.indiceExcluindo = index;
    this.modalConfirmacaoExclusaoAberto = true;
  }

  fecharModalConfirmacaoExclusao(): void {
    this.modalConfirmacaoExclusaoAberto = false;
    this.indiceExcluindo = -1;
  }

  confirmarExclusao(): void {
    if (this.indiceExcluindo !== -1) {
      this.usuarioService.removerUsuario(this.indiceExcluindo);
      this.fecharModalConfirmacaoExclusao();
      this.modalSucessoExclusaoAberto = true;
    }
  }

  fecharModalSucessoExclusao(): void {
    this.modalSucessoExclusaoAberto = false;
  }

  // Utilitários
  handleOverlayClick(): void {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastClickTime;

    if (timeDiff < this.DOUBLE_CLICK_DELAY) {
      if (this.modalEdicaoAberto) this.fecharModalEdicao();
      else if (this.modalConfirmacaoExclusaoAberto) this.fecharModalConfirmacaoExclusao();
      else if (this.modalSucessoEdicaoAberto) this.fecharModalSucessoEdicao();
      else if (this.modalSucessoExclusaoAberto) this.fecharModalSucessoExclusao();
      else if (this.modalCartaoCuidadorAberto) this.fecharModalCartao();
    }

    this.lastClickTime = currentTime;
  }

  // Validações e Formatações
  validarNome(event: any, campo: string, objeto: any): void {
    const valor = event.target.value;
    const valorSemNumeros = valor.replace(/[0-9]/g, '');
    objeto[campo] = valorSemNumeros;
    event.target.value = valorSemNumeros;
  }

  formatarTelefone(event: any, campo: string, objeto: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }
    let valorFormatado = '';
    if (valor.length > 0) {
      valorFormatado = '(' + valor.substring(0, 2);
    }
    if (valor.length >= 3) {
      valorFormatado += ') ' + valor.substring(2, 7);
    }
    if (valor.length >= 8) {
      valorFormatado += '-' + valor.substring(7, 11);
    }
    objeto[campo] = valorFormatado;
    event.target.value = valorFormatado;
  }

  calcularIdade(dataNascimento: string | undefined): number | undefined {
    if (!dataNascimento) return undefined;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade >= 0 ? idade : undefined;
  }

  atualizarIdadeUsuario(): void {
    this.usuarioEditando.idade = this.calcularIdade(this.usuarioEditando.dataNascimento);
  }

  // Método para traduzir role
  traduzirRole(role: string): string {
    const traducoes: { [key: string]: string } = {
      'Caregiver': 'Cuidador',
      'Doctor': 'Médico',
      'Family Member': 'Familiar'
    };
    return traducoes[role] || role;
  }

  // Métodos para comorbidades (Cuidador)
  adicionarExperienciaComorbidadeUsuario(): void {
    if (!this.usuarioEditando.experienciaComorbidadesList) {
      this.usuarioEditando.experienciaComorbidadesList = [];
    }
    this.usuarioEditando.experienciaComorbidadesList.push('');
  }

  removerExperienciaComorbidadeUsuario(index: number): void {
    if (this.usuarioEditando.experienciaComorbidadesList && this.usuarioEditando.experienciaComorbidadesList.length > 0) {
      this.usuarioEditando.experienciaComorbidadesList.splice(index, 1);
    }
  }

  private resetarUsuarioEditando(): void {
    this.usuarioEditando = {
      userName: '',
      sobrenome: '',
      email: '',
      role: '',
      dataNascimento: '',
      idade: undefined,
      telefone: '',
      whatsapp: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      endereco: '',
      chavePix: '',
      tempoExperiencia: '',
      experienciaComorbidadesList: ['']
    };
  }
}
