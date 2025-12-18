import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import PageHeader from "@/components/dashboard/PageHeader/PageHeader";
import FormularioCadastroPessoaUsuaria from "@/components/dashboard/GestaoUsuarios/FormularioCadastro";

type EditarPessoaUsuariaProps = {
    params: {
        uuid: string;
    };
};

export default function EditarPessoaUsuaria({
    params,
}: EditarPessoaUsuariaProps) {
    return (
        <>
            <PageHeader title="Editar pessoa usuária" />
            <QuadroBranco>
                <FormularioCadastroPessoaUsuaria
                    mode="edit"
                    usuarioUuid={params.uuid}
                />
            </QuadroBranco>
        </>
    );
}
