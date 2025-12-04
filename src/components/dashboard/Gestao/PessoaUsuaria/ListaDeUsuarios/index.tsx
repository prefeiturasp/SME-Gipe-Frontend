"use client";

import * as React from "react";

import FiltrosUsuarios from "./Filtros";
import TabelaUsuarios from "./TabelaUsuarios";

type ListaDeUsuariosProps = {
    status: "ativos" | "inativos";
};

const dataUsuarios = [
    {
        id: 1,
        uuid: "1",
        perfil: "Diretor(a)",
        nome: "João Silva",
        rfOuCpf: "123.456.789-00",
        email: "joao.silva@example.com",
        rede: "Indireta",
        diretoriaRegional: "Butantã",
        unidadeEducacional: "EMEI Camilo Ashcar",
    },
    {
        id: 2,
        uuid: "2",
        perfil: "Assistente de direção",
        nome: "Maria Oliveira",
        rfOuCpf: "987.654.321-00",
        email: "maria.oliveira@example.com",
        rede: "Direta",
        diretoriaRegional: "Penha",
        unidadeEducacional: "EMEF Prof. Carlos Drummond de Andrade",
    },
    {
        id: 3,
        uuid: "3",
        perfil: "Ponto focal",
        nome: "Carlos Pereira",
        rfOuCpf: "456.789.123-00",
        email: "carlos.pereira@example.com",
        rede: "Direta",
        diretoriaRegional: "Campo Limpo",
        unidadeEducacional: "",
    },
    {
        id: 4,
        uuid: "4",
        perfil: "GIPE",
        nome: "Ana Souza",
        rfOuCpf: "321.654.987-00",
        email: "ana.souza@example.com",
        rede: "Direta",
        diretoriaRegional: "",
        unidadeEducacional: "",
    },
];

export default function ListaDeUsuarios({
    status,
}: Readonly<ListaDeUsuariosProps>) {
    const handleFilterChange = (filters: {
        dreUuid?: string;
        ueUuid?: string;
    }) => {
        // aqui você pode chamar refetch da lista de usuários,
        // atualizar estado global, montar query params, etc.
        // ex:
        // setFilters(filters);
        console.log("Filtros aplicados:", filters);
    };

    return (
        <>
            <p className="p-2">Exibindo o Status: {status}</p>
            <FiltrosUsuarios onFilterChange={handleFilterChange} />
            <TabelaUsuarios dataUsuarios={dataUsuarios} />
        </>
    );
}
