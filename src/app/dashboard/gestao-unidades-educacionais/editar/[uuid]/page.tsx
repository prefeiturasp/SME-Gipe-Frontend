import FormularioCadastroUnidadeEducacional from "@/components/dashboard/GestaoUnidades/FormularioCadastroUnidadeEducacional";
import PageHeader from "@/components/dashboard/GestaoUnidades/PageHeader";
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
            <PageHeader title="Editar Unidade Educacional" edit />
            <QuadroBranco>
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid={params.uuid}
                />
            </QuadroBranco>
        </>
    );
}
