import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INITIAL_USUARIOS } from '../../../core/data/seed-data';

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
    login?: string;
    password?: string;
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
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            } else {
                // Se não houver dados, carregar seed data e salvar
                const seedData = INITIAL_USUARIOS;
                this.salvarUsuarios(seedData);
                return seedData;
            }
        } catch (error) {
            console.error('Erro ao carregar usuários do localStorage:', error);
            return [];
        }
    }

    private salvarUsuarios(usuarios: Usuario[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarios));
        } catch (error) {
            console.error('Erro ao salvar usuários no localStorage:', error);
        }
    }

    getUsuarios(): Observable<Usuario[]> {
        return this.usuarios$;
    }

    getUsuariosAtuais(): Usuario[] {
        return this.usuariosSubject.value;
    }

    adicionarUsuario(usuario: Usuario): void {
        const usuariosAtuais = this.usuariosSubject.value;

        // Gerar login e senha padrão
        // Usuário: primeironome em minusculo + 4 últimos número do telefone
        // Senha: A primeira senha será 123456

        let login = '';
        if (usuario.userName) {
            const primeiroNome = usuario.userName.trim().split(' ')[0].toLowerCase();
            const telefoneNumeros = usuario.telefone ? usuario.telefone.replace(/\D/g, '') : '';
            const ultimosQuatro = telefoneNumeros.slice(-4);

            // Se não tiver telefone suficiente, usa '0000' como fallback, mas ideal é ter telefone
            const sufixo = ultimosQuatro.length === 4 ? ultimosQuatro : '0000';

            login = `${primeiroNome}${sufixo}`;
        }

        usuario.login = login;
        usuario.password = '123456';

        const novosUsuarios = [...usuariosAtuais, usuario];
        this.usuariosSubject.next(novosUsuarios);
        this.salvarUsuarios(novosUsuarios);
    }

    atualizarSenha(login: string, novaSenha: string): boolean {
        const usuariosAtuais = this.usuariosSubject.value;
        const index = usuariosAtuais.findIndex(u => u.login === login);

        if (index !== -1) {
            const usuario = { ...usuariosAtuais[index] };
            usuario.password = novaSenha;

            const novosUsuarios = [...usuariosAtuais];
            novosUsuarios[index] = usuario;

            this.usuariosSubject.next(novosUsuarios);
            this.salvarUsuarios(novosUsuarios);
            return true;
        }
        return false;
    }

    atualizarUsuario(index: number, usuarioAtualizado: Usuario): void {
        const usuariosAtuais = this.usuariosSubject.value;
        if (index >= 0 && index < usuariosAtuais.length) {
            const novosUsuarios = [...usuariosAtuais];
            // Preservar login e senha se não vierem no atualizado (embora aqui devêssemos atualizar tudo, cuidado para não perder credenciais)
            const credenciaisAntigas = {
                login: usuariosAtuais[index].login,
                password: usuariosAtuais[index].password
            };

            novosUsuarios[index] = { ...credenciaisAntigas, ...usuarioAtualizado };
            this.usuariosSubject.next(novosUsuarios);
            this.salvarUsuarios(novosUsuarios);
        }
    }

    removerUsuario(index: number): void {
        const usuariosAtuais = this.usuariosSubject.value;
        if (index >= 0 && index < usuariosAtuais.length) {
            const novosUsuarios = usuariosAtuais.filter((_, i) => i !== index);
            this.usuariosSubject.next(novosUsuarios);
            this.salvarUsuarios(novosUsuarios);
        }
    }

    getQuantidadeUsuarios(): number {
        return this.usuariosSubject.value.length;
    }

    limparDados(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.usuariosSubject.next([]);
    }
}
