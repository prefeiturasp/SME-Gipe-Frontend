import FormularioCadastroUnidadeEducacional from "@/components/dashboard/GestaoUnidadesEducacionais/FormularioCadastroUnidadeEducacional";
import PageHeader from "@/components/dashboard/GestaoUnidadesEducacionais/PageHeader";
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
