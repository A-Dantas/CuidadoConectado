import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService, Paciente } from '../paciente.service';
import { UsuarioService, Usuario } from '../usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu2',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu2.component.html',
  styleUrl: './menu2.component.css'
})
export class Menu2Component implements OnInit, OnDestroy {
  pacientes: Paciente[] = [];
  private subscription: Subscription = new Subscription();

  modalEdicaoAberto: boolean = false;
  modalSucessoEdicaoAberto: boolean = false;
  modalConfirmacaoExclusaoAberto: boolean = false;
  modalSucessoExclusaoAberto: boolean = false;

  // Double-click tracking
  private lastClickTime: number = 0;
  private readonly DOUBLE_CLICK_DELAY = 300; // milliseconds

  pacienteEditando: Paciente = {
    nomePaciente: '',
    idade: null,
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    endereco: '',
    comorbidades: '',
    cuidadorAtribuido: '',
    medicoAtribuido: '',
    contatoFamiliar: ''
  };
  indiceEditando: number = -1;
  indiceExcluindo: number = -1;
  comorbidadesListEdicao: string[] = [''];

  cuidadores: string[] = [];
  medicos: string[] = [];
  familiares: string[] = [];

  // Track which patients have expanded comorbidities
  comorbidadesExpandidas: Set<number> = new Set();

  constructor(
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.pacienteService.getPacientes().subscribe(pacientes => {
        this.pacientes = pacientes;
      })
    );

    this.subscription.add(
      this.usuarioService.getUsuarios().subscribe(usuarios => {
        this.atualizarListasUsuarios(usuarios);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  atualizarListasUsuarios(usuarios: Usuario[]): void {
    this.cuidadores = usuarios
      .filter(u => u.role === 'Caregiver')
      .map(u => u.userName);

    this.medicos = usuarios
      .filter(u => u.role === 'Doctor')
      .map(u => u.userName);

    this.familiares = usuarios
      .filter(u => u.role === 'Family Member')
      .map(u => u.userName);
  }

  handleOverlayClick(): void {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastClickTime;

    if (timeDiff < this.DOUBLE_CLICK_DELAY) {
      // Double-click detected
      if (this.modalEdicaoAberto) this.fecharModalEdicao();
      else if (this.modalConfirmacaoExclusaoAberto) this.fecharModalConfirmacaoExclusao();
      else if (this.modalSucessoEdicaoAberto) this.fecharModalSucessoEdicao();
      else if (this.modalSucessoExclusaoAberto) this.fecharModalSucessoExclusao();
    }

    this.lastClickTime = currentTime;
  }

  getComorbidadesArray(comorbidades: string): string[] {
    if (!comorbidades || comorbidades.trim() === '') {
      return [];
    }
    return comorbidades.split(',').map(c => c.trim()).filter(c => c.length > 0);
  }

  toggleComorbidades(index: number): void {
    if (this.comorbidadesExpandidas.has(index)) {
      this.comorbidadesExpandidas.delete(index);
    } else {
      this.comorbidadesExpandidas.add(index);
    }
  }

  isComorbidadesExpandido(index: number): boolean {
    return this.comorbidadesExpandidas.has(index);
  }

  abrirModalEdicao(paciente: Paciente, index: number): void {
    this.pacienteEditando = { ...paciente };
    this.indiceEditando = index;

    // Carregar comorbidades em array
    const comorbidades = this.getComorbidadesArray(paciente.comorbidades);
    this.comorbidadesListEdicao = comorbidades.length > 0 ? comorbidades : [''];

    this.modalEdicaoAberto = true;
  }

  fecharModalEdicao(): void {
    this.modalEdicaoAberto = false;
    this.resetarFormularioEdicao();
  }

  resetarFormularioEdicao(): void {
    this.pacienteEditando = {
      nomePaciente: '',
      idade: null,
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      endereco: '',
      comorbidades: '',
      cuidadorAtribuido: '',
      medicoAtribuido: '',
      contatoFamiliar: ''
    };
    this.indiceEditando = -1;
    this.comorbidadesListEdicao = [''];
  }

  adicionarComorbidadeEdicao(): void {
    this.comorbidadesListEdicao.push('');
  }

  removerComorbidadeEdicao(index: number): void {
    if (this.comorbidadesListEdicao.length > 1) {
      this.comorbidadesListEdicao.splice(index, 1);
    }
  }

  salvarEdicao(): void {
    if (this.pacienteEditando.nomePaciente.trim() && this.indiceEditando >= 0) {
      // Gerar endereço completo
      const enderecoCompleto = [
        this.pacienteEditando.rua,
        this.pacienteEditando.numero,
        this.pacienteEditando.bairro,
        this.pacienteEditando.cidade,
        this.pacienteEditando.estado
      ].filter(part => part && part.trim()).join(', ');

      this.pacienteEditando.endereco = enderecoCompleto;

      // Gerar string de comorbidades
      const comorbidadesValidas = this.comorbidadesListEdicao
        .map(c => c.trim())
        .filter(c => c.length > 0);
      this.pacienteEditando.comorbidades = comorbidadesValidas.join(', ');

      this.pacienteService.editarPaciente(this.indiceEditando, { ...this.pacienteEditando });
      this.fecharModalEdicao();
      this.modalSucessoEdicaoAberto = true;
    }
  }

  abrirModalConfirmacaoExclusao(index: number): void {
    this.indiceExcluindo = index;
    this.modalConfirmacaoExclusaoAberto = true;
  }

  fecharModalConfirmacaoExclusao(): void {
    this.modalConfirmacaoExclusaoAberto = false;
    this.indiceExcluindo = -1;
  }

  confirmarExclusao(): void {
    if (this.indiceExcluindo >= 0) {
      this.pacienteService.excluirPaciente(this.indiceExcluindo);
      this.fecharModalConfirmacaoExclusao();
      this.modalSucessoExclusaoAberto = true;
    }
  }

  fecharModalSucessoExclusao(): void {
    this.modalSucessoExclusaoAberto = false;
  }

  fecharModalSucessoEdicao(): void {
    this.modalSucessoEdicaoAberto = false;
  }
}
