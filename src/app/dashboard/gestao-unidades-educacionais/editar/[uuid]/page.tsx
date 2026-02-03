import FormularioCadastroUnidadeEducacional from "@/components/dashboard/GestaoUnidadesEducacionais/FormularioCadastroUnidadeEducacional";
import PageHeader from "@/components/dashboard/GestaoUnidadesEducacionais/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";

type EditarUnidadeProps = {
    params: {
        uuid: string;
    };
};

export default function EditarUnidade({
    params,
}: Readonly<EditarUnidadeProps>) {
    return (
        <>
            <PageHeader
                title="Editar Unidade Educacional"
                edit
                unidadeUuid={params.uuid}
            />
            <QuadroBranco>
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid={params.uuid}
                />
            </QuadroBranco>
        </>
    );
}
