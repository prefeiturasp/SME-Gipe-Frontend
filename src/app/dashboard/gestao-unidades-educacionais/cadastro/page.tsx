import FormularioCadastroUnidadeEducacional from "@/components/dashboard/GestaoUnidades/FormularioCadastroUnidadeEducacional";
import PageHeader from "@/components/dashboard/GestaoUnidades/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";

export default function CadastrarUnidadeEducacional() {
    return (
        <>
            <PageHeader title="Cadastrar Unidade Educacional" />
            <QuadroBranco>
                <FormularioCadastroUnidadeEducacional />
            </QuadroBranco>
        </>
    );
}
