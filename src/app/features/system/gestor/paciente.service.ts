import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Paciente {
    nomePaciente: string;
    idade: number | null;
    endereco: string;
    comorbidades: string;
    cuidadorAtribuido: string;
    medicoAtribuido: string;
    contatoFamiliar: string;
}

@Injectable({
    providedIn: 'root'
})
export class PacienteService {
    private pacientesSubject = new BehaviorSubject<Paciente[]>([]);
    public pacientes$: Observable<Paciente[]> = this.pacientesSubject.asObservable();

    constructor() { }

    getPacientes(): Observable<Paciente[]> {
        return this.pacientes$;
    }

    adicionarPaciente(paciente: Paciente): void {
        const pacientesAtuais = this.pacientesSubject.value;
        this.pacientesSubject.next([...pacientesAtuais, paciente]);
    }

    getQuantidadePacientes(): number {
        return this.pacientesSubject.value.length;
    }
}
