import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import TabsContainer from "@/components/dashboard/Gestao/PessoaUsuaria/TabsContainer";

export default function PessoaUsuaria() {
    return (
        <QuadroBranco>
            <p className="text-[14px] text-[#42474a]">
                Confira os perfis ativos, inativos e pendentes de aprovação.
                Selecione a opção desejada nas abas.
            </p>
            <TabsContainer />
        </QuadroBranco>
    );
}
