import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";

import Editar from "@/assets/icons/Editar";
import TablePagination from "@/components/shared/TablePagination";
import { Button } from "@/components/ui/button";
import { UnidadeEducacional } from "@/types/unidades";
import Link from "next/link";

type TabelaUnidadesProps = {
    dataUnidades: UnidadeEducacional[];
    status: "ativa" | "inativa";
};

export default function TabelaUnidades({
    dataUnidades,
    status,
}: Readonly<TabelaUnidadesProps>) {
    const PAGE_SIZE = 10;
    const isInativa = status === "inativa";
    const textColor = isInativa ? "text-[#B0B0B0]" : "text-[#42474a]";
    const styeTable = `px-2 ${textColor} text-left last:text-text-left!`;
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
                            <TableHead className={styeTable}>
                                Unidade Educacional
                            </TableHead>
                            <TableHead className={styeTable}>
                                Etapa/modalidade
                            </TableHead>
                            <TableHead className={styeTable}>Tipo</TableHead>
                            <TableHead className={styeTable}>
                                Código EOL
                            </TableHead>
                            <TableHead className={styeTable}>
                                Diretoria Regional
                            </TableHead>
                            <TableHead className={styeTable}>
                                Sigla DRE
                            </TableHead>
                            <TableHead
                                className={`text-center w-[49px] ${textColor}`}
                            >
                                Ação
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUnidades.length > 0 ? (
                            paginatedUnidades.map((unidade) => {
                                return (
                                    <TableRow key={unidade.uuid}>
                                        <TableCell className={styeTable}>
                                            {unidade.nome}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {unidade.tipo_unidade}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {unidade.rede_label}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {unidade.codigo_eol}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {unidade.dre_nome}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {unidade.sigla}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            <Button
                                                variant="ghost"
                                                className={
                                                    "h-[27px] w-[27px] p-0 rounded-[4px] bg-white hover:bg-gray-100"
                                                }
                                                asChild
                                            >
                                                <Link
                                                    href={`/dashboard/gestao-unidades-educacionais/editar/${unidade.uuid}`}
                                                >
                                                    <span className="sr-only">
                                                        Visualizar
                                                    </span>
                                                    <Editar />
                                                </Link>
                                            </Button>
                                        </TableCell>
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

            <TablePagination
                pageIndex={pageIndex}
                pageCount={pageCount}
                onPageChange={setPageIndex}
                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}
            />
        </>
    );
}
