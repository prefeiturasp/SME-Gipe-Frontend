"use client";

import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { useFetchDREs, useFetchTodasUEs } from "@/hooks/useUnidades";

export type FiltrosValues = {
    codigoEol: string;
    nomeUe: string;
    dre: string;
    periodoInicial: string;
    periodoFinal: string;
    tiposOcorrencia: string;
    status: string;
};

type FiltrosProps = {
    initialValues?: Partial<FiltrosValues>;
    onApply?: (values: FiltrosValues) => void;
    onClear?: () => void;
};

export default function Filtros({
    initialValues,
    onApply,
    onClear,
}: Readonly<FiltrosProps>) {
    const { isGipe, isPontoFocal } = useUserPermissions();
    const [codigoEol, setCodigoEol] = useState(initialValues?.codigoEol ?? "");
    const [nomeUe, setNomeUe] = useState(initialValues?.nomeUe ?? "");
    const [dre, setDre] = useState(initialValues?.dre ?? "");
    const [periodoInicial, setPeriodoInicial] = useState(
        initialValues?.periodoInicial ?? ""
    );
    const [periodoFinal, setPeriodoFinal] = useState(
        initialValues?.periodoFinal ?? ""
    );
    const [tipoOcorrenciaSelecionado, setTipoOcorrenciaSelecionado] = useState(
        initialValues?.tiposOcorrencia ?? ""
    );
    const [status, setStatus] = useState(initialValues?.status ?? "");
    const { data: tiposOcorrencia, isLoading: isLoadingTipos } = useTiposOcorrencia();
    const { data: dreOptions = [] } = useFetchDREs();
    const { data: todasUEsOptions = []} = useFetchTodasUEs()

    const uesSemDRE = todasUEsOptions.filter((item: any) => item.tipo_unidade !== "DRE");

    function handleClear() {
        setCodigoEol("");
        setNomeUe("");
        setDre("");
        setPeriodoInicial("");
        setPeriodoFinal("");
        setTipoOcorrenciaSelecionado("");
        setStatus("");
        if (onClear) onClear();
    }

    function handleApply() {
        const values: FiltrosValues = {
            codigoEol,
            nomeUe,
            dre,
            periodoInicial,
            periodoFinal,
            tiposOcorrencia: tipoOcorrenciaSelecionado,
            status,
        };
        if (onApply) onApply(values);
    }

    const isAnyFilterSelected =
        !!codigoEol ||
        !!nomeUe ||
        !!dre ||
        !!periodoInicial ||
        !!periodoFinal ||
        !!tipoOcorrenciaSelecionado ||
        !!status;

    const renderCodigoEol = () => (
        <div className="min-w-0">
            <label
                htmlFor="codigo-eol"
                className="text-[14px] text-[#42474a] block mb-1"
            >
                Código EOL
            </label>
            <input
                id="codigo-eol"
                value={codigoEol}
                onChange={(e) => setCodigoEol(e.target.value)}
                placeholder="Código EOL"
                className="flex h-10 w-full border border-[#dadada] bg-background px-3 py-2 text-sm font-medium rounded-[4px] outline-none focus:bg-[#E8F0FE]"
            />
        </div>
    );

    const renderNomeUe = () => (
        <div className="min-w-0">
            <label
                htmlFor="nome-ue"
                className="text-[14px] text-[#42474a] block mb-1"
            >
                Nome da UE
            </label>
            <Select value={nomeUe} onValueChange={(v) => setNomeUe(v)}>
                <SelectTrigger id="nome-ue">
                    <SelectValue placeholder="Selecione a UE" />
                </SelectTrigger>
                <SelectContent>
                    {uesSemDRE.map(
                        (dre: {
                            uuid: string;
                            nome: string;
                        }) => (
                            <SelectItem
                                key={dre.uuid}
                                value={dre.uuid}
                            >
                                {dre.nome}
                            </SelectItem>
                        )
                    )}
                </SelectContent>
            </Select>
        </div>
    );

    const renderDre = () => (
        <div className="min-w-0">
            <label
                htmlFor="dre"
                className="text-[14px] text-[#42474a] block mb-1"
            >
                DRE
            </label>
            <Select value={dre} onValueChange={(v) => setDre(v)}>
                <SelectTrigger id="dre">
                    <SelectValue placeholder="Selecione a DRE" />
                </SelectTrigger>
                <SelectContent>
                    {dreOptions.map(
                        (dre: {
                            uuid: string;
                            nome: string;
                        }) => (
                            <SelectItem
                                key={dre.uuid}
                                value={dre.uuid}
                            >
                                {dre.nome}
                            </SelectItem>
                        )
                    )}
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <div className="my-[44px]">
            {isGipe && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {renderCodigoEol()}
                    {renderNomeUe()}
                    {renderDre()}
                </div>
            )}

            {isPontoFocal && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {renderCodigoEol()}
                    {renderNomeUe()}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
                <div className="min-w-0 w-full">
                    <fieldset>
                        <legend className="text-[14px] text-[#42474a] block mb-1">
                            Período
                        </legend>
                        <div className="flex items-center border border-[#dadada] rounded-[4px] overflow-hidden w-full max-w-full box-border h-[40px]">
                            <input
                                id="periodo-inicial"
                                type="date"
                                value={periodoInicial}
                                onChange={(e) =>
                                    setPeriodoInicial(e.target.value)
                                }
                                placeholder="Data inicial"
                                className="h-10 px-2 text-sm font-medium outline-none border-0 bg-transparent text-[#42474a] flex-1 min-w-0"
                            />
                            <span className="px-2 text-sm text-[#86858d]">
                                Até
                            </span>
                            <input
                                id="periodo-final"
                                type="date"
                                value={periodoFinal}
                                onChange={(e) =>
                                    setPeriodoFinal(e.target.value)
                                }
                                placeholder="Data final"
                                className="h-10 px-2 text-sm font-medium outline-none border-0 bg-transparent text-[#42474a] flex-1 min-w-0"
                            />
                        </div>
                    </fieldset>
                </div>

                <div className="min-w-0">
                    <label
                        htmlFor="tipo-violencia"
                        className="text-[14px] text-[#42474a] block mb-1"
                    >
                        Tipo de Ocorrência
                    </label>
                    <Select
                        value={tipoOcorrenciaSelecionado}
                        onValueChange={(v) => setTipoOcorrenciaSelecionado(v)}
                        disabled={isLoadingTipos}
                    >
                        <SelectTrigger id="tipo-violencia">
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                        {tiposOcorrencia?.map((tipo: any) => (
                            <SelectItem key={tipo.uuid} value={tipo.nome}>
                                {tipo.nome}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="min-w-0">
                    <label
                        htmlFor="status"
                        className="text-[14px] text-[#42474a] block mb-1"
                    >
                        Status
                    </label>
                    <Select value={status} onValueChange={(v) => setStatus(v)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="incompleta">
                                Incompleta
                            </SelectItem>
                            <SelectItem value="em-andamento">
                                Em andamento
                            </SelectItem>
                            <SelectItem value="finalizada">
                                Finalizada
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
                <Button
                    variant="customOutline"
                    onClick={handleClear}
                    disabled={!isAnyFilterSelected}
                >
                    Limpar
                </Button>
                <Button
                    variant="submit"
                    onClick={handleApply}
                    disabled={!isAnyFilterSelected}
                >
                    Filtrar
                </Button>
            </div>
        </div>
    );
}
