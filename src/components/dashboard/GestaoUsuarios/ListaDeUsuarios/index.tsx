"use client";

import * as React from "react";

import FiltrosUsuarios from "./Filtros";
import TabelaUsuarios from "./TabelaUsuarios";
import { dataUsuarios } from "../data-usuarios";

type ListaDeUsuariosProps = {
    status: "ativos" | "inativos";
};


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
