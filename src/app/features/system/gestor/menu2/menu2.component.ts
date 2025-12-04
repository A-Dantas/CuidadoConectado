import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService, Paciente } from '../paciente.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu2',
  imports: [CommonModule],
  templateUrl: './menu2.component.html',
  styleUrl: './menu2.component.css'
})
export class Menu2Component implements OnInit, OnDestroy {
  pacientes: Paciente[] = [];
  private subscription: Subscription = new Subscription();

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
}
