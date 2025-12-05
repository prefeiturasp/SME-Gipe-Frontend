import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import TabsContainer from "@/components/dashboard/GestaoUsuarios/TabsContainer";
import Header from "@/components/dashboard/GestaoUsuarios/Header";
import PageHeader from "@/components/dashboard/PageHeader/PageHeader";

export default function GestaoUsuarios() {
    return (
        <>
            <PageHeader title="Gestão de usuários" showBackButton={false} />
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
