import FormularioCadastroPessoaUsuaria from "@/components/dashboard/GestaoUsuarios/FormularioCadastro";
import PageHeader from "@/components/dashboard/GestaoUsuarios/PageHeader/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";

type EditarPessoaUsuariaProps = {
    params: {
        uuid: string;
    };
};

export default function EditarPessoaUsuaria({
    params,
}: Readonly<EditarPessoaUsuariaProps>) {
    return (
        <>
            <PageHeader title="Editar perfil" edit usuarioUuid={params.uuid} />
            <QuadroBranco>
                <FormularioCadastroPessoaUsuaria
                    mode="edit"
                    usuarioUuid={params.uuid}
                />
            </QuadroBranco>
        </>
    );
}
