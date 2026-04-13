"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { statusUEData } from "./mockData";

interface TooltipStatusProps {
    readonly active?: boolean;
    readonly hoveredLabel: string | null;
}

function TooltipStatus({ active, hoveredLabel }: TooltipStatusProps) {
    if (!active || !hoveredLabel) return null;
    const status = statusUEData.find((d) => d.label === hoveredLabel);
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
                {statusUEData.map((d) => (
                    <div
                        key={`skeleton-${d.label}`}
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

export default function GraficoStatusUE({
    isLoading = false,
    pdfLayout = false,
}: Readonly<{ isLoading?: boolean; pdfLayout?: boolean }>) {
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
    const total = statusUEData.reduce((acc, d) => acc + d.total, 0);

    const chartData = [
        statusUEData.reduce<Record<string, number>>(
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
                        content={<TooltipStatus hoveredLabel={hoveredLabel} />}
                        cursor={{ fill: "transparent" }}
                    />
                    {statusUEData
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
                {statusUEData.map((d) => (
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
