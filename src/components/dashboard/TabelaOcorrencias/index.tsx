"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Ocorrencia } from "./useOcorrenciasColumns";
import { DataTable } from "./data-table";
import { getData } from "./mockData";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import Export from "@/assets/icons/Export";
import Filtros, { FiltrosValues } from "./filtros";

import {
    hasAnyFilter,
    matchCodigo,
    matchDre,
    matchNomeUe,
    matchPeriodo,
    matchStatus,
    matchTipo,
} from "./filtros/utils";

export default function TabelaOcorrencias() {
    const [data, setData] = useState<Ocorrencia[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const [filtros, setFiltros] = useState<FiltrosValues>({
        codigoEol: "",
        nomeUe: "",
        dre: "",
        periodoInicial: "",
        periodoFinal: "",
        tipoViolencia: "",
        status: "",
    });

    function handleClearFilters() {
        setFiltros({
            codigoEol: "",
            nomeUe: "",
            dre: "",
            periodoInicial: "",
            periodoFinal: "",
            tipoViolencia: "",
            status: "",
        });
    }

    function handleApplyFilters(values: FiltrosValues) {
        setFiltros(values);
    }

    useEffect(() => {
        getData().then(setData);
    }, []);

    const filteredData = useMemo(() => {
        if (!hasAnyFilter(filtros)) return data;

        return data.filter((item) => {
            return (
                matchCodigo(item.codigoEol, filtros.codigoEol) &&
                matchDre(item.dre || "", filtros.dre) &&
                matchNomeUe(item.nomeUe || "", filtros.nomeUe) &&
                matchTipo(item.tipoViolencia, filtros.tipoViolencia) &&
                matchStatus(item.status, filtros.status) &&
                matchPeriodo(
                    item.dataHora,
                    filtros.periodoInicial,
                    filtros.periodoFinal
                )
            );
        });
    }, [data, filtros]);

    return (
        <div>
            <h1 className="text-[24px] font-bold text-[#42474a]">
                Histórico de ocorrências registradas
            </h1>
            <div className="mt-1 mb-4 flex flex-row space-x-4 items-center justify-between">
                <span className="text-[14px] text-[#42474a]">
                    Confira todas as ocorrências registradas e seus respectivos
                    detalhes.
                </span>
                <div className="flex flex-row space-x-2">
                    <Button variant="customOutline" size="sm">
                        <Export className="mr-1" />
                        Exportar
                    </Button>
                    <Button
                        variant="customOutline"
                        size="sm"
                        onClick={() => setShowFilters((v) => !v)}
                    >
                        <ListFilter size="16" className="mr-1" />
                        Filtrar
                    </Button>
                </div>
            </div>
            {showFilters && (
                <Filtros
                    initialValues={filtros}
                    onClear={handleClearFilters}
                    onApply={handleApplyFilters}
                />
            )}
            <DataTable data={filteredData} />
        </div>
    );
}
