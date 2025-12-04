import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService, Paciente } from '../paciente.service';
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
  pacienteEditando: Paciente = {
    nomePaciente: '',
    idade: null,
    endereco: '',
    comorbidades: '',
    cuidadorAtribuido: '',
    medicoAtribuido: '',
    contatoFamiliar: ''
  };
  indiceEditando: number = -1;

  cuidadores: string[] = ['Caregiver 1', 'Caregiver 2', 'Caregiver 3'];
  medicos: string[] = ['Dr. Silva', 'Dr. Santos', 'Dr. Oliveira'];
  familiares: string[] = ['Family Member 1', 'Family Member 2', 'Family Member 3'];

  constructor(private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.pacienteService.getPacientes().subscribe(pacientes => {
        this.pacientes = pacientes;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getComorbidadesArray(comorbidades: string): string[] {
    if (!comorbidades || comorbidades.trim() === '') {
      return [];
    }
    return comorbidades.split(',').map(c => c.trim()).filter(c => c.length > 0);
  }

  abrirModalEdicao(paciente: Paciente, index: number): void {
    this.pacienteEditando = { ...paciente };
    this.indiceEditando = index;
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
      endereco: '',
      comorbidades: '',
      cuidadorAtribuido: '',
      medicoAtribuido: '',
      contatoFamiliar: ''
    };
    this.indiceEditando = -1;
  }

  salvarEdicao(): void {
    if (this.pacienteEditando.nomePaciente.trim() && this.indiceEditando >= 0) {
      this.pacienteService.editarPaciente(this.indiceEditando, { ...this.pacienteEditando });
      this.fecharModalEdicao();
      this.modalSucessoEdicaoAberto = true;
    }
  }

  excluirPaciente(index: number): void {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      this.pacienteService.excluirPaciente(index);
    }
  }

  fecharModalSucessoEdicao(): void {
    this.modalSucessoEdicaoAberto = false;
  }
}
