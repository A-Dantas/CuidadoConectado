import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Paciente {
    nomePaciente: string;
    dataNascimento?: string;
    idade: number | null;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    endereco: string; // Mantido para compatibilidade, será gerado automaticamente
    comorbidades: string;
    cuidadorAtribuido: string;
    medicoAtribuido: string;
    contatoFamiliar: string;
}

@Injectable({
    providedIn: 'root'
})
export class PacienteService {
    private readonly STORAGE_KEY = 'pacientes_data';
    private pacientesSubject = new BehaviorSubject<Paciente[]>(this.carregarPacientes());
    public pacientes$: Observable<Paciente[]> = this.pacientesSubject.asObservable();

    constructor() { }

    private carregarPacientes(): Paciente[] {
        try {
            const data = sessionStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Erro ao carregar pacientes do sessionStorage:', error);
        }
        return [];
    }

    private salvarPacientes(pacientes: Paciente[]): void {
        try {
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(pacientes));
        } catch (error) {
            console.error('Erro ao salvar pacientes no sessionStorage:', error);
        }
    }

    getPacientes(): Observable<Paciente[]> {
        return this.pacientes$;
    }

    adicionarPaciente(paciente: Paciente): void {
        const pacientesAtuais = this.pacientesSubject.value;
        const novosPacientes = [...pacientesAtuais, paciente];
        this.pacientesSubject.next(novosPacientes);
        this.salvarPacientes(novosPacientes);
    }

    editarPaciente(index: number, paciente: Paciente): void {
        const pacientesAtuais = this.pacientesSubject.value;
        if (index >= 0 && index < pacientesAtuais.length) {
            pacientesAtuais[index] = { ...paciente };
            const novosPacientes = [...pacientesAtuais];
            this.pacientesSubject.next(novosPacientes);
            this.salvarPacientes(novosPacientes);
        }
    }

    excluirPaciente(index: number): void {
        const pacientesAtuais = this.pacientesSubject.value;
        if (index >= 0 && index < pacientesAtuais.length) {
            pacientesAtuais.splice(index, 1);
            const novosPacientes = [...pacientesAtuais];
            this.pacientesSubject.next(novosPacientes);
            this.salvarPacientes(novosPacientes);
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

    limparDados(): void {
        sessionStorage.removeItem(this.STORAGE_KEY);
        this.pacientesSubject.next([]);
    }
}
