import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService, Paciente } from '../paciente.service';
import { UsuarioService, Usuario } from '../usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu1',
  imports: [FormsModule, CommonModule],
  templateUrl: './menu1.component.html',
  styleUrl: './menu1.component.css'
})
export class Menu1Component implements OnInit, OnDestroy {
  modalAberto: boolean = false;
  modalSucessoAberto: boolean = false;
  modalUsuarioAberto: boolean = false;
  modalSucessoUsuarioAberto: boolean = false;

  quantidadePacientes: number = 0;
  quantidadeUsuarios: number = 0;
  private subscription: Subscription = new Subscription();

  novoPaciente: Paciente = {
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

  comorbidadesList: string[] = [''];

  novoUsuario: Usuario = {
    userName: '',
    email: '',
    role: 'Caregiver'
  };

  cuidadores: string[] = [];
  medicos: string[] = [];
  familiares: string[] = [];
  roles: string[] = ['Caregiver', 'Doctor', 'Family Member'];

  constructor(
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.pacienteService.getPacientes().subscribe(pacientes => {
        this.quantidadePacientes = pacientes.length;
      })
    );

    this.subscription.add(
      this.usuarioService.getUsuarios().subscribe(usuarios => {
        this.quantidadeUsuarios = usuarios.length;
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

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.resetarFormulario();
  }

  resetarFormulario(): void {
    this.novoPaciente = {
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
    this.comorbidadesList = [''];
  }

  adicionarComorbidade(): void {
    this.comorbidadesList.push('');
  }

  removerComorbidade(index: number): void {
    if (this.comorbidadesList.length > 1) {
      this.comorbidadesList.splice(index, 1);
    }
  }

  adicionarPaciente(): void {
    if (this.novoPaciente.nomePaciente.trim()) {
      // Gerar endereço completo
      const enderecoCompleto = [
        this.novoPaciente.rua,
        this.novoPaciente.numero,
        this.novoPaciente.bairro,
        this.novoPaciente.cidade,
        this.novoPaciente.estado
      ].filter(part => part.trim()).join(', ');

      this.novoPaciente.endereco = enderecoCompleto;

      // Gerar string de comorbidades
      const comorbidadesValidas = this.comorbidadesList
        .map(c => c.trim())
        .filter(c => c.length > 0);
      this.novoPaciente.comorbidades = comorbidadesValidas.join(', ');

      this.pacienteService.adicionarPaciente({ ...this.novoPaciente });
      this.fecharModal();
      this.modalSucessoAberto = true;
    }
  }

  fecharModalSucesso(): void {
    this.modalSucessoAberto = false;
  }

  abrirModalUsuario(): void {
    this.modalUsuarioAberto = true;
  }

  fecharModalUsuario(): void {
    this.modalUsuarioAberto = false;
    this.resetarFormularioUsuario();
  }

  resetarFormularioUsuario(): void {
    this.novoUsuario = {
      userName: '',
      email: '',
      role: 'Caregiver'
    };
  }

  adicionarUsuario(): void {
    if (this.novoUsuario.userName.trim() && this.novoUsuario.email.trim()) {
      this.usuarioService.adicionarUsuario({ ...this.novoUsuario });
      this.fecharModalUsuario();
      this.modalSucessoUsuarioAberto = true;
    }
  }

  fecharModalSucessoUsuario(): void {
    this.modalSucessoUsuarioAberto = false;
  }
}
