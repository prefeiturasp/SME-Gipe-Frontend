"use client";

import type { IntercorrenciaStatus } from "@/actions/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface StatusUEDado {
    label: string;
    sublabel: string;
    total: number;
    patrimonial: number;
    interpessoal: number;
    cor: string;
}

const STATUS_CONFIG: Record<
    string,
    { label: string; sublabel: string; cor: string }
> = {
    "Em andamento": {
        label: "Intercorrências em andamento",
        sublabel: "em andamento",
        cor: "#283890",
    },
    Incompleta: {
        label: "Intercorrências incompletas",
        sublabel: "incompletas",
        cor: "#E9511D",
    },
    Finalizada: {
        label: "Intercorrências finalizadas",
        sublabel: "finalizadas",
        cor: "#4CAF50",
    },
    Migrada: {
        label: "Intercorrências migradas",
        sublabel: "migradas",
        cor: "#607D8B",
    },
};

const ALL_STATUS_KEYS = ["Em andamento", "Incompleta", "Finalizada", "Migrada"];

interface TooltipStatusProps {
    readonly active?: boolean;
    readonly hoveredLabel: string | null;
    readonly statusData: StatusUEDado[];
}

function TooltipStatus({
    active,
    hoveredLabel,
    statusData,
}: TooltipStatusProps) {
    if (!active || !hoveredLabel) return null;
    const status = statusData.find((d) => d.label === hoveredLabel);
    if (!status) return null;
    return (
        <div className="bg-white border border-[#e0e0e0] rounded-[4px] p-3 shadow text-[12px]">
            <p className="text-[#42474A] text-[14px] mb-1">
                Total: <b>{status.total} intercorrências</b>
            </p>
            <hr className="border-t border-[#DADADA] mb-1" />
            <p className="text-[#42474A] text-[14px]">
                Patrimonial: <b>{status.patrimonial}</b>
            </p>
            <p className="text-[#42474A] text-[14px]">
                Interpessoal: <b>{status.interpessoal}</b>
            </p>
        </div>
    );
}

function GraficoStatusUESkeleton() {
    return (
        <div className="bg-white rounded-[4px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                {ALL_STATUS_KEYS.map((key) => (
                    <div
                        key={`skeleton-${key}`}
                        className="flex flex-col gap-1"
                    >
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function buildStatusData(
    intercorrenciasStatus?: IntercorrenciaStatus[],
): StatusUEDado[] {
    const analyticsMap = new Map(
        (intercorrenciasStatus ?? []).map((item) => [item.status, item]),
    );

    return ALL_STATUS_KEYS.map((key) => {
        const config = STATUS_CONFIG[key];
        const analytics = analyticsMap.get(key);
        return {
            label: config.label,
            sublabel: config.sublabel,
            total: analytics?.total ?? 0,
            patrimonial: analytics?.patrimonial ?? 0,
            interpessoal: analytics?.interpessoal ?? 0,
            cor: config.cor,
        };
    });
}

export default function GraficoStatusUE({
    isLoading = false,
    pdfLayout = false,
    intercorrenciasStatus,
}: Readonly<{
    isLoading?: boolean;
    pdfLayout?: boolean;
    intercorrenciasStatus?: IntercorrenciaStatus[];
}>) {
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

    const statusData = useMemo(
        () => buildStatusData(intercorrenciasStatus),
        [intercorrenciasStatus],
    );

    const total = statusData.reduce((acc, d) => acc + d.total, 0);

    const chartData = [
        statusData.reduce<Record<string, number>>(
            (acc, d) => ({ ...acc, [d.label]: d.total }),
            {},
        ),
    ];

    if (isLoading) return <GraficoStatusUESkeleton />;

    return (
        <div
            className={`bg-white rounded-[4px] p-6 flex flex-col gap-4${pdfLayout ? "" : " shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)]"}`}
        >
            <div>
                <h2 className="text-[#42474a] text-[20px] font-bold">
                    Intercorrências por UE
                </h2>
                <p className="text-[#42474a] text-[14px] mt-1">
                    Acompanhe o volume total de intercorrências registradas
                    pelas Unidades Educacionais e a distribuição dos registros
                    por status.
                </p>
            </div>

            <p className="text-[#42474a] text-[14px] font-bold">
                Quantidade de intercorrências por status:
            </p>

            <ResponsiveContainer width="100%" height={32}>
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    barSize={32}
                >
                    <XAxis type="number" domain={[0, total]} hide />
                    <YAxis type="category" hide />
                    <Tooltip
                        content={
                            <TooltipStatus
                                hoveredLabel={hoveredLabel}
                                statusData={statusData}
                            />
                        }
                        cursor={{ fill: "transparent" }}
                    />
                    {statusData
                        .filter((d) => d.total > 0)
                        .map((d) => (
                            <Bar
                                key={d.label}
                                dataKey={d.label}
                                stackId="stack"
                                fill={d.cor}
                                isAnimationActive={false}
                                onMouseEnter={() => setHoveredLabel(d.label)}
                                onMouseLeave={() => setHoveredLabel(null)}
                            />
                        ))}
                </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                {statusData.map((d) => (
                    <div key={d.label} className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span
                                className="inline-block w-3 h-3 rounded-[2px] shrink-0"
                                style={{ backgroundColor: d.cor }}
                            />
                            <span className="text-[#42474a] text-[14px] font-bold leading-tight">
                                {d.label}:
                            </span>
                        </div>
                        <p className="text-[#595959] text-[14px] pl-[18px]">
                            Total:{" "}
                            <b>
                                {d.total === 0
                                    ? "0"
                                    : String(d.total).padStart(2, "0")}
                            </b>
                        </p>
                        <p className="text-[#595959] text-[14px] pl-[18px]">
                            Patrimoniais:{" "}
                            <b>
                                {d.patrimonial === 0
                                    ? "0"
                                    : String(d.patrimonial).padStart(2, "0")}
                            </b>
                        </p>
                        <p className="text-[#595959] text-[14px] pl-[18px]">
                            Interpessoais:{" "}
                            <b>
                                {d.interpessoal === 0
                                    ? "0"
                                    : String(d.interpessoal).padStart(2, "0")}
                            </b>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
