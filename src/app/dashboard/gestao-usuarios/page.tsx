import Header from "@/components/dashboard/GestaoUsuarios/Header";
import TabsContainer from "@/components/dashboard/GestaoUsuarios/TabsContainer";
import PageHeader from "@/components/dashboard/PageHeader/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";

export default function GestaoUsuarios() {
    return (
        <>
            <PageHeader title="Gestão de perfis" showBackButton={false} />
            <QuadroBranco>
                <Header />
            </QuadroBranco>
            <QuadroBranco>
                <p className="text-[14px] text-[#42474a]">
                    Confira os perfis ativos, inativos e pendentes de aprovação.
                    Selecione a opção desejada nas abas.
                </p>
                <TabsContainer />
            </QuadroBranco>
        </>
    );
}
