"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { evolucaoMensalData } from "./mockData";

interface TooltipEvolucaoProps {
    readonly active?: boolean;
    readonly label?: string;
}

function TooltipEvolucao({ active, label }: TooltipEvolucaoProps) {
    if (!active || !label) return null;
    const d = evolucaoMensalData.find((m) => m.mes === label);
    if (!d) return null;
    return (
        <div className="bg-white border border-[#e0e0e0] rounded-[4px] p-2 shadow text-[12px] flex flex-col gap-1">
            <p className="font-bold text-[#42474a] mb-1 text-[14px]">
                {d.mesLabel}/2025:
            </p>
            <hr className="border-t border-[#DADADA] mb-1" />
            <p className="text-[#42474a]">
                Total de intercorrências:{" "}
                <strong className="text-[#42474a]">{d.total}</strong>
            </p>
            <p className="text-[#42474a]">
                Patrimoniais:{" "}
                <strong className="text-[#42474a]">{d.patrimonial}</strong>
            </p>
            <p className="text-[#42474a]">
                Interpessoais:{" "}
                <strong className="text-[#42474a]">{d.interpessoal}</strong>
            </p>
        </div>
    );
}

function GraficoEvolucaoMensalSkeleton() {
    return (
        <div className="bg-white rounded-[4px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
            </div>
            <div className="flex gap-6 items-stretch">
                <div className="flex-1 min-w-0">
                    <Skeleton className="w-full h-[300px]" />
                </div>
                <div className="grid grid-cols-3 gap-x-1 gap-y-1 shrink-0">
                    {evolucaoMensalData.map((d) => (
                        <div
                            key={`skeleton-${d.mes}`}
                            className="flex flex-col gap-1 w-[151px] h-[93px] p-3 border border-[#DADADA]"
                        >
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-2/3" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function GraficoEvolucaoMensal({
    isLoading = false,
}: Readonly<{ isLoading?: boolean }>) {
    if (isLoading) return <GraficoEvolucaoMensalSkeleton />;
    return (
        <div className="bg-white rounded-[4px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-[#42474a] text-[20px] font-bold">
                    Evolução mensal
                </h2>
                <p className="text-[#42474a] text-[14px] mt-1">
                    Confira a quantidade de registros realizados em cada mês.
                </p>
            </div>

            <div className="flex gap-6 items-stretch">
                <div className="flex-1 min-w-0 flex flex-col">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={evolucaoMensalData}
                            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="4 4"
                                stroke="#e8e8e8"
                            />
                            <XAxis
                                dataKey="mes"
                                tick={{ fontSize: 12, fill: "#595959" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#595959" }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                content={<TooltipEvolucao />}
                                cursor={{ stroke: "#e0e0e0", strokeWidth: 1 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#3d6eb0"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "#3d6eb0" }}
                                activeDot={{ r: 5 }}
                                name="total"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-x-1 gap-y-1 shrink-0 text-[12px]">
                    {evolucaoMensalData.map((d) => (
                        <div
                            key={d.mes}
                            className="flex flex-col gap-0 w-[151px] h-[93px] border border-[#DADADA p-3"
                        >
                            <p className="text-[#42474a] font-bold text-[13px]">
                                {d.mesLabel}
                                {d.mes === "Abr" ? ":" : ""}
                            </p>
                            <p className="text-[#595959]">
                                Total: {String(d.total).padStart(2, "0")}
                            </p>
                            <p className="text-[#595959]">
                                Patrimonial:{" "}
                                {String(d.patrimonial).padStart(2, "0")}
                            </p>
                            <p className="text-[#595959]">
                                Interpessoal:{" "}
                                {String(d.interpessoal).padStart(2, "0")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
