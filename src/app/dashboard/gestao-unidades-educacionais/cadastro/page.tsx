import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import PageHeader from "@/components/dashboard/PageHeader/PageHeader";
import FormularioCadastroUnidadeEducacional from "@/components/dashboard/GestaoUnidades/FormularioCadastroUnidadeEducacional";

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
