"use client";

import { cn } from "@/lib/utils";
import {
    Cell,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Header,
    useReactTable,
} from "@tanstack/react-table";

import Alert from "@/assets/icons/Alert";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Ocorrencia } from "@/types/ocorrencia";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOcorrenciasColumns } from "./useOcorrenciasColumns";

export function resolveColId<TData, TValue>(
    node: Header<TData, TValue> | Cell<TData, TValue>
) {
    return node?.column?.id ?? node?.id;
}

export function hasColumnFlag<TData, TValue>(
    node: Header<TData, TValue> | Cell<TData, TValue>
) {
    return node?.column ? "true" : "false";
}

export function DataTable({ data }: Readonly<{ data: Ocorrencia[] }>) {
    const columns = useOcorrenciasColumns();

    const table = useReactTable({
        data,
        columns,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div>
            <div className="rounded-md border border-gray-300">
                <Table>
                    <TableHeader className="bg-[#F5F6F8]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const colId = resolveColId(header);
                                    const isAction = colId === "acao";

                                    return (
                                        <TableHead
                                            key={header.id}
                                            data-testid={`th-${colId}`}
                                            data-has-column={hasColumnFlag(
                                                header
                                            )}
                                            className={cn(
                                                "px-2 text-[#42474a] text-left",
                                                isAction
                                                    ? "w-[49px] min-w-[49px] max-w-[49px] whitespace-nowrap"
                                                    : ""
                                            )}
                                        >
                                            {flexRender(
                                                header.column?.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-b border-gray-200 hover:bg-gray-100"
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const colId = resolveColId(cell);
                                        const isAction = colId === "acao";

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                data-testid={`td-${colId}`}
                                                data-has-column={hasColumnFlag(
                                                    cell
                                                )}
                                                className={cn(
                                                    "px-2 text-sm text-gray-800",
                                                    isAction
                                                        ? "w-[49px] min-w-[49px] max-w-[49px] px-0"
                                                        : ""
                                                )}
                                            >
                                                {isAction ? (
                                                    flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )
                                                ) : (
                                                    <div className="line-clamp-2">
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllLeafColumns().length}
                                    className="h-[150px] !table-cell text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-3 h-full w-full">
                                        <Alert
                                            className="w-6 h-6"
                                            style={{ fill: "#717FC7" }}
                                        />
                                        <h3 className="text-[14px] font-bold text-[#42474A] mb-[-15px]">
                                            Nenhum resultado encontrado!
                                        </h3>
                                        <p className="text-[14px] text-[#42474A] max-w-md">
                                            Não há registros de intercorrências
                                            que atendam aos filtros aplicados.
                                        </p>
                                    </div>
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
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="w-[32px] h-[32px]"
                    data-testid="prev-page-button"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex space-x-1">
                    {table.getPageCount() > 0 &&
                        [...Array(table.getPageCount())].map((_, index) => (
                            <Button
                                key={`page-${index + 1}`}
                                variant={
                                    table.getState().pagination.pageIndex ===
                                    index
                                        ? "paginationActive"
                                        : "pagination"
                                }
                                size="sm"
                                className="w-[32px] h-[32px]"
                                onClick={() => table.setPageIndex(index)}
                            >
                                {index + 1}
                            </Button>
                        ))}
                </div>

                <Button
                    variant="pagination"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="w-[32px] h-[32px]"
                    data-testid="next-page-button"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
