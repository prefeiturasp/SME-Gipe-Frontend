"use client";

import React, { useEffect, useState } from "react";
import { columns, Ocorrencia } from "./columns";
import { DataTable } from "./data-table";
import { getData } from "./mockData";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import Export from "@/assets/icons/Export";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

    useEffect(() => {
        getData().then(setData);
    }, []);

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
                <div className="mb-4 p-4 border rounded-md bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label
                                htmlFor="codigo-eol"
                                className="text-[12px] text-muted-foreground block mb-1"
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
                        <div>
                            <label
                                htmlFor="nome-ue"
                                className="text-[12px] text-muted-foreground block mb-1"
                            >
                                Nome da UE
                            </label>
                            <Select
                                value={nomeUe}
                                onValueChange={(v) => setNomeUe(v)}
                            >
                                <SelectTrigger id="nome-ue">
                                    <SelectValue placeholder="Selecione a UE" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ue-1">UE 1</SelectItem>
                                    <SelectItem value="ue-2">UE 2</SelectItem>
                                    <SelectItem value="ue-3">UE 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label
                                htmlFor="dre"
                                className="text-[12px] text-muted-foreground block mb-1"
                            >
                                DRE
                            </label>
                            <Select
                                value={dre}
                                onValueChange={(v) => setDre(v)}
                            >
                                <SelectTrigger id="dre">
                                    <SelectValue placeholder="Selecione a DRE" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dre-1">DRE 1</SelectItem>
                                    <SelectItem value="dre-2">DRE 2</SelectItem>
                                    <SelectItem value="dre-3">DRE 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <fieldset>
                                <legend className="text-[12px] text-muted-foreground block mb-1">
                                    Período
                                </legend>
                                <div className="flex space-x-2">
                                    <input
                                        id="periodo-inicial"
                                        type="date"
                                        value={periodoInicial}
                                        onChange={(e) =>
                                            setPeriodoInicial(e.target.value)
                                        }
                                        className="flex h-10 border border-[#dadada] bg-background px-3 py-2 text-sm font-medium rounded-[4px] outline-none"
                                    />
                                    <input
                                        id="periodo-final"
                                        type="date"
                                        value={periodoFinal}
                                        onChange={(e) =>
                                            setPeriodoFinal(e.target.value)
                                        }
                                        className="flex h-10 border border-[#dadada] bg-background px-3 py-2 text-sm font-medium rounded-[4px] outline-none"
                                    />
                                </div>
                            </fieldset>
                        </div>

                        <div>
                            <label
                                htmlFor="tipo-violencia"
                                className="text-[12px] text-muted-foreground block mb-1"
                            >
                                Tipo de violência
                            </label>
                            <Select
                                value={tipoViolencia}
                                onValueChange={(v) => setTipoViolencia(v)}
                            >
                                <SelectTrigger id="tipo-violencia">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fisica">
                                        Física
                                    </SelectItem>
                                    <SelectItem value="psicologica">
                                        Psicológica
                                    </SelectItem>
                                    <SelectItem value="sexual">
                                        Sexual
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="text-[12px] text-muted-foreground block mb-1"
                            >
                                Status
                            </label>
                            <Select
                                value={status}
                                onValueChange={(v) => setStatus(v)}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aberto">
                                        Aberto
                                    </SelectItem>
                                    <SelectItem value="em-andamento">
                                        Em andamento
                                    </SelectItem>
                                    <SelectItem value="fechado">
                                        Fechado
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCodigoEol("");
                                setNomeUe("");
                                setDre("");
                                setPeriodoInicial("");
                                setPeriodoFinal("");
                                setTipoViolencia("");
                                setStatus("");
                            }}
                        >
                            Limpar
                        </Button>
                        <Button
                            onClick={() => {
                                // por enquanto apenas logar os filtros; integração com a tabela segue como próximo passo
                                console.log({
                                    codigoEol,
                                    nomeUe,
                                    dre,
                                    periodoInicial,
                                    periodoFinal,
                                    tipoViolencia,
                                    status,
                                });
                            }}
                        >
                            Filtrar
                        </Button>
                    </div>
                </div>
            )}
            <DataTable columns={columns} data={data} />
        </div>
    );
}
