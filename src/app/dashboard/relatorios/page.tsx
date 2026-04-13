"use client";

import Export from "@/assets/icons/Export";
import DashboardAnalitico from "@/components/dashboard/ExtracaoDados/DashboardAnalitico";
import ExportacaoPDF, {
    type CapturedImages,
} from "@/components/dashboard/ExtracaoDados/ExportacaoPDF";
import FilterPanel, {
    type FilterState,
    filterStateInitial,
} from "@/components/dashboard/ExtracaoDados/FilterPanel";
import GraficoDRE from "@/components/dashboard/ExtracaoDados/GraficoDRE";
import GraficoEvolucaoMensal from "@/components/dashboard/ExtracaoDados/GraficoEvolucaoMensal";
import GraficoStatusUE from "@/components/dashboard/ExtracaoDados/GraficoStatusUE";
import {
    GraficoColunasVertical,
    GraficoMotivacoes,
} from "@/components/dashboard/ExtracaoDados/GraficoTipoIntercorrencias";
import {
    tiposInterpessoalData,
    tiposPatrimonialData,
} from "@/components/dashboard/ExtracaoDados/mockData";
import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import { toPng } from "html-to-image";
import { Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function ExtracaoDadosPage() {
    const [filterState, setFilterState] =
        useState<FilterState>(filterStateInitial);
    const [isExportando, setIsExportando] = useState(false);

    const refDRE = useRef<HTMLDivElement>(null);
    const refStatusUE = useRef<HTMLDivElement>(null);
    const refEvolucao = useRef<HTMLDivElement>(null);
    const refTiposPatrimonial = useRef<HTMLDivElement>(null);
    const refTiposInterpessoal = useRef<HTMLDivElement>(null);
    const refMotivacoes = useRef<HTMLDivElement>(null);

    const handleStateChange = useCallback((state: FilterState) => {
        setFilterState(state);
    }, []);

    async function handleExportar() {
        if (
            !refDRE.current ||
            !refStatusUE.current ||
            !refEvolucao.current ||
            !refTiposPatrimonial.current ||
            !refTiposInterpessoal.current ||
            !refMotivacoes.current
        )
            return;

        setIsExportando(true);
        try {
            const captureOpts = { pixelRatio: 2, backgroundColor: "#F5F6F8" };
            const [
                dre,
                statusUE,
                evolucaoMensal,
                tiposPatrimonial,
                tiposInterpessoal,
                motivacoes,
            ] = await Promise.all([
                toPng(refDRE.current, {
                    ...captureOpts,
                    backgroundColor: "#ffffff",
                }),
                toPng(refStatusUE.current, {
                    ...captureOpts,
                    backgroundColor: "#ffffff",
                }),
                toPng(refEvolucao.current, {
                    ...captureOpts,
                    backgroundColor: "#ffffff",
                }),
                toPng(refTiposPatrimonial.current, {
                    ...captureOpts,
                    backgroundColor: "#ffffff",
                }),
                toPng(refTiposInterpessoal.current, {
                    ...captureOpts,
                    backgroundColor: "#ffffff",
                }),
                toPng(refMotivacoes.current, {
                    ...captureOpts,
                    backgroundColor: "#ffffff",
                }),
            ]);

            const images: CapturedImages = {
                dre,
                statusUE,
                evolucaoMensal,
                tiposPatrimonial,
                tiposInterpessoal,
                motivacoes,
            };

            const blob = await pdf(
                <ExportacaoPDF filterState={filterState} images={images} />,
            ).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "relatorio-intercorrencias.pdf";
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setIsExportando(false);
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Zona de captura off-screen sempre montada para recharts inicializar */}
            <div
                aria-hidden="true"
                style={{
                    position: "fixed",
                    left: "-9999px",
                    top: 0,
                    width: "900px",
                    pointerEvents: "none",
                    zIndex: -1,
                }}
            >
                <div
                    ref={refDRE}
                    style={{ padding: "12px", background: "white" }}
                >
                    <GraficoDRE isLoading={false} pdfLayout />
                </div>
                <div
                    ref={refStatusUE}
                    style={{ padding: "12px", background: "white" }}
                >
                    <GraficoStatusUE isLoading={false} pdfLayout />
                </div>
                <div
                    ref={refEvolucao}
                    style={{ padding: "12px", background: "white" }}
                >
                    <GraficoEvolucaoMensal isLoading={false} pdfLayout />
                </div>
                <div
                    ref={refTiposPatrimonial}
                    style={{ padding: "24px", background: "white" }}
                >
                    <p
                        style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#42474A",
                            marginBottom: "12px",
                        }}
                    >
                        Intercorrências patrimoniais
                    </p>
                    <GraficoColunasVertical data={tiposPatrimonialData} />
                </div>
                <div
                    ref={refTiposInterpessoal}
                    style={{ padding: "24px", background: "white" }}
                >
                    <p
                        style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#42474A",
                            marginBottom: "12px",
                        }}
                    >
                        Intercorrências interpessoais
                    </p>
                    <GraficoColunasVertical data={tiposInterpessoalData} />
                </div>
                <div
                    ref={refMotivacoes}
                    style={{ padding: "24px", background: "white" }}
                >
                    <GraficoMotivacoes />
                </div>
            </div>

            <div className="flex items-end justify-between px-4">
                <div>
                    <h1 className="text-[#42474a] text-[20px] font-bold m-0">
                        Extração de dados
                    </h1>
                    <p className="text-[#595959] text-[13px] mt-1">
                        Confira todas as intercorrências registradas no sistema
                        e exporte os dados em PDF de forma rápida e prática.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-[#5B78C7] text-[#5B78C7] hover:bg-blue-50 text-[13px] shrink-0"
                    onClick={handleExportar}
                    disabled={isExportando}
                >
                    {isExportando ? (
                        <Loader2
                            width={14}
                            height={14}
                            className="animate-spin text-[#5B78C7]"
                        />
                    ) : (
                        <Export
                            width={14}
                            height={14}
                            className="fill-[#5B78C7]"
                        />
                    )}
                    {isExportando ? "Gerando PDF..." : "Exportar dados"}
                </Button>
            </div>

            <div className="flex gap-4 items-start flex-1 min-h-0 overflow-hidden">
                <FilterPanel onStateChange={handleStateChange} />
                <DashboardAnalitico />
            </div>
        </div>
    );
}
