import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario {
    userName: string;
    email: string;
    role: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    endereco: string;

    // Campos específicos de cuidador
    sobrenome?: string;
    dataNascimento?: string;
    idade?: number;
    telefone?: string;
    chavePix?: string;
    whatsapp?: string;
    tempoExperiencia?: string;
    experienciaComorbidades?: string;
    tipoUsuario?: string; // Tipo de usuário: cuidador, medico, familiar
    experienciaComorbidadesList?: string[]; // Lista de comorbidades
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private readonly STORAGE_KEY = 'usuarios_data';
    private usuariosSubject = new BehaviorSubject<Usuario[]>(this.carregarUsuarios());
    public usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

    constructor() { }

    private carregarUsuarios(): Usuario[] {
        try {
            const data = sessionStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Erro ao carregar usuários do sessionStorage:', error);
        }
        return [];
    }

    private salvarUsuarios(usuarios: Usuario[]): void {
        try {
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarios));
        } catch (error) {
            console.error('Erro ao salvar usuários no sessionStorage:', error);
        }
    }

    getUsuarios(): Observable<Usuario[]> {
        return this.usuarios$;
    }

    adicionarUsuario(usuario: Usuario): void {
        const usuariosAtuais = this.usuariosSubject.value;
        const novosUsuarios = [...usuariosAtuais, usuario];
        this.usuariosSubject.next(novosUsuarios);
        this.salvarUsuarios(novosUsuarios);
    }

    getQuantidadeUsuarios(): number {
        return this.usuariosSubject.value.length;
    }

    limparDados(): void {
        sessionStorage.removeItem(this.STORAGE_KEY);
        this.usuariosSubject.next([]);
    }
}
