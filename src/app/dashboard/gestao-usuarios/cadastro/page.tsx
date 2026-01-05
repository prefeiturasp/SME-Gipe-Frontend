import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import PageHeader from "@/components/dashboard/GestaoUsuarios/PageHeader/PageHeader";
import FormularioCadastroPessoaUsuaria from "@/components/dashboard/GestaoUsuarios/FormularioCadastro";

export default function CadastrarPessoaUsuaria() {
    return (
        <>
            <PageHeader title="Cadastrar pessoa usuária" edit={false} />
            <QuadroBranco>
                <FormularioCadastroPessoaUsuaria />
            </QuadroBranco>
        </>
    );
}
