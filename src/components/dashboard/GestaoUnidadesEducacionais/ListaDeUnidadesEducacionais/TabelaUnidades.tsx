import { useEffect, useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Editar from "@/assets/icons/Editar";
import { UnidadeEducacional } from "@/types/unidades";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TabelaUnidadesProps = {
    dataUnidades: UnidadeEducacional[];
};

export default function TabelaUnidades({
    dataUnidades,
}: Readonly<TabelaUnidadesProps>) {
    const PAGE_SIZE = 10;
    const styeTable = "px-2 text-[#42474a] text-left last:text-text-left!";
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        setPageIndex(0);
    }, [dataUnidades]);

    const pageCount = Math.max(Math.ceil(dataUnidades.length / PAGE_SIZE), 1);

    const paginatedUnidades = useMemo(() => {
        const start = pageIndex * PAGE_SIZE;
        return dataUnidades.slice(start, start + PAGE_SIZE);
    }, [dataUnidades, pageIndex]);

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount - 1;

    return (
        <>
            <div className="rounded-md border border-gray-300">
                <Table data-testid="tabela-unidades">
                    <TableHeader>
                        <TableRow>
                            <TableHead className={styeTable}>Unidade Educacional</TableHead>
                            <TableHead className={styeTable}>Tipo</TableHead>
                            <TableHead className={styeTable}>Rede</TableHead>
                            <TableHead className={styeTable}>Código EOL</TableHead>
                            <TableHead className={styeTable}>Diretoria Regional</TableHead>
                            <TableHead className={styeTable}>Sigla DRE</TableHead>
                            <TableHead className="text-center">Ação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUnidades.length > 0 ? (
                            paginatedUnidades.map((unidade) => {
                                return (
                                    <TableRow key={unidade.uuid }>
                                        <TableCell>{unidade.nome}</TableCell>
                                        <TableCell className={styeTable}>{unidade.tipo_unidade}</TableCell>
                                        <TableCell className={styeTable}>{unidade.rede_label}</TableCell>
                                        <TableCell className={styeTable}>{unidade.codigo_eol}</TableCell>
                                        <TableCell className={styeTable}>{unidade.dre_nome}</TableCell>
                                        <TableCell className={styeTable}>{unidade.sigla}</TableCell>
                                        <TableCell className={styeTable}><Editar /></TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-24 text-center"
                                >
                                    Nenhuma Unidade Educacional encontrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                    variant="pagination"
                    size="icon"
                    onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={!canPreviousPage}
                    className="w-[32px] h-[32px]"
                    data-testid="prev-page-button"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex space-x-1">
                    {Array.from({ length: pageCount }).map((_, index) => (
                        <Button
                            key={`page-${index + 1}`}
                            variant={pageIndex === index ? "paginationActive" : "pagination"}
                            size="sm"
                            className="w-[32px] h-[32px]"
                            onClick={() => setPageIndex(index)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="pagination"
                    size="icon"
                    onClick={() =>
                        setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))
                    }
                    disabled={!canNextPage}
                    className="w-[32px] h-[32px]"
                    data-testid="next-page-button"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
}
