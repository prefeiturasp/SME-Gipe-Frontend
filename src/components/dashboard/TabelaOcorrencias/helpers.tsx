"use client";

import React from "react";
import SortMenu from "./SortMenu";
import { Badge } from "@/components/ui/badge";
import { Column, Table } from "@tanstack/react-table";

export type SortOption = { id: string | number; label: string; desc: boolean };

let statusPriority: Record<string, number> = {
    Incompleta: 0,
    "Em andamento": 1,
    Finalizada: 2,
};

let statusSelectedId: string | undefined = undefined;

export function getStatusPriority() {
    return statusPriority;
}

export function getStatusSelectedId() {
    return statusSelectedId;
}

export function handleStatusSelect<TData = unknown>(
    opt: { id: string | number; desc: boolean },
    table: Table<TData>,
    columnId: string
) {
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

    table.setSorting([{ id: columnId, desc: Boolean(opt.desc) }]);
}

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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

    return <Badge className={className}>{status}</Badge>;
};

type SortState = { id: string; desc?: boolean } | undefined;

export const SortHeader = <TData,>({
    column,
    table,
    title,
    options,
    selectedIdMapper,
    onSelect,
}: {
    column: Column<TData, unknown>;
    table: Table<TData>;
    title: string;
    options: SortOption[];
    selectedIdMapper?: (sortState: SortState) => string | undefined;
    onSelect?: (opt: SortOption) => void;
}) => {
    const sortState: SortState = table
        .getState()
        .sorting.find((s) => s.id === column.id) as SortState;

    let selectedId: string | undefined;
    if (selectedIdMapper) {
        selectedId = selectedIdMapper(sortState);
    } else if (sortState) {
        selectedId = sortState.desc ? "desc" : "asc";
    } else {
        selectedId = undefined;
    }

    return (
        <div className="flex items-center justify-between">
            <SortMenu
                options={options}
                selectedId={selectedId}
                onSelect={(opt: SortOption) => {
                    if (onSelect) {
                        onSelect(opt);
                    } else {
                        table.setSorting([{ id: column.id, desc: opt.desc }]);
                    }
                }}
            >
                <div className="text-[14px] text-[#42474a] flex items-center gap-2">
                    <span>{title}</span>
                </div>
            </SortMenu>
        </div>
    );
};
