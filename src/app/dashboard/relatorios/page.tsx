"use client";

import Export from "@/assets/icons/Export";
import FilterPanel from "@/components/dashboard/ExtracaoDados/FilterPanel";
import { Button } from "@/components/ui/button";

export default function ExtracaoDadosPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-end justify-between px-4">
                <div>
                    <h1 className="text-[#42474a] text-[20px] font-bold m-0">
                        Extração de dados
                    </h1>
                    <p className="text-[#595959] text-[13px] mt-1">
                        Confira todas as intercorrências registradas no sistema
                        e exporte os dados em PDF de forma rápida e prática.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-[#5B78C7] text-[#5B78C7] hover:bg-blue-50 text-[13px] shrink-0"
                >
                    <Export width={14} height={14} className="fill-[#5B78C7]" />
                    Exportar dados
                </Button>
            </div>

            <div className="flex gap-4 items-start flex-1 min-h-0">
                <FilterPanel />
            </div>
        </div>
    );
}
