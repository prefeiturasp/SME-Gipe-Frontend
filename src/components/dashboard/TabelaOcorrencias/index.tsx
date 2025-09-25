"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Ocorrencia } from "./useOcorrenciasColumns";
import { DataTable } from "./data-table";
import { getData } from "./mockData";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import Export from "@/assets/icons/Export";
import Filtros, { FiltrosValues } from "./Filtros";

export function parseDataHora(dataHora: string) {
    const [datePart] = dataHora.split(" - ");
    const [dd, mm, yyyy] = datePart.split("/");
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

export function mapStatusFilter(value: string) {
    if (!value) return "";
    const map: Record<string, string> = {
        incompleta: "Incompleta",
        "em-andamento": "Em andamento",
        finalizada: "Finalizada",
    };
    return map[value] ?? value;
}

export function matchPeriodo(
    itemDataHora: string,
    periodoInicial?: string,
    periodoFinal?: string
) {
    if (!periodoInicial && !periodoFinal) return true;
    const itemDate = parseDataHora(itemDataHora);
    const toLocalDateFromYMD = (ymd: string) => {
        const [yyyy, mm, dd] = ymd.split("-").map(Number);
        return new Date(yyyy, (mm || 1) - 1, dd || 1);
    };
    if (periodoInicial) {
        const start = toLocalDateFromYMD(periodoInicial);
        if (itemDate < start) return false;
    }
    if (periodoFinal) {
        const end = toLocalDateFromYMD(periodoFinal);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
    }
    return true;
}

export default function TabelaOcorrencias() {
    const [data, setData] = useState<Ocorrencia[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const [codigoEol, setCodigoEol] = useState("");
    const [nomeUe, setNomeUe] = useState("");
    const [dre, setDre] = useState("");
    const [periodoInicial, setPeriodoInicial] = useState("");
    const [periodoFinal, setPeriodoFinal] = useState("");
    const [tipoViolencia, setTipoViolencia] = useState("");
    const [status, setStatus] = useState("");

    function handleClearFilters() {
        setCodigoEol("");
        setNomeUe("");
        setDre("");
        setPeriodoInicial("");
        setPeriodoFinal("");
        setTipoViolencia("");
        setStatus("");
    }

    function handleApplyFilters(values: FiltrosValues) {
        setCodigoEol(values.codigoEol);
        setNomeUe(values.nomeUe);
        setDre(values.dre);
        setPeriodoInicial(values.periodoInicial);
        setPeriodoFinal(values.periodoFinal);
        setTipoViolencia(values.tipoViolencia);
        setStatus(values.status);
    }

    useEffect(() => {
        getData().then(setData);
    }, []);

    const filteredData = useMemo(() => {
        function normalizeText(value: string) {
            return String(value)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
        }

        const anyFilter =
            codigoEol ||
            nomeUe ||
            dre ||
            periodoInicial ||
            periodoFinal ||
            tipoViolencia ||
            status;
        if (!anyFilter) return data;

        const statusMapped = mapStatusFilter(status);

        function matchCodigo(itemCodigo: string) {
            if (!codigoEol) return true;
            return itemCodigo.includes(codigoEol);
        }

        function matchTipo(itemTipo: string) {
            if (!tipoViolencia) return true;
            return normalizeText(itemTipo).includes(
                normalizeText(tipoViolencia)
            );
        }

        function matchStatus(itemStatus: string) {
            if (!statusMapped) return true;
            return String(itemStatus) === statusMapped;
        }

        const matchPeriodoLocal = (itemDataHora: string) =>
            matchPeriodo(itemDataHora, periodoInicial, periodoFinal);

        function matchDre(itemDre: string) {
            if (!dre) return true;
            return normalizeText(itemDre).includes(normalizeText(dre));
        }

        function matchNomeUe(itemNomeUe: string) {
            if (!nomeUe) return true;
            return normalizeText(itemNomeUe).includes(normalizeText(nomeUe));
        }

        return data.filter((item) => {
            return (
                matchCodigo(item.codigoEol) &&
                matchDre(item.dre || "") &&
                matchNomeUe(item.nomeUe || "") &&
                matchTipo(item.tipoViolencia) &&
                matchStatus(item.status) &&
                matchPeriodoLocal(item.dataHora)
            );
        });
    }, [
        data,
        codigoEol,
        nomeUe,
        dre,
        periodoInicial,
        periodoFinal,
        tipoViolencia,
        status,
    ]);

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
                    initialValues={{
                        codigoEol,
                        nomeUe,
                        dre,
                        periodoInicial,
                        periodoFinal,
                        tipoViolencia,
                        status,
                    }}
                    onClear={handleClearFilters}
                    onApply={handleApplyFilters}
                />
            )}
            <DataTable data={filteredData} />
        </div>
    );
}
