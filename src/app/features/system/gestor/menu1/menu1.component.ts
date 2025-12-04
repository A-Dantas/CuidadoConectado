import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService, Paciente } from '../paciente.service';
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
  quantidadePacientes: number = 0;
  private subscription: Subscription = new Subscription();

  novoPaciente: Paciente = {
    nomePaciente: '',
    idade: null,
    endereco: '',
    comorbidades: '',
    cuidadorAtribuido: '',
    medicoAtribuido: '',
    contatoFamiliar: ''
  };

  cuidadores: string[] = ['Caregiver 1', 'Caregiver 2', 'Caregiver 3'];
  medicos: string[] = ['Dr. Silva', 'Dr. Santos', 'Dr. Oliveira'];
  familiares: string[] = ['Family Member 1', 'Family Member 2', 'Family Member 3'];

  constructor(private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.pacienteService.getPacientes().subscribe(pacientes => {
        this.quantidadePacientes = pacientes.length;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      endereco: '',
      comorbidades: '',
      cuidadorAtribuido: '',
      medicoAtribuido: '',
      contatoFamiliar: ''
    };
  }

  adicionarPaciente(): void {
    if (this.novoPaciente.nomePaciente.trim()) {
      this.pacienteService.adicionarPaciente({ ...this.novoPaciente });
      this.fecharModal();
      this.modalSucessoAberto = true;
    }
  }

  fecharModalSucesso(): void {
    this.modalSucessoAberto = false;
  }
}
