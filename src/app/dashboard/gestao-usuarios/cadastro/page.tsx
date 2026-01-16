import FormularioCadastroPessoaUsuaria from "@/components/dashboard/GestaoUsuarios/FormularioCadastro";
import PageHeader from "@/components/dashboard/GestaoUsuarios/PageHeader/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";

export default function CadastrarPessoaUsuaria() {
    return (
        <>
            <PageHeader title="Cadastrar perfil" edit={false} />
            <QuadroBranco>
                <FormularioCadastroPessoaUsuaria />
            </QuadroBranco>
        </>
    );
}
