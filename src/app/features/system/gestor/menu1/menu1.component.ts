import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService, Paciente } from '../paciente.service';
import { UsuarioService, Usuario } from '../usuario.service';
import { ChatService, MensagemGeral } from '../../shared/services/chat.service';
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
  mensagensRecentes: MensagemGeral[] = [];
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

  novoMedico: Usuario = {
    userName: '',
    sobrenome: '',
    email: '',
    role: 'Doctor',
    dataNascimento: '',
    idade: undefined,
    telefone: '',
    whatsapp: ''
  } as Usuario;

  novoFamiliar: Usuario = {
    userName: '',
    sobrenome: '',
    email: '',
    role: 'Family Member',
    dataNascimento: '',
    idade: undefined,
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    endereco: '',
    whatsapp: ''
  } as Usuario;



  errosPaciente: any = {};
  errosUsuario: any = {};

  experienciaComorbidadesList: string[] = [''];

  cuidadores: string[] = [];
  medicos: string[] = [];
  familiares: string[] = [];
  roles: string[] = ['Caregiver', 'Doctor', 'Family Member'];

  constructor(
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService,
    private chatService: ChatService
  ) { }

  validarData(data: string | undefined): boolean {
    if (!data) return false;
    const partes = data.split('-');
    if (partes.length !== 3) return false;
    const ano = parseInt(partes[0]);
    return ano >= 1900 && ano <= 9999;
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

  // Validação de nome - não permite números
  validarNome(event: any, campo: string, objeto: any): void {
    const valor = event.target.value;
    const valorSemNumeros = valor.replace(/[0-9]/g, '');
    objeto[campo] = valorSemNumeros;
    event.target.value = valorSemNumeros;
  }

  // Validação de email - verifica se contém @
  validarEmail(email: string): boolean {
    return email.includes('@');
  }

  // Formatação de telefone - (XX) XXXXX-XXXX
  formatarTelefone(event: any, campo: string, objeto: any): void {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    if (valor.length > 11) {
      valor = valor.substring(0, 11); // Limita a 11 dígitos
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

  atualizarIdadePaciente(): void {
    this.novoPaciente.idade = this.calcularIdade(this.novoPaciente.dataNascimento) ?? null;
  }

  atualizarIdadeUsuario(): void {
    this.novoUsuario.idade = this.calcularIdade(this.novoUsuario.dataNascimento);
  }

  atualizarIdadeMedico(): void {
    this.novoMedico.idade = this.calcularIdade(this.novoMedico.dataNascimento);
  }

  atualizarIdadeFamiliar(): void {
    this.novoFamiliar.idade = this.calcularIdade(this.novoFamiliar.dataNascimento);
  }

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

    // Subscribe to chat messages
    this.subscription.add(
      this.chatService.mensagensGerais$.subscribe(mensagens => {
        this.mensagensRecentes = this.chatService.getUltimasMensagens(3);
        console.log('Mensagens recentes atualizadas no menu1:', this.mensagensRecentes);
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
    this.errosUsuario = {};

    if (!this.novoCuidador.userName?.trim()) this.errosUsuario.userName = true;
    if (!this.novoCuidador.sobrenome?.trim()) this.errosUsuario.sobrenome = true;
    if (!this.novoCuidador.telefone?.trim()) this.errosUsuario.telefone = true;
    if (!this.novoCuidador.email?.trim()) this.errosUsuario.email = true;
    if (!this.novoCuidador.whatsapp?.trim()) this.errosUsuario.whatsapp = true;
    if (!this.novoCuidador.tempoExperiencia?.trim()) this.errosUsuario.tempoExperiencia = true;

    if (Object.keys(this.errosUsuario).length > 0) return;

    if (this.novoCuidador.userName.trim() && this.novoCuidador.email.trim()) {
      // Validação de email
      if (!this.validarEmail(this.novoCuidador.email)) {
        alert('Email inválido. O email deve conter @');
        return;
      }

      // Validação de data (opcional para cuidador, mas se preenchida deve ser válida)
      if (this.novoCuidador.dataNascimento && !this.validarData(this.novoCuidador.dataNascimento)) {
        alert('Data de nascimento inválida. O ano deve ter 4 dígitos e ser a partir de 1900.');
        return;
      }

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
      this.novoCuidador.experienciaComorbidadesList = comorbidadesValidas; // Salvar array também

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

  selecionarOpcaoMedico(event: any): void {
    const valor = event.target.value;
    if (valor === 'CADASTRAR_NOVO') {
      this.mostrarCadastroMedico = true;
      this.novoPaciente.medicoAtribuido = '';
    } else {
      this.mostrarCadastroMedico = false;
      this.novoPaciente.medicoAtribuido = valor;
    }
  }

  salvarNovoMedico(): void {
    this.errosUsuario = {};

    if (!this.novoMedico.userName?.trim()) this.errosUsuario.userName = true;
    if (!this.novoMedico.sobrenome?.trim()) this.errosUsuario.sobrenome = true;
    if (!this.novoMedico.telefone?.trim()) this.errosUsuario.telefone = true;
    if (!this.novoMedico.whatsapp?.trim()) this.errosUsuario.whatsapp = true;
    if (!this.novoMedico.email?.trim()) this.errosUsuario.email = true;

    if (Object.keys(this.errosUsuario).length > 0) return;

    if (this.novoMedico.userName.trim() && this.novoMedico.email.trim()) {
      // Validação de email
      if (!this.validarEmail(this.novoMedico.email)) {
        alert('Email inválido. O email deve conter @');
        return;
      }


      this.usuarioService.adicionarUsuario({ ...this.novoMedico });
      this.novoPaciente.medicoAtribuido = this.novoMedico.userName;
      this.mostrarCadastroMedico = false;
      this.resetarFormularioMedico();
    }
  }

  cancelarCadastroMedico(): void {
    this.mostrarCadastroMedico = false;
    this.resetarFormularioMedico();
  }

  resetarFormularioMedico(): void {
    this.errosUsuario = {};
    this.novoMedico = {
      userName: '',
      sobrenome: '',
      email: '',
      role: 'Doctor',
      dataNascimento: '',
      idade: undefined,
      telefone: '',
      whatsapp: ''
    } as Usuario;
  }

  selecionarOpcaoFamiliar(event: any): void {
    const valor = event.target.value;
    if (valor === 'CADASTRAR_NOVO') {
      this.mostrarCadastroFamiliar = true;
      this.novoPaciente.contatoFamiliar = '';
    } else {
      this.mostrarCadastroFamiliar = false;
      this.novoPaciente.contatoFamiliar = valor;
    }
  }

  salvarNovoFamiliar(): void {
    this.errosUsuario = {};

    if (!this.novoFamiliar.userName?.trim()) this.errosUsuario.userName = true;
    if (!this.novoFamiliar.sobrenome?.trim()) this.errosUsuario.sobrenome = true;
    if (!this.novoFamiliar.dataNascimento) this.errosUsuario.dataNascimento = true;
    if (!this.novoFamiliar.telefone?.trim()) this.errosUsuario.telefone = true;
    if (!this.novoFamiliar.whatsapp?.trim()) this.errosUsuario.whatsapp = true;
    if (!this.novoFamiliar.email?.trim()) this.errosUsuario.email = true;
    if (!this.novoFamiliar.rua?.trim()) this.errosUsuario.rua = true;
    if (!this.novoFamiliar.numero?.trim()) this.errosUsuario.numero = true;
    if (!this.novoFamiliar.bairro?.trim()) this.errosUsuario.bairro = true;
    if (!this.novoFamiliar.cidade?.trim()) this.errosUsuario.cidade = true;
    if (!this.novoFamiliar.estado?.trim()) this.errosUsuario.estado = true;

    if (Object.keys(this.errosUsuario).length > 0) return;

    if (this.novoFamiliar.userName.trim() && this.novoFamiliar.email.trim()) {
      // Validação de email
      if (!this.validarEmail(this.novoFamiliar.email)) {
        alert('Email inválido. O email deve conter @');
        return;
      }

      if (this.novoFamiliar.dataNascimento && !this.validarData(this.novoFamiliar.dataNascimento)) {
        alert('Data de nascimento inválida. O ano deve ter 4 dígitos e ser a partir de 1900.');
        return;
      }
      // Gerar endereço completo
      const enderecoCompleto = [
        this.novoFamiliar.rua,
        this.novoFamiliar.numero,
        this.novoFamiliar.bairro,
        this.novoFamiliar.cidade,
        this.novoFamiliar.estado
      ].filter(part => part && part.trim()).join(', ');

      this.novoFamiliar.endereco = enderecoCompleto;

      this.usuarioService.adicionarUsuario({ ...this.novoFamiliar });
      this.novoPaciente.contatoFamiliar = this.novoFamiliar.userName;
      this.mostrarCadastroFamiliar = false;
      this.resetarFormularioFamiliar();
    }
  }

  cancelarCadastroFamiliar(): void {
    this.mostrarCadastroFamiliar = false;
    this.resetarFormularioFamiliar();
  }

  resetarFormularioFamiliar(): void {
    this.errosUsuario = {};
    this.novoFamiliar = {
      userName: '',
      sobrenome: '',
      email: '',
      role: 'Family Member',
      dataNascimento: '',
      idade: undefined,
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      endereco: '',
      whatsapp: ''
    } as Usuario;
  }

  resetarFormularioCuidador(): void {
    this.errosUsuario = {};
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
    this.errosPaciente = {};
    this.errosUsuario = {};
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
    this.mostrarCadastroMedico = false;
    this.mostrarCadastroFamiliar = false;
    this.resetarFormularioCuidador();
    this.resetarFormularioMedico();
    this.resetarFormularioFamiliar();
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
    // Resetar erros
    this.errosPaciente = {};

    // Validação de campos obrigatórios
    if (!this.novoPaciente.nomePaciente.trim()) this.errosPaciente.nomePaciente = true;
    if (!this.novoPaciente.dataNascimento || !this.validarData(this.novoPaciente.dataNascimento)) this.errosPaciente.dataNascimento = true;
    if (this.novoPaciente.idade === undefined || this.novoPaciente.idade === null) this.errosPaciente.idade = true;
    if (!this.novoPaciente.rua.trim()) this.errosPaciente.rua = true;
    if (!this.novoPaciente.numero.trim()) this.errosPaciente.numero = true;
    if (!this.novoPaciente.bairro.trim()) this.errosPaciente.bairro = true;
    if (!this.novoPaciente.cidade.trim()) this.errosPaciente.cidade = true;
    if (!this.novoPaciente.estado.trim()) this.errosPaciente.estado = true;
    if (!this.novoPaciente.contatoFamiliar) this.errosPaciente.contatoFamiliar = true;

    // Se houver erros, interrompe o processo
    if (Object.keys(this.errosPaciente).length > 0) {
      return;
    }

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
    this.novoUsuario.tipoUsuario = 'cuidador';
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
      // Validação de email
      if (!this.validarEmail(this.novoUsuario.email)) {
        alert('Email inválido. O email deve conter @');
        return;
      }

      if (this.novoUsuario.dataNascimento && !this.validarData(this.novoUsuario.dataNascimento)) {
        alert('Data de nascimento inválida. O ano deve ter 4 dígitos e ser a partir de 1900.');
        return;
      }
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
        this.novoUsuario.experienciaComorbidadesList = comorbidadesValidas; // Salvar array também
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
