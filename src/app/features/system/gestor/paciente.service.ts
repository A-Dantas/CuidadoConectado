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

    editarPaciente(index: number, paciente: Paciente): void {
        const pacientesAtuais = this.pacientesSubject.value;
        if (index >= 0 && index < pacientesAtuais.length) {
            pacientesAtuais[index] = { ...paciente };
            this.pacientesSubject.next([...pacientesAtuais]);
        }
    }

    excluirPaciente(index: number): void {
        const pacientesAtuais = this.pacientesSubject.value;
        if (index >= 0 && index < pacientesAtuais.length) {
            pacientesAtuais.splice(index, 1);
            this.pacientesSubject.next([...pacientesAtuais]);
        }
    }

    getPacienteByIndex(index: number): Paciente | null {
        const pacientesAtuais = this.pacientesSubject.value;
        if (index >= 0 && index < pacientesAtuais.length) {
            return { ...pacientesAtuais[index] };
        }
        return null;
    }

    getQuantidadePacientes(): number {
        return this.pacientesSubject.value.length;
    }
}
