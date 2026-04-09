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
import { dreData } from "./mockData";

interface TooltipDREProps {
    readonly active?: boolean;
    readonly hoveredNome: string | null;
}

function TooltipDRE({ active, hoveredNome }: TooltipDREProps) {
    if (!active || !hoveredNome) return null;
    const dre = dreData.find((d) => d.nome === hoveredNome);
    if (!dre) return null;
    return (
        <div className="bg-white border border-[#e0e0e0] rounded-[4px] p-2 shadow text-[12px]">
            <p className="font-bold text-[#42474a] text-[14px] mb-1">
                {dre.nome}
            </p>
            <hr className="border-t border-[#DADADA] mb-1" />
            <p className="text-[#595959] text-[14px]">
                Total de intercorrências: {dre.total}
            </p>
            <p className="text-[#595959] text-[14px]">
                Patrimoniais: {dre.patrimonial}
            </p>
            <p className="text-[#595959] text-[14px]">
                Interpessoais: {dre.interpessoal}
            </p>
        </div>
    );
}

function GraficoDRESkeleton() {
    return (
        <div className="bg-white rounded-[4px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-1" />
            </div>
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
            <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-1/3" />
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                    {dreData.map((d) => (
                        <div
                            key={`skeleton-${d.nome}`}
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
        </div>
    );
}

export default function GraficoDRE({
    isLoading = false,
}: Readonly<{ isLoading?: boolean }>) {
    const [hoveredNome, setHoveredNome] = useState<string | null>(null);
    const total = dreData.reduce((acc, d) => acc + d.total, 0);

    const chartData = [
        dreData.reduce<Record<string, number>>(
            (acc, d) => ({ ...acc, [d.nome]: d.total }),
            {},
        ),
    ];

    if (isLoading) return <GraficoDRESkeleton />;

    return (
        <div className="bg-white rounded-[4px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-[#42474a] text-[20px] font-bold">
                    Intercorrências por DRE
                </h2>
                <p className="text-[#42474a] text-[14px] mt-1">
                    Confira a quantidade de registros realizados nas DREs.
                </p>
            </div>

            <p className="text-[#42474a] text-[12px] font-bold">
                Total: {total} intercorrências
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
                        content={<TooltipDRE hoveredNome={hoveredNome} />}
                        cursor={{ fill: "transparent" }}
                    />
                    {dreData
                        .filter((d) => d.total > 0)
                        .map((d) => (
                            <Bar
                                key={d.nome}
                                dataKey={d.nome}
                                stackId="stack"
                                fill={d.cor}
                                isAnimationActive={false}
                                onMouseEnter={() => setHoveredNome(d.nome)}
                                onMouseLeave={() => setHoveredNome(null)}
                            />
                        ))}
                </BarChart>
            </ResponsiveContainer>

            <div>
                <p className="text-[#42474a] text-[14px] font-bold mb-3">
                    Diretorias Regionais de Educação (DREs):
                </p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                    {dreData.map((d) => (
                        <div key={d.nome} className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="inline-block w-3 h-3 rounded-[2px] shrink-0"
                                    style={{ backgroundColor: d.cor }}
                                />
                                <span className="text-[#42474a] text-[14px] font-bold leading-tight">
                                    {d.nome}
                                </span>
                            </div>
                            <p className="text-[#595959] text-[14px] pl-[18px]">
                                Total: <b>{d.total === 0 ? "0" : String(d.total).padStart(2, "0")}</b>
                            </p>
                            <p className="text-[#595959] text-[14px] pl-[18px]">
                                Patrimonial:{" "}
                                <b>{d.patrimonial === 0 ? "0" : String(d.patrimonial).padStart(2, "0")}</b>
                            </p>
                            <p className="text-[#595959] text-[14px] pl-[18px]">
                                Interpessoal:{" "}
                                <b>{d.interpessoal === 0 ? "0" : String(d.interpessoal).padStart(2, "0")}</b>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
