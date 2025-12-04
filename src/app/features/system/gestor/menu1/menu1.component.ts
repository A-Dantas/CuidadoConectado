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

  // Double-click tracking
  private lastClickTime: number = 0;
  private readonly DOUBLE_CLICK_DELAY = 300; // milliseconds

  // Cadastro rápido
  mostrarCadastroCuidador: boolean = false;
  mostrarCadastroMedico: boolean = false;
  mostrarCadastroFamiliar: boolean = false;

  novoPaciente: Paciente = {
    nomePaciente: '',
    dataNascimento: '',
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
    sobrenome: '',
    email: '',
    role: 'Caregiver',
    dataNascimento: '',
    idade: undefined,
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    endereco: '',
    chavePix: '',
    whatsapp: '',
    tempoExperiencia: '',
    experienciaComorbidades: '',
    tipoUsuario: '',
    experienciaComorbidadesList: ['']
  };

  experienciaComorbidadesUsuarioList: string[] = [''];

  novoCuidador: Usuario = {
    userName: '',
    sobrenome: '',
    email: '',
    role: 'Caregiver',
    dataNascimento: '',
    idade: undefined,
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    endereco: '',
    chavePix: '',
    whatsapp: '',
    tempoExperiencia: '',
    experienciaComorbidades: ''
  };

  experienciaComorbidadesList: string[] = [''];

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

  handleOverlayClick(): void {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastClickTime;

    if (timeDiff < this.DOUBLE_CLICK_DELAY) {
      // Double-click detected
      if (this.modalAberto) this.fecharModal();
      else if (this.modalUsuarioAberto) this.fecharModalUsuario();
      else if (this.modalSucessoAberto) this.fecharModalSucesso();
      else if (this.modalSucessoUsuarioAberto) this.fecharModalSucessoUsuario();
    }

    this.lastClickTime = currentTime;
  }

  selecionarOpcaoCuidador(event: any): void {
    const valor = event.target.value;
    if (valor === 'CADASTRAR_NOVO') {
      this.mostrarCadastroCuidador = true;
      this.novoPaciente.cuidadorAtribuido = '';
    } else {
      this.mostrarCadastroCuidador = false;
      this.novoPaciente.cuidadorAtribuido = valor;
    }
  }

  salvarNovoCuidador(): void {
    if (this.novoCuidador.userName.trim() && this.novoCuidador.email.trim()) {
      // Gerar endereço completo
      const enderecoCompleto = [
        this.novoCuidador.rua,
        this.novoCuidador.numero,
        this.novoCuidador.bairro,
        this.novoCuidador.cidade,
        this.novoCuidador.estado
      ].filter(part => part && part.trim()).join(', ');

      this.novoCuidador.endereco = enderecoCompleto;

      // Gerar string de comorbidades de experiência
      const comorbidadesValidas = this.experienciaComorbidadesList
        .map(c => c.trim())
        .filter(c => c.length > 0);
      this.novoCuidador.experienciaComorbidades = comorbidadesValidas.join(', ');

      // Adicionar usuário
      this.usuarioService.adicionarUsuario({ ...this.novoCuidador });

      // Atribuir ao paciente
      this.novoPaciente.cuidadorAtribuido = this.novoCuidador.userName;

      // Ocultar seção e resetar
      this.mostrarCadastroCuidador = false;
      this.resetarFormularioCuidador();
    }
  }

  cancelarCadastroCuidador(): void {
    this.mostrarCadastroCuidador = false;
    this.resetarFormularioCuidador();
  }

  resetarFormularioCuidador(): void {
    this.novoCuidador = {
      userName: '',
      sobrenome: '',
      email: '',
      role: 'Caregiver',
      dataNascimento: '',
      idade: undefined,
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      endereco: '',
      chavePix: '',
      whatsapp: '',
      tempoExperiencia: '',
      experienciaComorbidades: ''
    };
    this.experienciaComorbidadesList = [''];
  }

  adicionarExperienciaComorbidade(): void {
    this.experienciaComorbidadesList.push('');
  }

  removerExperienciaComorbidade(index: number): void {
    if (this.experienciaComorbidadesList.length > 1) {
      this.experienciaComorbidadesList.splice(index, 1);
    }
  }

  // Métodos para comorbidades do modal de usuário principal
  adicionarExperienciaComorbidadeUsuario(): void {
    this.experienciaComorbidadesUsuarioList.push('');
  }

  removerExperienciaComorbidadeUsuario(index: number): void {
    if (this.experienciaComorbidadesUsuarioList.length > 1) {
      this.experienciaComorbidadesUsuarioList.splice(index, 1);
    }
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
      dataNascimento: '',
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
    this.mostrarCadastroCuidador = false;
    this.resetarFormularioCuidador();
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
      sobrenome: '',
      email: '',
      role: 'Caregiver',
      dataNascimento: '',
      idade: undefined,
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      endereco: '',
      chavePix: '',
      whatsapp: '',
      tempoExperiencia: '',
      experienciaComorbidades: '',
      tipoUsuario: '',
      experienciaComorbidadesList: ['']
    };
    this.experienciaComorbidadesUsuarioList = [''];
  }

  adicionarUsuario(): void {
    if (this.novoUsuario.userName.trim() && this.novoUsuario.email.trim()) {
      // Gerar endereço completo
      const enderecoCompleto = [
        this.novoUsuario.rua,
        this.novoUsuario.numero,
        this.novoUsuario.bairro,
        this.novoUsuario.cidade,
        this.novoUsuario.estado
      ].filter(part => part && part.trim()).join(', ');

      this.novoUsuario.endereco = enderecoCompleto;

      // Gerar string de comorbidades de experiência se for cuidador
      if (this.novoUsuario.tipoUsuario === 'cuidador') {
        const comorbidadesValidas = (this.novoUsuario.experienciaComorbidadesList || [''])
          .map(c => c.trim())
          .filter(c => c.length > 0);
        this.novoUsuario.experienciaComorbidades = comorbidadesValidas.join(', ');
      }

      // Mapear tipoUsuario para role
      if (this.novoUsuario.tipoUsuario === 'cuidador') {
        this.novoUsuario.role = 'Caregiver';
      } else if (this.novoUsuario.tipoUsuario === 'medico') {
        this.novoUsuario.role = 'Doctor';
      } else if (this.novoUsuario.tipoUsuario === 'familiar') {
        this.novoUsuario.role = 'Family Member';
      }

      this.usuarioService.adicionarUsuario({ ...this.novoUsuario });
      this.fecharModalUsuario();
      this.modalSucessoUsuarioAberto = true;
    }
  }

  fecharModalSucessoUsuario(): void {
    this.modalSucessoUsuarioAberto = false;
  }
}
