"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SortMenu from "./SortMenu";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
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

            let chevronElement: React.ReactNode;
            if (sortState) {
                chevronElement = sortState.desc ? (
                    <ChevronDown className="h-4 w-4 text-[#42474a]" />
                ) : (
                    <ChevronUp className="h-4 w-4 text-[#42474a]" />
                );
            } else {
                chevronElement = (
                    <span className="flex flex-col items-center gap-0">
                        <ChevronUp className="h-3 w-3 text-[#42474a] opacity-40" />
                        <ChevronDown className="h-3 w-3 text-[#42474a] opacity-40" />
                    </span>
                );
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
                            {chevronElement}
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
                selectedId = sortState.desc ? "recent" : "oldest";
            }

            let chevronElement: React.ReactNode;
            if (sortState) {
                chevronElement = sortState.desc ? (
                    <ChevronDown className="h-4 w-4 text-[#42474a]" />
                ) : (
                    <ChevronUp className="h-4 w-4 text-[#42474a]" />
                );
            } else {
                chevronElement = (
                    <span className="flex flex-col items-center gap-0">
                        <ChevronUp className="h-3 w-3 text-[#42474a] opacity-40" />
                        <ChevronDown className="h-3 w-3 text-[#42474a] opacity-40" />
                    </span>
                );
            }

            return (
                <div className="flex items-center justify-between">
                    <SortMenu
                        options={[
                            {
                                id: "recent",
                                label: "Do mais recente ao mais antigo",
                                desc: true,
                            },
                            {
                                id: "oldest",
                                label: "Do mais antigo ao mais recente",
                                desc: false,
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
                            {chevronElement}
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

            let chevronElement2: React.ReactNode;
            if (sortState) {
                chevronElement2 = sortState.desc ? (
                    <ChevronDown className="h-4 w-4 text-[#42474a]" />
                ) : (
                    <ChevronUp className="h-4 w-4 text-[#42474a]" />
                );
            } else {
                chevronElement2 = (
                    <span className="flex flex-col items-center gap-0">
                        <ChevronUp className="h-3 w-3 text-[#42474a] opacity-40" />
                        <ChevronDown className="h-3 w-3 text-[#42474a] opacity-40" />
                    </span>
                );
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
                            {chevronElement2}
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

            let chevronElement: React.ReactNode;
            if (sortState) {
                chevronElement = sortState.desc ? (
                    <ChevronDown className="h-4 w-4 text-[#42474a]" />
                ) : (
                    <ChevronUp className="h-4 w-4 text-[#42474a]" />
                );
            } else {
                chevronElement = (
                    <span className="flex flex-col items-center gap-0">
                        <ChevronUp className="h-3 w-3 text-[#42474a] opacity-40" />
                        <ChevronDown className="h-3 w-3 text-[#42474a] opacity-40" />
                    </span>
                );
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
                            {chevronElement}
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
            const sortState = table
                .getState()
                .sorting.find((s) => s.id === column.id);
            let selectedId: string | undefined = undefined;
            if (sortState) {
                selectedId = sortState.desc ? "finalizada" : "incompleta";
            }

            let chevronElement: React.ReactNode;
            if (sortState) {
                chevronElement = sortState.desc ? (
                    <ChevronDown className="h-4 w-4 text-[#42474a]" />
                ) : (
                    <ChevronUp className="h-4 w-4 text-[#42474a]" />
                );
            } else {
                chevronElement = (
                    <span className="flex flex-col items-center gap-0">
                        <ChevronUp className="h-3 w-3 text-[#42474a] opacity-40" />
                        <ChevronDown className="h-3 w-3 text-[#42474a] opacity-40" />
                    </span>
                );
            }

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
                                desc: true,
                            },
                        ]}
                        selectedId={selectedId}
                        onSelect={(opt) => {
                            table.setSorting([
                                { id: column.id, desc: Boolean(opt.desc) },
                            ]);
                        }}
                    >
                        <div className="text-[14px] text-[#42474a] flex items-center gap-2">
                            <span>Status</span>
                            {chevronElement}
                        </div>
                    </SortMenu>
                </div>
            );
        },
        sortingFn: (rowA, rowB, columnId) => {
            const order: Record<string, number> = {
                Incompleta: 0,
                "Em andamento": 1,
                Finalizada: 2,
            };
            const a = String(rowA.getValue(columnId));
            const b = String(rowB.getValue(columnId));
            const va = order[a] ?? 0;
            const vb = order[b] ?? 0;
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
