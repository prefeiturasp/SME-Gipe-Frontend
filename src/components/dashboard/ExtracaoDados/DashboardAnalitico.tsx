"use client";

import type { LucideIcon } from "lucide-react";
import { AlertCircle, Calendar, Pencil, Users } from "lucide-react";
import GraficoDRE from "./GraficoDRE";
import GraficoEvolucaoMensal from "./GraficoEvolucaoMensal";
import GraficoStatusUE from "./GraficoStatusUE";
import GraficoTipoIntercorrencias from "./GraficoTipoIntercorrencias";
import { resumoCards } from "./mockData";

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

export default function DashboardAnalitico() {
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
                    <SummaryCard
                        label="Total de intercorrências:"
                        value={resumoCards.totalIntercorrencias}
                        icon={Pencil}
                    />
                    <SummaryCard
                        label="Intercorrências patrimoniais:"
                        value={resumoCards.intercorrenciasPatrimoniais}
                        icon={AlertCircle}
                    />
                    <SummaryCard
                        label="Intercorrências interpessoais:"
                        value={resumoCards.intercorrenciasInterpessoais}
                        icon={Users}
                    />
                    <SummaryCard
                        label="Média de registros por mês:"
                        value={resumoCards.mediaMensal}
                        icon={Calendar}
                    />
                </div>
            </div>

            <GraficoDRE />
            <GraficoStatusUE />
            <GraficoEvolucaoMensal />
            <GraficoTipoIntercorrencias />
        </div>
    );
}
