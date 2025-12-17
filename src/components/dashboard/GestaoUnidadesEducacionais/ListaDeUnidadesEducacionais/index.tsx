"use client";

import React from "react";
import { dataUnidades } from "../dataUnidades";
import TabelaUnidades from "./TabelaUnidades";

type ListaDeUnidadesEducacionaisProps = {
    status: "ativas" | "inativas";
};

export default function ListaDeUnidadesEducacionais({
    status,
}: Readonly<ListaDeUnidadesEducacionaisProps>) {
    return (
        <>
            <p className="py-4">Exibindo o status: {status}</p>
            <TabelaUnidades dataUnidades={dataUnidades} />
        </>
    );
}
