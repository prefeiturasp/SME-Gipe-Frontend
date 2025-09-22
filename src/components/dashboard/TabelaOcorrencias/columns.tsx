"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SortMenu from "./SortMenu";
import { Search } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export type Ocorrencia = {
    protocolo: string;
    dataHora: string;
    codigoEol: string;
    tipoViolencia: string;
    status: "Incompleta" | "Finalizada" | "Em andamento";
    id: string;
};

let statusPriority: Record<string, number> = {
    Incompleta: 0,
    "Em andamento": 1,
    Finalizada: 2,
};

let statusSelectedId: string | undefined = undefined;

export const columns: ColumnDef<Ocorrencia>[] = [
    {
        accessorKey: "protocolo",
        header: ({ column, table }) => {
            const sortState = table
                .getState()
                .sorting.find((s) => s.id === column.id);
            let selectedId: string | undefined = undefined;
            if (sortState) {
                selectedId = sortState.desc ? "desc" : "asc";
            }

            return (
                <div className="flex items-center justify-between">
                    <SortMenu
                        options={[
                            {
                                id: "asc",
                                label: "Crescente (0 - 10)",
                                desc: false,
                            },
                            {
                                id: "desc",
                                label: "Decrescente (10 - 0)",
                                desc: true,
                            },
                        ]}
                        selectedId={selectedId}
                        onSelect={(opt) => {
                            table.setSorting([
                                { id: column.id, desc: opt.desc },
                            ]);
                        }}
                    >
                        <div className="text-[14px] text-[#42474a] flex items-center gap-2">
                            <span>Protocolo</span>
                        </div>
                    </SortMenu>
                </div>
            );
        },
    },
    {
        accessorKey: "dataHora",
        header: ({ column, table }) => {
            const sortState = table
                .getState()
                .sorting.find((s) => s.id === column.id);
            let selectedId: string | undefined = undefined;
            if (sortState) {
                selectedId = sortState.desc ? "oldest" : "recent";
            }

            return (
                <div className="flex items-center justify-between">
                    <SortMenu
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
                        selectedId={selectedId}
                        onSelect={(opt) => {
                            table.setSorting([
                                { id: column.id, desc: opt.desc },
                            ]);
                        }}
                    >
                        <div className="text-[14px] text-[#42474a] flex items-center gap-2">
                            <span>Data/Hora</span>
                        </div>
                    </SortMenu>
                </div>
            );
        },
    },
    {
        accessorKey: "codigoEol",
        header: ({ column, table }) => {
            const sortState = table
                .getState()
                .sorting.find((s) => s.id === column.id);
            let selectedId: string | undefined = undefined;
            if (sortState) {
                selectedId = sortState.desc ? "desc" : "asc";
            }

            return (
                <div className="flex items-center justify-between">
                    <SortMenu
                        options={[
                            {
                                id: "asc",
                                label: "Crescente (0 - 10)",
                                desc: false,
                            },
                            {
                                id: "desc",
                                label: "Decrescente (10 - 0)",
                                desc: true,
                            },
                        ]}
                        selectedId={selectedId}
                        onSelect={(opt) => {
                            table.setSorting([
                                { id: column.id, desc: opt.desc },
                            ]);
                        }}
                    >
                        <div className="text-[14px] text-[#42474a] flex items-center gap-2">
                            <span>Código EOL</span>
                        </div>
                    </SortMenu>
                </div>
            );
        },
    },
    {
        accessorKey: "tipoViolencia",
        header: ({ column, table }) => {
            const sortState = table
                .getState()
                .sorting.find((s) => s.id === column.id);
            let selectedId: string | undefined = undefined;
            if (sortState) {
                selectedId = sortState.desc ? "alphaInv" : "alpha";
            }

            return (
                <div className="flex items-center justify-between">
                    <SortMenu
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
                        selectedId={selectedId}
                        onSelect={(opt) => {
                            table.setSorting([
                                { id: column.id, desc: opt.desc },
                            ]);
                        }}
                    >
                        <div className="text-[14px] text-[#42474a] flex items-center gap-2">
                            <span>Tipo de violência</span>
                        </div>
                    </SortMenu>
                </div>
            );
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = String(rowA.getValue(columnId)).toLowerCase();
            const b = String(rowB.getValue(columnId)).toLowerCase();
            return a.localeCompare(b);
        },
    },
    {
        accessorKey: "status",
        header: ({ column, table }) => {
            return (
                <div className="flex items-center justify-between">
                    <SortMenu
                        options={[
                            {
                                id: "incompleta",
                                label: "Incompleta",
                                desc: false,
                            },
                            {
                                id: "em-andamento",
                                label: "Em andamento",
                                desc: false,
                            },
                            {
                                id: "finalizada",
                                label: "Finalizada",
                                desc: false,
                            },
                        ]}
                        selectedId={statusSelectedId}
                        onSelect={(opt) => {
                            statusSelectedId = String(opt.id);
                            if (opt.id === "incompleta") {
                                statusPriority = {
                                    Incompleta: 0,
                                    "Em andamento": 1,
                                    Finalizada: 2,
                                };
                            } else if (opt.id === "em-andamento") {
                                statusPriority = {
                                    "Em andamento": 0,
                                    Incompleta: 1,
                                    Finalizada: 2,
                                };
                            } else if (opt.id === "finalizada") {
                                statusPriority = {
                                    Finalizada: 0,
                                    "Em andamento": 1,
                                    Incompleta: 2,
                                };
                            }

                            table.setSorting([
                                { id: column.id, desc: Boolean(opt.desc) },
                            ]);
                        }}
                    >
                        <div className="text-[14px] text-[#42474a] flex items-center gap-2">
                            <span>Status</span>
                        </div>
                    </SortMenu>
                </div>
            );
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = String(rowA.getValue(columnId));
            const b = String(rowB.getValue(columnId));
            const va = statusPriority[a] ?? 0;
            const vb = statusPriority[b] ?? 0;
            return va - vb;
        },
        cell: ({ row }) => {
            const status = row.getValue("status");
            let className;

            switch (status) {
                case "Incompleta":
                    className = "bg-[#D06D12] hover:bg-[#D06D12]";
                    break;
                case "Finalizada":
                    className = "bg-[#297805] hover:bg-[#297805]";
                    break;
                case "Em andamento":
                    className = "bg-[#086397] hover:bg-[#086397]";
                    break;
                default:
                    className = "bg-muted";
            }

            return <Badge className={className}>{status as string}</Badge>;
        },
    },
    {
        id: "acao",
        header: () => <div className="font-semibold text-gray-700">Ação</div>,
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
                                    <span className="sr-only">Visualizar</span>
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
    },
];
