"use client";

import React from "react";

import TabelaUnidades from "./TabelaUnidades";
import { useGetUnidades } from "@/hooks/useGetUnidades";

type ListaDeUnidadesEducacionaisProps = {
    status: "ativa" | "inativa";
};

export default function ListaDeUnidadesEducacionais({
    status,
}: Readonly<ListaDeUnidadesEducacionaisProps>) {

    const { data: unidades } = useGetUnidades(status === "ativa");

    return (
        <>
            {unidades && unidades.length > 0 && (
                <TabelaUnidades dataUnidades={unidades} />
            )}
        </>
    );
}
