import { Usuario } from "../../types/usuarios";

export const usuariosMock: Usuario[] = [
    {
        id: 1,
        uuid: "1",
        perfil: "Diretor(a)",
        nome: "João Silva",
        rf_ou_cpf: "123.456.789-00",
        email: "joao.silva@example.com",
        rede: "Indireta",
        diretoria_regional: "Butantã",
        unidade_educacional: "EMEI Camilo Ashcar",
    },
    {
        id: 2,
        uuid: "2",
        perfil: "Assistente de direção",
        nome: "Maria Oliveira",
        rf_ou_cpf: "987.654.321-00",
        email: "maria.oliveira@example.com",
        rede: "Direta",
        diretoria_regional: "Penha",
        unidade_educacional: "EMEF Prof. Carlos Drummond de Andrade",
    },
];
