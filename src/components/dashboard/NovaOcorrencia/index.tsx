import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import PageHeader from "../PageHeader/PageHeader";

export default function NovaOcorrencia() {
    return (
        <div className="pt-4">
            <PageHeader title="Intercorrências Institucionais" />
            <QuadroBranco>
                <div className="flex flex-col">
                    <h1 className="text-[#42474a] text-[24px] font-bold m-0">
                        Nova ocorrência
                    </h1>
                    <span className="text-[14px] text-[#42474a] my-4">
                        Preencha as informações abaixo para registrar uma nova
                        ocorrência. Lembre-se de colocar a maior quantidade de
                        detalhes possíveis para nos ajudar a planejar ações de
                        prevenção e solução de problemas de segurança.
                    </span>
                    <p className="text-[14px] text-[#42474a]">
                        *Respostas obrigatórias
                    </p>
                </div>
            </QuadroBranco>
            <QuadroBranco>Formulário de nova ocorrência</QuadroBranco>
        </div>
    );
}
