"use client";

import Header from "@/components/dashboard/CadastrarOcorrencia/Header";
import PageHeader from "@/components/dashboard/PageHeader/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import TabelaOcorrencias from "@/components/dashboard/TabelaOcorrencias";
import { useUserPermissions } from "@/hooks/useUserPermissions";

export default function Dashboard() {
    const { isAssistenteOuDiretor } = useUserPermissions();

    return (
        <div className="pt-4">
            <PageHeader
                title="Intercorrências Institucionais"
                showBackButton={false}
            />
            {isAssistenteOuDiretor && (
                <QuadroBranco>
                    <Header />
                </QuadroBranco>
            )}
            <QuadroBranco>
                <TabelaOcorrencias />
            </QuadroBranco>
        </div>
    );
}
