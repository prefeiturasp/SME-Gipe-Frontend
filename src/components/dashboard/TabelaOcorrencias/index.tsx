"use client";

import Export from "@/assets/icons/Export";
import { Button } from "@/components/ui/button";
import { useOcorrencias } from "@/hooks/useOcorrencias";
import { ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "./data-table";
import Filtros, { FiltrosValues } from "./filtros";

import Alert from "@/assets/icons/Alert";
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
    const { data: ocorrenciasData, isLoading } = useOcorrencias();

    const [showFilters, setShowFilters] = useState(false);

    const [filtros, setFiltros] = useState<FiltrosValues>({
        codigoEol: "",
        nomeUe: "",
        dre: "",
        periodoInicial: "",
        periodoFinal: "",
        tiposOcorrencia: "",
        status: "",
    });

    function handleClearFilters() {
        setFiltros({
            codigoEol: "",
            nomeUe: "",
            dre: "",
            periodoInicial: "",
            periodoFinal: "",
            tiposOcorrencia: "",
            status: "",
        });
    }

    function handleApplyFilters(values: FiltrosValues) {
        setFiltros(values);
    }

    const filteredData = useMemo(() => {
        const data = ocorrenciasData || [];
        if (!hasAnyFilter(filtros)) return data;

        return data.filter((item) => {
            return (
                matchCodigo(item.codigoEol, filtros.codigoEol) &&
                matchDre(item.dre || "", filtros.dre) &&
                matchNomeUe(item.nomeUe || "", filtros.nomeUe) &&
                matchTipo(item.tipoOcorrencia, filtros.tiposOcorrencia) &&
                matchStatus(item.status, filtros.status) &&
                matchPeriodo(
                    item.dataHora,
                    filtros.periodoInicial,
                    filtros.periodoFinal
                )
            );
        });
    }, [ocorrenciasData, filtros]);

    if (isLoading) {
        return <div>Carregando...</div>;
    }

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
                    <Button
                        variant="customOutline"
                        size="sm"
                        disabled={
                            !ocorrenciasData || ocorrenciasData.length === 0
                        }
                    >
                        <Export className="mr-1" />
                        Exportar
                    </Button>
                    <Button
                        variant="customOutline"
                        size="sm"
                        onClick={() => setShowFilters((v) => !v)}
                        disabled={
                            !ocorrenciasData || ocorrenciasData.length === 0
                        }
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
            {ocorrenciasData?.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 h-[400px] w-full">
                    <Alert className="w-6 h-6" style={{ fill: "#717FC7" }} />
                    <h3 className="text-[14px] font-bold text-[#42474A] mb-[-15px]">
                        Você ainda não possui nenhuma intercorrência registrada.
                    </h3>
                    <p className="text-[14px] text-[#42474A] max-w-md">
                        Clique em nova ocorrência para começar.
                    </p>
                </div>
            ) : (
                <DataTable data={filteredData} />
            )}
        </div>
    );
}
