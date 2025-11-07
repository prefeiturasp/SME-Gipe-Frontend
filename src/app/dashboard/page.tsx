import Header from "@/components/dashboard/NovaOcorrencia/Header";
import PageHeader from "@/components/dashboard/PageHeader/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import TabelaOcorrencias from "@/components/dashboard/TabelaOcorrencias";

export default function Dashboard() {
    return (
        <div className="pt-4">
            <PageHeader
                title="Intercorrências Institucionais"
                showBackButton={false}
            />
            <QuadroBranco>
                <Header />
            </QuadroBranco>
            <QuadroBranco>
                <TabelaOcorrencias />
            </QuadroBranco>
        </div>
    );
}
