import { Paciente } from '../../features/system/gestor/paciente.service';
import { Usuario } from '../../features/system/gestor/usuario.service';

export const INITIAL_USUARIOS: Usuario[] = [
    {
        userName: 'Gestor',
        email: 'gestor@cuidado.com',
        role: 'Manager',
        login: 'gestor',
        password: '123', // Senha simplificada para testes
        rua: '', numero: '', bairro: '', cidade: '', estado: '', endereco: ''
    },
    {
        userName: 'Rebeca Souza Brito',
        email: 'rebeca@cuidado.com',
        role: 'Caregiver', // Cuidador
        login: 'rebeca1234', // Exemplo de login
        password: '123',
        rua: 'Rua das Flores', numero: '123', bairro: 'Centro', cidade: 'Magruas', estado: 'SP', endereco: 'Rua das Flores, 123, Centro, Magruas, SP',
        sobrenome: 'Brito',
        telefone: '(11) 99999-1234',
        tipoUsuario: 'cuidador'
    },
    {
        userName: 'Dr. Silva',
        email: 'medico@cuidado.com',
        role: 'Doctor', // Médico
        login: 'medico1234',
        password: '123',
        rua: 'Av. Saude', numero: '500', bairro: 'Hospitalar', cidade: 'Magruas', estado: 'SP', endereco: 'Av. Saude, 500',
        tipoUsuario: 'medico'
    },
    {
        userName: 'Breno',
        email: 'breno@cuidado.com',
        role: 'Family Member', // Familiar
        login: 'breno1234',
        password: '123',
        rua: '', numero: '', bairro: '', cidade: '', estado: '', endereco: '',
        tipoUsuario: 'familiar'
    }
];

export const INITIAL_PACIENTES: Paciente[] = [
    {
        nomePaciente: 'Adailton Brito Sampaio',
        idade: 55,
        rua: 'Santo Agostinho',
        numero: '168',
        bairro: 'Santana',
        cidade: 'Magruas',
        estado: 'SP',
        endereco: 'Santo Agostinho, 168, Santana, Magruas, SP',
        comorbidades: 'Hipertensão',
        cuidadorAtribuido: 'Rebeca Souza Brito',
        medicoAtribuido: '',
        contatoFamiliar: 'Breno'
    }
];

export const INITIAL_SCHEDULES = [
    {
        cuidador: 'Rebeca Souza Brito',
        day: 9, // Dia 9 do mês atual
        patient: 'Adailton Brito Sampaio',
        shift: '24H_7H'
    }
];
