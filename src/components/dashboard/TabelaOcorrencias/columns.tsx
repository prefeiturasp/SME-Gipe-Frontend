"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export const columns: ColumnDef<Ocorrencia>[] = [
    {
        accessorKey: "protocolo",
        header: () => (
            <div className="text-[14px] text-[#42474a]">Protocolo</div>
        ),
    },
    {
        accessorKey: "dataHora",
        header: () => (
            <div className="text-[14px] text-[#42474a]">Data/Hora</div>
        ),
    },
    {
        accessorKey: "codigoEol",
        header: () => (
            <div className="text-[14px] text-[#42474a]">Código EOL</div>
        ),
    },
    {
        accessorKey: "tipoViolencia",
        header: () => (
            <div className="text-[14px] text-[#42474a]">Tipo de violência</div>
        ),
    },
    {
        accessorKey: "status",
        header: () => <div className="text-[14px] text-[#42474a]">Status</div>,
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
                                    className="
                    h-[27px] w-[27px] p-0 rounded-[4px]
                    bg-white border border-[#086397]
                    hover:bg-gray-100
                  "
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
