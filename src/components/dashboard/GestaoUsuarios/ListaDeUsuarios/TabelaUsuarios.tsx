"use client";

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
import TablePagination from "@/components/shared/TablePagination";
import { Button } from "@/components/ui/button";
import { Usuario } from "@/types/usuarios";
import Link from "next/link";

type TabelaUsuariosProps = {
    dataUsuarios: Usuario[];
    status: "ativos" | "inativos";
};

export default function TabelaUsuarios({
    dataUsuarios,
    status,
}: Readonly<TabelaUsuariosProps>) {
    const PAGE_SIZE = 10;
    const isInativo = status === "inativos";
    const textColor = isInativo ? "text-[#B0B0B0]" : "text-[#42474a]";
    const styeTable = `px-2 ${textColor} text-left last:text-text-left!`;
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        setPageIndex(0);
    }, [dataUsuarios]);

    const pageCount = Math.max(Math.ceil(dataUsuarios.length / PAGE_SIZE), 1);

    const paginatedUsuarios = useMemo(() => {
        const start = pageIndex * PAGE_SIZE;
        return dataUsuarios.slice(start, start + PAGE_SIZE);
    }, [dataUsuarios, pageIndex]);

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount - 1;

    return (
        <>
            <div className="rounded-md border border-gray-300">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={styeTable}>Perfil</TableHead>
                            <TableHead className={styeTable}>Nome</TableHead>
                            <TableHead className={styeTable}>
                                RF ou CPF
                            </TableHead>
                            <TableHead className={styeTable}>Email</TableHead>
                            <TableHead className={styeTable}>Rede</TableHead>
                            <TableHead className={styeTable}>
                                Diretoria Regional
                            </TableHead>
                            <TableHead className={styeTable}>
                                Unidade Educacional
                            </TableHead>
                            <TableHead
                                className={`text-center w-[49px] ${textColor}`}
                            >
                                Ação
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsuarios.length > 0 ? (
                            paginatedUsuarios.map((usuario, index) => {
                                const rowKey =
                                    usuario.uuid ?? String(usuario.id ?? index);

                                return (
                                    <TableRow key={rowKey}>
                                        <TableCell className={styeTable}>
                                            {usuario.perfil}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {usuario.nome}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {usuario.rf_ou_cpf}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {usuario.email}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {usuario.rede}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {usuario.diretoria_regional}
                                        </TableCell>
                                        <TableCell className={styeTable}>
                                            {usuario.unidade_educacional}
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
                                                    href={`/dashboard/gestao-usuarios/editar/${usuario.uuid}`}
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
                                    Nenhum usuário encontrado.
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
