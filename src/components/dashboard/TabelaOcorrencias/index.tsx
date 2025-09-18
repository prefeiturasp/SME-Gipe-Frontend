"use client";

import React, { useEffect, useState } from "react";
import { columns, Ocorrencia } from "./columns";
import { DataTable } from "./data-table";
import { getData } from "./mockData";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import Export from "@/assets/icons/Export";

export default function TabelaOcorrencias() {
    const [data, setData] = useState<Ocorrencia[]>([]);

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
                    <Button variant="customOutline" size="sm">
                        <ListFilter size="16" className="mr-1" />
                        Filtrar
                    </Button>
                </div>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
