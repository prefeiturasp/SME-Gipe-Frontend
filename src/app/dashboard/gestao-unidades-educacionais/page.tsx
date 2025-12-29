import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import Header from "@/components/dashboard/GestaoUnidadesEducacionais/Header";
import PageHeader from "@/components/dashboard/PageHeader/PageHeader";
import TabsContainer from "@/components/dashboard/GestaoUnidadesEducacionais/TabsContainer";

export default function UnidadesEducacionais() {
    return (
        <>
            <PageHeader title="Gestão de Unidades Educacionais" showBackButton={false} />
            <QuadroBranco>
                <Header />
            </QuadroBranco>
            <QuadroBranco>
                <p className="text-[14px] text-[#42474a]">
                    Confira as unidades educacionais ativas e inativas. Selecione a opção desejada nas abas.
                </p>
                <TabsContainer />
            </QuadroBranco>
        </>
    )
}
