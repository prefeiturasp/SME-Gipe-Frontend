"use client";

import React from "react";

import TabelaUnidades from "./TabelaUnidades";
import { useGetUnidades } from "@/hooks/useGetUnidades";
import FiltrosUnidadesEducacionais from "./Filtos";

type ListaDeUnidadesEducacionaisProps = {
    status: "ativa" | "inativa";
};

export default function ListaDeUnidadesEducacionais({
    status,
}: Readonly<ListaDeUnidadesEducacionaisProps>) {

    const [filters, setFilters] = React.useState<{
        dreUuid?: string;
    }>({});

    const { data: unidades } = useGetUnidades(status === "ativa", filters.dreUuid);

    return (
        <>
            <FiltrosUnidadesEducacionais onFilterChange={setFilters} />

            {unidades && unidades.length > 0 ? (
                <TabelaUnidades dataUnidades={unidades} />
            ) : <p className="text-sm text-[#42474A]">Nenhuma unidade educacional encontrada.</p>}
        </>
    );
}
