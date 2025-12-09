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

  // Store full objects for name lookup
  allCuidadores: Usuario[] = [];

  // Track which patients have expanded comorbidities
  comorbidadesExpandidas: Set<number> = new Set();

  // Store calendar data
  private calendarsData: { [cuidadorName: string]: any[] } = {};
  private readonly STORAGE_KEY = 'calendars_data';

  // Map shift codes to readable labels
  private shiftLabels: { [key: string]: string } = {
    'MT': 'MT (7h ~ 19h)',
    'SN': 'SN (19h ~ 7h)',
    '24H_7H': '24h (Início 7h)',
    '24H_19H': '24h (Início 19h)'
  };

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

    this.loadCalendarsData();
  }

  loadCalendarsData(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.calendarsData = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading calendars data:', error);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  atualizarListasUsuarios(usuarios: Usuario[]): void {
    this.allCuidadores = usuarios.filter(u => u.role === 'Caregiver');

    this.cuidadores = this.allCuidadores.map(u => u.userName);

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

  // Retorna a data de hoje formatada
  getDataHoje(): string {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // Retorna os plantões do dia para um paciente
  getPlantoesDoDia(paciente: Paciente): Array<{ cuidador: string, horario: string }> {
    const today = new Date().getDate();
    const result: Array<{ cuidador: string, horario: string }> = [];

    // Iterate through all caregivers in the calendar data
    for (const cuidadorName in this.calendarsData) {
      const calendar = this.calendarsData[cuidadorName];
      // Find today's entry
      const dayData = calendar.find((d: any) => d.number === today);

      if (dayData && dayData.selectedPatients) {
        // Iterate through selections for this day
        dayData.selectedPatients.forEach((selectedPatientName: string, index: number) => {
          if (selectedPatientName === paciente.nomePaciente) {
            const shiftCode = dayData.selectedShifts[index];
            const shiftLabel = this.shiftLabels[shiftCode] || shiftCode || 'Turno não definido';

            // Look up full name
            const cuidadorObj = this.allCuidadores.find(u => u.userName === cuidadorName);
            const displayName = cuidadorObj
              ? `${cuidadorObj.userName} ${cuidadorObj.sobrenome || ''}`.trim()
              : cuidadorName;

            result.push({
              cuidador: displayName,
              horario: shiftLabel
            });
          }
        });
      }
    }

    return result;
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
