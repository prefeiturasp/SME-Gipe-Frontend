"use client";

import type { AnalyticsResponse } from "@/actions/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Calendar, Pencil, Users } from "lucide-react";
import GraficoDRE from "./GraficoDRE";
import GraficoEvolucaoMensal from "./GraficoEvolucaoMensal";
import GraficoStatusUE from "./GraficoStatusUE";
import GraficoTipoIntercorrencias from "./GraficoTipoIntercorrencias";

interface SummaryCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
}

function SummaryCard({ label, value, icon: Icon }: Readonly<SummaryCardProps>) {
    return (
        <div className="flex flex-col gap-6 bg-white rounded-[4px] border border-[#e0e0e0] px-4 py-4 flex-1 min-w-0 min-h-[127px]">
            <Icon size={20} className="text-[#5B78C7]" />
            <div className="flex flex-col gap-1">
                <p className="text-[#595959] text-[14px] leading-tight">
                    {label}
                </p>
                <p className="text-[#42474a] text-[20px] font-bold leading-none">
                    {value}
                </p>
            </div>
        </div>
    );
}

function SummaryCardSkeleton() {
    return (
        <div className="flex flex-col gap-6 bg-white rounded-[4px] border border-[#e0e0e0] px-4 py-4 flex-1 min-w-0 min-h-[127px]">
            <Skeleton className="w-5 h-5 rounded-[2px]" />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
            </div>
        </div>
    );
}

function extractCardValue(
    cards: Record<string, number>[] | undefined,
    key: string,
): number {
    if (!cards) return 0;
    const card = cards.find((c) => key in c);
    return card ? card[key] : 0;
}

interface DashboardAnaliticoProps {
    isLoading?: boolean;
    analyticsData?: AnalyticsResponse;
}

export default function DashboardAnalitico({
    isLoading = false,
    analyticsData,
}: Readonly<DashboardAnaliticoProps>) {
    const cards = analyticsData?.cards;

    return (
        <div className="flex-1 min-w-0 flex flex-col gap-4 m-4 overflow-y-auto">
            <div className="bg-white rounded-[4px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-4">
                <h1 className="text-[#42474a] text-[20px] font-bold">
                    Dashboard analítico de intercorrências
                </h1>
                <p className="text-[#42474a] text-[14px] font-normal">
                    Tenha um resumo rápido de alguns indicadores do sistema,
                    facilitando o acompanhamento e a análise.
                </p>

                <div className="flex gap-4">
                    {isLoading ? (
                        <>
                            <SummaryCardSkeleton />
                            <SummaryCardSkeleton />
                            <SummaryCardSkeleton />
                            <SummaryCardSkeleton />
                        </>
                    ) : (
                        <>
                            <SummaryCard
                                label="Total de intercorrências:"
                                value={extractCardValue(
                                    cards,
                                    "total_intercorrencia",
                                )}
                                icon={Pencil}
                            />
                            <SummaryCard
                                label="Intercorrências patrimoniais:"
                                value={extractCardValue(
                                    cards,
                                    "intercorrencias_patrimoniais",
                                )}
                                icon={AlertCircle}
                            />
                            <SummaryCard
                                label="Intercorrências interpessoais:"
                                value={extractCardValue(
                                    cards,
                                    "intercorrencias_interpessoais",
                                )}
                                icon={Users}
                            />
                            <SummaryCard
                                label="Média de registros por mês:"
                                value={extractCardValue(cards, "media_mensal")}
                                icon={Calendar}
                            />
                        </>
                    )}
                </div>
            </div>

            <GraficoDRE
                isLoading={isLoading}
                intercorrenciasDre={analyticsData?.intercorrencias_dre}
            />
            <GraficoStatusUE
                isLoading={isLoading}
                intercorrenciasStatus={analyticsData?.intercorrencias_status}
            />
            <GraficoEvolucaoMensal
                isLoading={isLoading}
                evolucaoMensal={analyticsData?.evolucao_mensal}
            />
            <GraficoTipoIntercorrencias isLoading={isLoading} />
        </div>
    );
}
