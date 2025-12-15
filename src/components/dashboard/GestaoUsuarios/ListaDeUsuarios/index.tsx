"use client";

import React, { useCallback, useState } from "react";

import FiltrosUsuarios from "./Filtros";
import TabelaUsuarios from "./TabelaUsuarios";

type ListaDeUsuariosProps = {
    status: "ativos" | "inativos";
};

import { useGetUsuarios } from "@/hooks/useGetUsuarios";
import { RenderMessage } from "../RenderMessage";

export default function ListaDeUsuarios({
    status,
}: Readonly<ListaDeUsuariosProps>) {
    const [filters, setFilters] = useState<{
        dreUuid?: string;
        ueUuid?: string;
    }>({});
    const {
        data: usuarios,
        isLoading,
        isError,
        error,
    } = useGetUsuarios(status === "ativos", filters.dreUuid, filters.ueUuid);

    const handleFilterChange = useCallback(
        (nextFilters: { dreUuid?: string; ueUuid?: string }) => {
            setFilters((current) => {
                if (
                    current.dreUuid === nextFilters.dreUuid &&
                    current.ueUuid === nextFilters.ueUuid
                ) {
                    return current;
                }

                return nextFilters;
            });
        },
        []
    );

    return (
        <>
            <FiltrosUsuarios onFilterChange={handleFilterChange} />

            <RenderMessage
                isLoading={isLoading}
                isError={isError}
                error={error}
                usuarios={usuarios}
            />

            {usuarios && usuarios.length > 0 && (
                <TabelaUsuarios dataUsuarios={usuarios} />
            )}
        </>
    );
}
