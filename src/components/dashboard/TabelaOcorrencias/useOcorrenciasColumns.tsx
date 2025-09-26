"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    SortHeader,
    StatusBadge,
    handleStatusSelect,
    getStatusSelectedId,
    getStatusPriority,
} from "./helpers";
import { Search } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useMemo } from "react";

export type Ocorrencia = {
    protocolo: string;
    dataHora: string;
    codigoEol: string;
    nomeUe?: string;
    dre?: string;
    tipoViolencia: string;
    status: "Incompleta" | "Finalizada" | "Em andamento";
    id: string;
};

export const useOcorrenciasColumns = () => {
    const { isGipe, isPontoFocal } = useUserPermissions();

    const columns = useMemo(() => {
        const dynamicColumns: ColumnDef<Ocorrencia>[] = [];

        dynamicColumns.push({
            accessorKey: "protocolo",
            header: ({ column, table }) => (
                <SortHeader
                    column={column}
                    table={table}
                    title="Protocolo"
                    options={[
                        { id: "asc", label: "Crescente (0 - 10)", desc: false },
                        {
                            id: "desc",
                            label: "Decrescente (10 - 0)",
                            desc: true,
                        },
                    ]}
                />
            ),
        });

        dynamicColumns.push({
            accessorKey: "dataHora",
            header: ({ column, table }) => (
                <SortHeader
                    column={column}
                    table={table}
                    title="Data/Hora"
                    options={[
                        {
                            id: "recent",
                            label: "Do mais recente ao mais antigo",
                            desc: false,
                        },
                        {
                            id: "oldest",
                            label: "Do mais antigo ao mais recente",
                            desc: true,
                        },
                    ]}
                    selectedIdMapper={(sortState) => {
                        if (!sortState) return undefined;
                        return sortState.desc ? "oldest" : "recent";
                    }}
                />
            ),
        });

        dynamicColumns.push({
            accessorKey: "codigoEol",
            header: ({ column, table }) => (
                <SortHeader
                    column={column}
                    table={table}
                    title="Código EOL"
                    options={[
                        { id: "asc", label: "Crescente (0 - 10)", desc: false },
                        {
                            id: "desc",
                            label: "Decrescente (10 - 0)",
                            desc: true,
                        },
                    ]}
                />
            ),
        });

        if (isGipe) {
            dynamicColumns.push({
                accessorKey: "dre",
                header: ({ column, table }) => (
                    <SortHeader
                        column={column}
                        table={table}
                        title="DRE"
                        options={[
                            {
                                id: "alpha",
                                label: "Ordem alfabética (A - Z)",
                                desc: false,
                            },
                            {
                                id: "alphaInv",
                                label: "Ordem alfabética inversa (Z - A)",
                                desc: true,
                            },
                        ]}
                        selectedIdMapper={(sortState) => {
                            if (!sortState) return undefined;
                            return sortState.desc ? "alphaInv" : "alpha";
                        }}
                    />
                ),
                sortingFn: (rowA, rowB, columnId) => {
                    const a = String(rowA.getValue(columnId)).toLowerCase();
                    const b = String(rowB.getValue(columnId)).toLowerCase();
                    return a.localeCompare(b);
                },
            });
        }

        if (isGipe || isPontoFocal) {
            dynamicColumns.push({
                accessorKey: "nomeUe",
                header: ({ column, table }) => (
                    <SortHeader
                        column={column}
                        table={table}
                        title="Nome da UE"
                        options={[
                            {
                                id: "alpha",
                                label: "Ordem alfabética (A - Z)",
                                desc: false,
                            },
                            {
                                id: "alphaInv",
                                label: "Ordem alfabética inversa (Z - A)",
                                desc: true,
                            },
                        ]}
                        selectedIdMapper={(sortState) => {
                            if (!sortState) return undefined;
                            return sortState.desc ? "alphaInv" : "alpha";
                        }}
                    />
                ),
                sortingFn: (rowA, rowB, columnId) => {
                    const a = String(rowA.getValue(columnId)).toLowerCase();
                    const b = String(rowB.getValue(columnId)).toLowerCase();
                    return a.localeCompare(b);
                },
            });
        }

        dynamicColumns.push({
            accessorKey: "tipoViolencia",
            header: ({ column, table }) => (
                <SortHeader
                    column={column}
                    table={table}
                    title="Tipo de violência"
                    options={[
                        {
                            id: "alpha",
                            label: "Ordem alfabética (A - Z)",
                            desc: false,
                        },
                        {
                            id: "alphaInv",
                            label: "Ordem alfabética inversa (Z - A)",
                            desc: true,
                        },
                    ]}
                    selectedIdMapper={(sortState) => {
                        if (!sortState) return undefined;
                        return sortState.desc ? "alphaInv" : "alpha";
                    }}
                />
            ),
            sortingFn: (rowA, rowB, columnId) => {
                const a = String(rowA.getValue(columnId)).toLowerCase();
                const b = String(rowB.getValue(columnId)).toLowerCase();
                return a.localeCompare(b);
            },
        });

        dynamicColumns.push({
            accessorKey: "status",
            header: ({ column, table }) => (
                <SortHeader
                    column={column}
                    table={table}
                    title="Status"
                    options={[
                        { id: "incompleta", label: "Incompleta", desc: false },
                        {
                            id: "em-andamento",
                            label: "Em andamento",
                            desc: false,
                        },
                        { id: "finalizada", label: "Finalizada", desc: false },
                    ]}
                    selectedIdMapper={() => getStatusSelectedId()}
                    onSelect={(opt) =>
                        handleStatusSelect(opt, table, column.id)
                    }
                />
            ),
            sortingFn: (rowA, rowB, columnId) => {
                const a = String(rowA.getValue(columnId));
                const b = String(rowB.getValue(columnId));
                const priority = getStatusPriority();
                const va = priority[a];
                const vb = priority[b];
                return va - vb;
            },
            cell: ({ row }) => {
                const status = row.getValue("status");
                return <StatusBadge status={status as string} />;
            },
        });

        dynamicColumns.push({
            id: "acao",
            header: () => (
                <div className="font-semibold text-gray-700">Ação</div>
            ),
            size: 49,
            cell: () => {
                return (
                    <div className="flex h-full items-center justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={
                                            "h-[27px] w-[27px] p-0 rounded-[4px] bg-white border border-[#086397] hover:bg-gray-100"
                                        }
                                    >
                                        <span className="sr-only">
                                            Visualizar
                                        </span>
                                        <Search className="h-3 w-3 text-[#086397]" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Visualizar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                );
            },
        });

        return dynamicColumns;
    }, [isGipe, isPontoFocal]);

    return columns;
};
